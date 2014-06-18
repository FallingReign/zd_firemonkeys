

(function() {
  return {

  	custom_field: {
    	game_id  				: '22553724',
    	player_id  				: '22717170'
    },

    ticket_data: {
		game                    : 'none',
        logo                    : 'none',
		player_id               : 'none'
    },

    reimbursement_list: [{
		name			: 'Temp',
		qty				: 456
	}] ,

    events: {
    	'app.activated'						      : 'update',
		'ticket.custom_field_22553724.changed'    : 'update',
		'ticket.custom_field_22717170.changed'    : 'update',
		'click #submit'							  : 'addToList' ,
		'click #test-input'						  : 'showAutocomplete' 
    },

	update: function() {
		this.ticket_data.game = this.ticket().customField("custom_field_" + this.custom_field.game_id);
        this.ticket_data.logo = this.ticket().customField("custom_field_" + this.custom_field.game_id) + "-logo";
		this.ticket_data.player_id = this.ticket().customField("custom_field_" + this.custom_field.player_id);

		this.renderContent();
	},

	showAutocomplete: function() {
		this.$('#test-input').autocomplete( "search", this.$('#test-input').val() );
	},

    renderContent: function() {
    	this.switchTo('content', this.ticket_data);
    	this.$("#logo").addClass( this.ticket_data.logo );

    	this.$('#searchText').autocomplete({
		    source: ['test','test2'],
   			minLength: 0,
	    });
    },
	
	addToList: function() {
		this.reimbursement_list.push({name:this.$('#searchText').val(), qty: 1});
	}
	
  };

}());