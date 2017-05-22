var tableId;
var addButtonId;

window.onload = function() {
	/* Grabs the table id for current page loaded */
        tableId = $('table').attr('id');
        addButtonId = $('table thead tr th button').attr('id');
};

/* FUNCTIONS */

function createButtonAddEvent(id){
	var showAddRecordPanel = $('div.panel-default').attr('id');
	$('#' + $('div.panel-default').attr('id')).show();
	switch(id){
		case 'formAdd': {
			$.get('/security/getSecgroupEnum')
				.done(function(data) {
					if ( $('#secGroupDropdown').children().length === 0 ) {
						for (i = 0; i < data.length; i++) { 
						    $('#secGroupDropdown').append('<li><a href="#">' + '[' + data[i].secid + '] ' + data[i].secname + '</a></li>');
						}
					}
  				}).error(function(err){
  					alert(err);
  				});
		break;
		}
	}
}

