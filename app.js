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



    events: {
    	'app.activated'						      			: 'update',
		'ticket.custom_field_{{field_game}}.changed'    	: 'update',
		'ticket.custom_field_{{field_player_id}}.changed'   : 'update',
		'click #submit'							  			: 'addToList' 
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
    	this.$("#logo").css("background-image", "url('/api/v2/apps/35120/assets/" + this.ticket_data.logo + "')");
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
	
  };

}());