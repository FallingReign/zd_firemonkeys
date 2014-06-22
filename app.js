(function() {
  return {

    resources: {
		GAME                    : 'null',
        LOGO                    : 'null',
		PLAYER_ID               : 'null',
		SFP						: 'null',
		RR3						: 'null',
		REGEX					: /\d+/,
		parsed_simoleons		: '',
		parsed_lifepoints		: '',
		parsed_socialpoints		: '',
		reimbursement_list      : [{
			item_name				: '',
			qty						: ''
		}],
		simoleon_packs			: [{
			level					: '',
			item_name				: '',
			item_value				: ''
		}],
		lifepoint_packs			: [{
			item_name				: '',
			item_value				: ''
		}],
		socialpoint_packs			: [{
			item_name				: '',
			item_value				: ''
		}]

    },

    events: {
    	'app.activated'						      			: 'init',
		'ticket.custom_field_{{field_game}}.changed'    	: 'update',
		'ticket.custom_field_{{field_player_id}}.changed'   : 'update',
		'click #submit'							  			: 'addToList' 
    },

    init: function() {
    	this.update();
    	this.resources.parsed_simoleons = this.csvToJSON(this.setting('purchase_simoleons'));
    	this.resources.parsed_lifepoints = this.csvToJSON(this.setting('purchase_lifepoints'));
    	this.resources.parsed_socialpoints = this.csvToJSON(this.setting('purchase_socialpoints'));
		this.complexArray(this.resources.parsed_simoleons, this.resources.simoleon_packs);
		this.simpleArray(this.resources.parsed_lifepoints, this.resources.lifepoint_packs);
		this.simpleArray(this.resources.parsed_socialpoints, this.resources.socialpoint_packs);
		
    },

	update: function() {
		this.resources.GAME = this.ticket().customField("custom_field_" + this.setting('field_game'));
        this.resources.LOGO = this.resources.GAME + "-logo.png";
		this.resources.PLAYER_ID = this.resources.REGEX.exec(this.ticket().customField("custom_field_" + this.setting('field_player_id')));

		if (this.resources.GAME == 'sfp') {
			this.resources.SFP = "true";
			this.resources.RR3 = "";
		} else if (this.resources.GAME == 'rr3') {
			this.resources.RR3 = "true";
			this.resources.SFP = "";
		} else {

		};
		this.renderContent();
	},

    renderContent: function() {				
    	this.switchTo('content', this.resources);
    	this.$('#searchText').autocomplete({
		    source: ['test','test2'],
   			minLength: 0,
	    });
    },
	
	addToList: function() {
		for (index = 0; index < this.resources.reimbursement_list.length; ++index) {
			if (this.resources.reimbursement_list[index].item_name == this.$('#searchText').val()){
				++this.resources.reimbursement_list[index].qty;				
				this.renderContent();
				return;
			};
		};
		this.resources.reimbursement_list.push({item_name:this.$('#searchText').val(), qty: 1});
		this.renderContent();
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

	    return objArray;
	},
	
	complexArray: function(target, arr) {
		var json = target;
		var keys = Object.keys(json);
		keys.forEach(function(index) {
			var key = Object.keys(json[index]);
			key.forEach(function(item) {
				var val = json[index][item];
				var num = parseInt(index);
				++num;
				arr.push({level:num, item_name:item, item_value:parseInt(val)});
			});
		});
		
	},
	
	simpleArray: function(target, arr) {
		var json = target;
		var keys = Object.keys(json);
		keys.forEach(function(index) {
			var key = Object.keys(json[index]);
			key.forEach(function(item) {
				var val = json[index][item];
				arr.push({item_name:item, item_value:parseInt(val)});
			});
		});
		
	}
	
  };

}());