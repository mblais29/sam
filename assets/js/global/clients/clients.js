if($('body').is('#clients')){
	$(".panel").draggable();
	
	function closeClientAddPanel(){
		$('#client-add').slideUp();
		$('input[type=text]').rules('remove'); 
		$('#clientCreate input').val("");
	}

}