if($('body').is('#currency')){
	$(".panel").draggable();

}

function closeCurrencyAddPanel(){
	$('#currency-add').slideUp();
	$('#currencyCreate input').val("");
}

function closeCurrencyEditPanel(){
	$('#currency-edit').slideUp();
	$('#currencyedit input').val("");
}

function getCurrencyValue(id){
	$('#currency-edit').show();
	
	$.ajax('/currency/retrieveCurrencyRecord?currency=' + id,{
      success: function(data) {
      	$('#currencyTypeEdit').val(data.currency);
      	$('#currencySymEdit').val(data.symbol);
      	$('#currencyDescEdit').val(data.description);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function forceUpperCaseAdd() {
    var x = document.getElementById("currencyType");
    x.value = x.value.toUpperCase();
}

function forceUpperCaseEdit(){
	var x = document.getElementById("currencyTypeEdit");
    x.value = x.value.toUpperCase();
}
