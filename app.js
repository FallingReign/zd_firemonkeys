(function() {

  return {

  	custom_field: {
    	game_id  				: '21043339',
    	player_id  				: '21210550'
    },

    ticket_data: {
		game                    : 'none',
        logo                    : 'none',
		player_id               : 'none'
    },

    events: {
    	'app.activated':'init'
    },

	init: function() {
		this.ticket_data.game = this.ticket().customField("custom_field_" + this.custom_field.game_id);
        this.ticket_data.logo = this.ticket().customField("custom_field_" + this.custom_field.game_id) + "-logo.png";
		this.ticket_data.player_id = this.ticket().customField("custom_field_" + this.custom_field.player_id);

		this.renderContent();
    },

    renderContent: function() {
    	this.switchTo('content', this.ticket_data);
    }
  };

}());
