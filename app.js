(function() {
  return {

    ticket_data: {
		game                    : 'none',
        logo                    : 'none',
		player_id               : 'none'
    },

    reimbursement_list: [{
		name					: 'Temp',
		qty						: 456
	}] ,
	

    events: {
    	'app.activated'						      : 'update',
		'ticket.custom_field_22553724.changed'    : 'update',
		'ticket.custom_field_22717170.changed'    : 'update',
		'click #submit'							  : 'addToList' ,
		'click #test-input'						  : 'showAutocomplete' 
    },

	update: function() {
		this.ticket_data.game = this.ticket().customField("custom_field_" + this.setting('field_game'));
        this.ticket_data.logo = this.ticket_data.game + "-logo.png";
		this.ticket_data.player_id = this.ticket().customField("custom_field_" + this.setting('field_player_id'));
		
		this.renderContent();
	},

	showAutocomplete: function() {
		this.$('#test-input').autocomplete( "search", this.$('#test-input').val() );
	},

    renderContent: function() {
    	this.switchTo('content', this.ticket_data);
    	this.$("#logo").css("background-image", "url('/api/v2/apps/35120/assets/" + this.ticket_data.logo + "')");
    	this.$('#searchText').autocomplete({
		    source: ['test','test2'],
   			minLength: 0,
	    });
    },
	
	addToList: function() {
		this.reimbursement_list.push({name:this.$('#searchText').val(), qty: 1});
		this.renderContent();
	}
	
  };

}());