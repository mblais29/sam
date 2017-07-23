if($('body').is('#clients')){
	$(".panel").draggable();
	
	$('#clientEditClose').on('click', function(){
		$('#client-edit').slideUp();
		$('#clientEdit').trigger("reset");
	});
};

function getClientValue(id){
	$('#client-edit').show();
	
	$.ajax('/client/retrieveClientRecord?clientId=' + id,{
      success: function(data) {
      	$('#client-id').val(data.id);
      	$('#client-name').val(data.client);
      	$('#client-address').val(data.address);
      	var phone = [];
      	phone.push(data.phone.split('-'));
      	$('#client-contact').val(data.contact);
      	$('#phone-1').val(phone[0][0]);
      	$('#phone-2').val(phone[0][1]);
      	$('#phone-3').val(phone[0][2]);
      	$('#client-email').val(data.email);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
};

function closeClientAddPanel(){
	$('#client-add').slideUp();
	$('input[type=text]').rules('remove'); 
	$('#clientCreate input').val("");
};

