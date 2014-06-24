(function() {
  return {

    resources: {
		GAME                    : 'null',
        LOGO                    : 'null',
		PLAYER_ID               : 'null',
		LEVEL 					: '',
		RESULT 					: '',
		SFP						: '',
		RR3						: '',
		REGEX					: /\d+/,
		purchase_data			: [{
			'simoleons'			: [],
			'lifepoints'		: [],
			'socialpoints'		: []
		}],
		reimbursement_list      : []

    },

    requests: {
    	'getUser': function(id) {
	        return {
	        	url: helpers.fmt("/api/v2/users/%@.json?include=identities,organizations", id),
	          	dataType: 'json'
	        };
	    },
    },

    events: {
    	'app.activated'						      			: 'init',
		'ticket.custom_field_{{field_game}}.changed'    	: 'update',
		'ticket.custom_field_{{field_player_id}}.changed'   : 'update',
		'click #submit'							  			: 'addToList',
		'click #clear'										: 'clearList',
        'getUser.done'										: 'afterGetUser',
    },

    init: function() {
    	this.update();
    	// Parse csv data in the settings into JSON object.
    	// This allows the modification of the package information 
    	// without having to update app.
    	this.resources.purchase_data.simoleons = this.csvToJSON(this.setting('purchase_simoleons'));
    	this.resources.purchase_data.lifepoints = this.csvToJSON(this.setting('purchase_lifepoints'));
    	this.resources.purchase_data.socialpoints = this.csvToJSON(this.setting('purchase_socialpoints'));

    	this.$('#resultText').attr("disabled", true);
	    this.$('#clear').attr("disabled", true);

 		this.ajax('getUser', this.ticket().requester().id()); // Nick is 465739980
    },

	afterGetUser: function(data) {
    	alert(data.user.user_fields[this.resources.GAME + "_ccid"]);
    },

	update: function() {
		// Determine which game ticket is for. Changes dynamically when
		// field is changed. Also sets the logo for appropriate game.
		// Updates the Player ID dynamically as well.
		this.resources.GAME = this.ticket().customField("custom_field_" + this.setting('field_game'));
        this.resources.LOGO = this.resources.GAME + "-logo.png";
		this.resources.PLAYER_ID = this.resources.REGEX.exec(this.ticket().customField("custom_field_" + this.setting('field_player_id')));

		// Sets value of game to true to display game specific content
		// Kind of sloppy, want to find better way
		if (this.resources.GAME == 'sfp') {
			this.resources.SFP = "true";
			this.resources.RR3 = '';
		} else if (this.resources.GAME == 'rr3') {
			this.resources.RR3 = "true";
			this.resources.SFP = '';
		} else {

		};

		this.renderContent();
	},

	clearList: function () {
		this.resources.reimbursement_list = [];
		this.update();
		this.$('#resultText').attr("disabled", true);
    	this.$('#clear').attr("disabled", true);

	},

    renderContent: function() {				
    	this.switchTo('content', this.resources);

    	if (this.resources.GAME == 'sfp') {
	    	this.$('#searchText').autocomplete({
			    source: ['Handful of Simoleons',
			    		 'Pile of Simoleons',
			    		 'Piggybank of Simoleons',
			    		 'Sack of Simoleons',
			    		 'Trunk of Simoleons',
			    		 'Bank of Simoleons',
			    		 'Treasury of Simoleons',
			    		 'Handful of Lifepoints',
			    		 'Bucket of Lifepoints',
			    		 'Box of Lifepoints',
			    		 'Barrow of Lifepoints',
			    		 'Carload of Lifepoints',
			    		 'Truckload of Lifepoints',
			    		 'Boatload of Lifepoints',
			    		 'Handful of Socialpoints',
			    		 'Assortment of Socialpoints',
			    		 'Birthday Cake of Socialpoints',
			    		 'Pinata of Socialpoints',
			    		 'Shipping Crate of Socialpoints',
			    		 'Swimming Pool of Socialpoints',
			    		 'Plane of Socialpoints'],
	   			minLength: 0,
		    });
	    } else if (this.resources.GAME == 'rr3') {
	    	this.$('#searchText').autocomplete({
			    source: ['Handful of Gold',
			    		 'Pocketful of Gold',
			    		 'Pile of Gold',
			    		 'Stack of Gold',
			    		 'Heap of Gold',
			    		 'Truckload of Gold',
			    		 'Grey Card',
			    		 'Blue Card',
			    		 'Black Card',
			    		 'Silver Card',
			    		 'Gold Card',
			    		 'Platinum Card'],
	   			minLength: 0,
	    	});
	    };
    },
	
	addToList: function() {
		this.$('#resultText').attr("disabled", false);
    	this.$('#clear').attr("disabled", false);
		// Adds the searched packs to a list
		for (index = 0; index < this.resources.reimbursement_list.length; ++index) {
			if (this.resources.reimbursement_list[index].item_name == this.$('#searchText').val()){
				++this.resources.reimbursement_list[index].qty;	
				this.reimResult();	
				this.renderContent();
				return;
			};
		};

		var regex = /\w+$/
		var lastWord = regex.exec(this.$('#searchText').val().toLowerCase());

		regex = /^\w+/
		var firstWord = regex.exec(this.$('#searchText').val().toLowerCase());

		var level = 1;
		if (lastWord == 'simoleons') {
			level = this.resources.LEVEL = this.$('#sim_level').val();
		}

		try {
			this.resources.reimbursement_list.push({item_name:this.$('#searchText').val(), type: lastWord, value:this.resources.purchase_data[lastWord][level - 1][firstWord], qty: 1});
		}
		catch(err) {
			alert("There was an error adding items: " + err);
		}
		this.reimResult();
		this.renderContent();
	},

	reimResult: function() {
		//_.each(this.resources.reimbursement_list, function(e, item){});

		var result = [];

		_.each(this.resources.reimbursement_list, function(field) {
      		result.push(field.type + ":" + parseInt(field.value) * field.qty);
    	});

		this.resources.RESULT = result.join(", ");
	},

	csvToArray: function(strData, strDelimiter) {
	    // Check to see if the delimiter is defined. If not,
	    // then default to comma.
	    strDelimiter = (strDelimiter || ",");
	    // Create a regular expression to parse the CSV values.
	    var objPattern = new RegExp((
	    // Delimiters.
	    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
	    // Quoted fields.
	    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
	    // Standard fields.
	    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
	    // Create an array to hold our data. Give the array
	    // a default empty first row.
	    var arrData = [[]];
	    // Create an array to hold our individual pattern
	    // matching groups.
	    var arrMatches = null;
	    // Keep looping over the regular expression matches
	    // until we can no longer find a match.
	    while (arrMatches = objPattern.exec(strData)) {
	        // Get the delimiter that was found.
	        var strMatchedDelimiter = arrMatches[1];
	        // Check to see if the given delimiter has a length
	        // (is not the start of string) and if it matches
	        // field delimiter. If id does not, then we know
	        // that this delimiter is a row delimiter.
	        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
	            // Since we have reached a new row of data,
	            // add an empty row to our data array.
	            arrData.push([]);
	        }
	        // Now that we have our delimiter out of the way,
	        // let's check to see which kind of value we
	        // captured (quoted or unquoted).
	        if (arrMatches[2]) {
	            // We found a quoted value. When we capture
	            // this value, unescape any double quotes.
	            var strMatchedValue = arrMatches[2].replace(
	            new RegExp("\"\"", "g"), "\"");
	        } else {
	            // We found a non-quoted value.
	            var strMatchedValue = arrMatches[3];
	        }
	        // Now that we have our value string, let's add
	        // it to the data array.
	        arrData[arrData.length - 1].push(strMatchedValue);
	    }
	    // Return the parsed data.
	    return (arrData);
	},

	csvToJSON: function(csv) {
	    var array = this.csvToArray(csv);
	    var objArray = [];
	    for (var i = 1; i < array.length; i++) {
	        objArray[i - 1] = {};
	        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
	            var key = array[0][k];
	            objArray[i - 1][key] = array[i][k]
	        }
	    }

	    
	    var json = JSON.stringify(objArray);
	    var str = json.replace(/ },/g, "},\r\n");

	    return JSON.parse(str);
	}

  };

}());