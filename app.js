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

    events: {
    	'app.activated'						      : 'init',
		'ticket.custom_field_22553724.changed'    : 'init',
		'ticket.custom_field_22717170.changed'    : 'init',
		'click .submit'							  : 'addToList' 
		 
    },

	init: function() {
		this.ticket_data.game = this.ticket().customField("custom_field_" + this.custom_field.game_id);
        this.ticket_data.logo = this.ticket().customField("custom_field_" + this.custom_field.game_id) + "-logo.png";
		this.ticket_data.player_id = this.ticket().customField("custom_field_" + this.custom_field.player_id);
		
		if (this.ticket_data.game == 'rr3'){
			this.renderRR3Content();
		} else if (this.ticket_data.game == 'sfp'){
			this.renderSFPContent();
		} else {

		};
		
    },

    renderRR3Content: function() {
    	this.switchTo('rr3_content', this.ticket_data);
    },
	
    renderSFPContent: function() {
    	this.switchTo('sfp_content', this.ticket_data);
    },
	
	addToList: function() {
		alert("test");
	}
	
  };

}());
