$(document).ready(function(){
	$('#resetPasswordForm').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 6
			},
			confirmation: {
				equalTo: "#password",
				minlength: 6
			}
		},
		//Tells the user it is valid when typing
		success: function(element){
			//Need to create custom.less with valid class style
			element.text('OK!').addClass('valid');
		}
	});
});
