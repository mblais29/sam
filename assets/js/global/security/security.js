if($('body').is('#securityIndex')){
	$('#securityAdd').on('click', function(){
		$('#sec-add').show();
	});
	
	$("#addsecgroup").on('click', 'li a', function(){
      $("#btn-formfield-type").text($(this).text());
      $("#btn-formfield-type").val($(this).text());
      $("#formfield-type-hidden").val($(this).text());
   });
};

/* FUNCTIONS */

function closeSecAddPanel(){
	$('#sec-add').slideUp();
	$('#secCreate input').val("");
}

function getSecurityValue(secid){
	$('#sec-edit').show();
	editSecPanel();
	$.ajax('/security/edit?secid=' + secid,{
      success: function(data) {
      	//console.log(data);
      	$('#sec-id').val(data.secid);
      	$('#secname').val(data.secname);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
};

function editSecPanel(){
	$('#secEditClose').on('click', function(){
		$('#sec-edit').slideUp();
		$('#secname').val("");
	});
}


	


