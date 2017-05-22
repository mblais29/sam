$(document).ready(function(){
	$('#formCreate').validate({
		rules: {
			formName: {
				required: true
			},
			formSecurity: {
				required: true
			}
		},
		//Tells the user it is valid when typing
		success: function(element){
			//Need to create custom.less with valid class style
			element.text('OK!').addClass('valid');
		}
	});
});