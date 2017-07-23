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
	
	$('#expenseEditClose').on('click', function(){
		$('#expense-edit').slideUp();
		$('#expenseEdit').trigger("reset");
		$("#btn-expenseCat").text('None');
	    $("#btn-expenseCat").val("");
	    $("#expenseCatHidden").val("");
	    $("#btn-expenseCli").text('None');
	    $("#btn-expenseCli").val("");
	    $("#expenseCliHidden").val("");
	    $("#btn-expenseCurrency").text('None');
	    $("#btn-expenseCurrency").val("");
	    $("#expenseCurrHidden").val("");
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

function getExpenseValue(id){
	$('#expense-edit').show();
	
	$.ajax('/expenses/retrieveExpenseRecord?expenseId=' + id,{
      success: function(data) {

      	$('#expense-id').val(data[0].id);
      	$('#expense-employee').val(data[0].employee);
      	$('#expense-name').val(data[0].name);
      	
      	if ($('#expenseCatDropdown').length === 0 && $('#expenseCliDropdown').length === 0 && $('#expenseCliDropdown').length === 0){
	        $('#expense-cat').append('<label class="control-label col-sm-3" for="expenseCat">Category:</label><div class="dropdown col-sm-9" id="expenseCatDropdown"><button class="btn btn-default dropdown-toggle" id="btn-expenseCat" type="button" data-toggle="dropdown">Select<span class="caret"></span></button>');
			$('#expenseCatDropdown').append('<input type="hidden" id="expenseCatHidden" name="expenseCatHidden" value="" /><ul class="dropdown-menu" id="expenseCatUl" ><li><a href="#">None</a></li></ul></div>');
	      	
	      	$('#expense-cli').append('<label class="control-label col-sm-3" for="expenseCli">Client:</label><div class="dropdown col-sm-9" id="expenseCliDropdown"><button class="btn btn-default dropdown-toggle" id="btn-expenseCli" type="button" data-toggle="dropdown">Select<span class="caret"></span></button>');
			$('#expenseCliDropdown').append('<input type="hidden" id="expenseCliHidden" name="expenseCliHidden" value="" /><ul class="dropdown-menu" id="expenseCliUl" ><li><a href="#">None</a></li></ul></div>'); 
	    	
	    	$('#expense-currency').append('<label class="control-label col-sm-3" for="expenseCurrency">Currency:</label><div class="dropdown col-sm-9" id="expenseCurrDropdown"><button class="btn btn-default dropdown-toggle" id="btn-expenseCurrency" type="button" data-toggle="dropdown">Select<span class="caret"></span></button>');
			$('#expenseCurrDropdown').append('<input type="hidden" id="expenseCurrHidden" name="expenseCurrHidden" value="" /><ul class="dropdown-menu" id="expenseCurrUl" ><li><a href="#">None</a></li></ul></div>'); 
	    
	    	addExpenseCatValues(data[0].category[0].id);
      		addExpenseCliValues(data[0].client[0].id);
      		addExpenseCurrValues(data[0].currency[0].currency);
	    }else{
	    	$('#expenseCatHidden').val(data[0].id);
      		$("#btn-expenseCat").html('[' + data[0].category[0].id + '] ' + data[0].category[0].description);
      		
      		$('#expenseCliHidden').val(data[0].id);
      		$("#btn-expenseCli").html('[' + data[0].client[0].id + '] ' + data[0].client[0].client);
      		
      		$('#expenseCurrHidden').val(data[0].id);
      		$("#btn-expenseCurrency").html('[' + data[0].currency[0].currency + '] ' + data[0].currency[0].currency);
	    }
	    
	    if ($('.expense_date').length === 0){
		    $('#expense-date').append('<label class="control-label col-sm-3" for="expenseDate">Date:</label>');
	        $('#expense-date').append('<div class="input-group date expense_date col-sm-9" data-date="" data-date-format="dd MM yyyy" data-link-field="expense-date" data-link-format="yyyy-mm-dd" ><input class="form-control" id="setCurrentDate" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
	        $('#expense-date').append('<input type="hidden" id="expenseDate" name="expenseDate" value="" />');
	        $('.expense_date').datetimepicker({
	        	format: "yyyy-mm-dd",
		        weekStart: 1,
		        todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				pickerPosition: "bottom-left",
				forceParse: 0
		    });
		    var setDate = data[0].date.substr(0,10);
		    $('#setCurrentDate').val(setDate);
		    $('.expense_date').datetimepicker('update', setDate);
		    $('#expenseDate').val(setDate);
		    
	    }else{
	    	var setDate = data[0].date.substr(0,10);
		    $('#setCurrentDate').val(setDate);
		    $('.expense_date').datetimepicker('update', setDate);
		    $('#expenseDate').val(setDate);
	    }
	    
	    $('#setCurrentDate').on('change', function(){
	    	var newValue = $('#setCurrentDate').val();
	    	$('#expenseDate').val(newValue);
	    });
	    
	    $('#expense-comment').val(data[0].comment);
	    $('#expense-amount').val(data[0].amount);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function addExpenseCatValues(id){
	$.ajax('/expensecategory/retrieveRecords', {
      success: function(data) {
      	for(var i = 0; i < data.length; i++){
      		if(data[i].id === id){
      			$('#expenseCatHidden').val(id);
      			$("#btn-expenseCat").html('[' + data[i].id + '] ' + data[i].description);
      		}
      		
      		$('#expenseCatUl').append('<li><a href="#">[' + data[i].id + '] ' + data[i].description + '</a></li>');
      	}
      	
      	$("#expenseCatDropdown").on('click', 'ul li a', function(){
	    	$("#btn-expenseCat").text($(this).text());
	    	$("#btn-expenseCat").val($(this).text());
	
			/* Removes the [] around the security.secid */
	    	var str = $("#btn-expenseCat").val();
	    	var regex = /\[(.*?)\]/g;
	    	var newStr = str.match(regex);
	    	if(newStr != null){
	    		var id = newStr[0].replace(/[\[\]']+/g, '');
	    	}
			$("#expenseCatHidden").val(id);
	    });
      	
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function addExpenseCliValues(id){
	$.ajax('/client/retrieveRecords', {
      success: function(data) {
      	for(var i = 0; i < data.length; i++){
      		if(data[i].id === id){
      			$('#expenseCliHidden').val(id);
      			$("#btn-expenseCli").html('[' + data[i].id + '] ' + data[i].client);
      		}
      		$('#expenseCliUl').append('<li><a href="#">[' + data[i].id + '] ' + data[i].client + '</a></li>');
      	}
      	
      	$("#expenseCliDropdown").on('click', 'ul li a', function(){
	    	$("#btn-expenseCli").text($(this).text());
	    	$("#btn-expenseCli").val($(this).text());
	
			/* Removes the [] around the security.secid */
	    	var str = $("#btn-expenseCli").val();
	    	var regex = /\[(.*?)\]/g;
	    	var newStr = str.match(regex);
	    	if(newStr != null){
	    		var id = newStr[0].replace(/[\[\]']+/g, '');
	    	}
			$("#expenseCliHidden").val(id);
	    });
	    
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function addExpenseCurrValues(currency){
	$.ajax('/currency/retrieveRecords', {
      success: function(data) {
      	for(var i = 0; i < data.length; i++){
      		if(data[i].currency === currency){
      			$('#expenseCurrHidden').val(currency);
      			$("#btn-expenseCurrency").html('[' + data[i].currency + '] ' + data[i].currency);
      		}
      		
      		$('#expenseCurrUl').append('<li><a href="#">[' + data[i].currency + '] ' + data[i].currency + '</a></li>');
      	}
      	
      	$("#expenseCurrDropdown").on('click', 'ul li a', function(){
	    	$("#btn-expenseCurrency").text($(this).text());
	    	$("#btn-expenseCurrency").val($(this).text());
	
			/* Removes the [] around the security.secid */
	    	var str = $("#btn-expenseCurrency").val();
	    	var regex = /\[(.*?)\]/g;
	    	var newStr = str.match(regex);
	    	if(newStr != null){
	    		var id = newStr[0].replace(/[\[\]']+/g, '');
	    	}
			$("#expenseCurrHidden").val(id);
	    });
	    
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}
