if($('body').is('#expenses')){
	
	$('#addReceiptClose').on('click', function(){
		$('#add-receipt').slideUp();
		$("#receipt-upload").filestyle('clear');
	});
	
    $("#receipt-upload").filestyle({
		size: 'sm',
		buttonName : 'btn-info',
		buttonText : 'Add',
		placeholder: "No file"
	});
}

function addReceipt(id){
	$('#expenseId').val(id);
	$('#add-receipt').show();
}

function confirmDeletedDocument(e){
	if (confirm('Are you sure you want to remove the file?') === true) {
		$('#expense-receipts-form-remove').submit();
    }else{
    	e.preventDefault();
    }
}

function submitExpenseForm(){
	$('#addReceipt').submit();
}