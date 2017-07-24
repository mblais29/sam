if($('body').is('#expensecategory')){
	$('#expenseCatAddClose').on('click', function(){
		$('#expenseCat-add').slideUp();
		$('#expenseCatCreate').trigger("reset");
	});	
	
	$('#expenseCatEditClose').on('click', function(){
		$('#expenseCat-edit').slideUp();
		$('#expenseCatEdit').trigger("reset");
	});	
	
}

function getExpenseCatValue(id){
	$('#expenseCat-edit').show();
	
	$.ajax('/expensecategory/retrieveExpenseCatRecord?expenseCatId=' + id,{
      success: function(data) {
		$('#expenseCat-id').val(data.id);
		$('#expenseCat-category').val(data.category);
		$('#expenseCat-desc').val(data.description);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}


