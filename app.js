(function() {
  return {

    ticket_data: {
		game                    : 'null',
        logo                    : 'null',
		player_id               : 'null',
		sfp						: 'null',
		rr3						: 'null',
		regex					: /\d+/,
		reimbursement_list      : [{
			item_name				: '',
			qty						: ''
		}]

    },

    purchase_data: {
    	csv 					: "level,handful,bucket\n1,100,200\n2,200,400\n3,300,600",
		parsed					: ''
    },

    events: {
    	'app.activated'						      			: 'init',
		'ticket.custom_field_{{field_game}}.changed'    	: 'update',
		'ticket.custom_field_{{field_player_id}}.changed'   : 'update',
		'click #submit'							  			: 'addToList' 
    },

    init: function() {
    	this.update();
    	this.purchase_data.parsed = this.csvToJSON(this.setting('purchase_simoleons'));
    	alert(this.purchase_data.parsed);
    },

	update: function() {
		this.ticket_data.game = this.ticket().customField("custom_field_" + this.setting('field_game'));
        this.ticket_data.logo = this.ticket_data.game + "-logo.png";
		this.ticket_data.player_id = this.ticket_data.regex.exec(this.ticket().customField("custom_field_" + this.setting('field_player_id')));

		if (this.ticket_data.game == 'sfp') {
			this.ticket_data.sfp = "true";
			this.ticket_data.rr3 = "";
		} else if (this.ticket_data.game == 'rr3') {
			this.ticket_data.rr3 = "true";
			this.ticket_data.sfp = "";
		} else {

		};
		this.renderContent();
	},

    renderContent: function() {
    	this.switchTo('content', this.ticket_data);
    	this.$('#searchText').autocomplete({
		    source: ['test','test2'],
   			minLength: 0,
	    });
    },
	
	addToList: function() {
		for (index = 0; index < this.ticket_data.reimbursement_list.length; ++index) {
			if (this.ticket_data.reimbursement_list[index].item_name == this.$('#searchText').val()){
				++this.ticket_data.reimbursement_list[index].qty;
				this.renderContent();
				return;
			};
		};
		this.ticket_data.reimbursement_list.push({item_name:this.$('#searchText').val(), qty: 1});
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
	    var str = json.replace(/},/g, "},\r\n");

	    return str;
	}
	
  };

}());