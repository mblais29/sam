if($('body').is('#propertiesIndex')){
	$("#property-add").draggable();
	
	$('#addReceiptClose').on('click', function(){
		$('#add-receipt').slideUp();
		$("#receipt-upload").filestyle('clear');
	});
	
	addPropertyCliValues();
};

function closePropertyAddPanel(){
	$('#property-add').slideUp();
	$('#propertyCreate input').val("");
};

function addPropertyCliValues(){
	$.ajax('/client/retrieveRecords', {
      success: function(data) {

      	$('#property-cli').append('<label class="control-label col-sm-2" for="propertyCli">Client:</label><div class="dropdown col-sm-9" id="propertyCliDropdown"><button class="btn btn-default dropdown-toggle" id="btn-propertyCli" type="button" data-toggle="dropdown">Select<span class="caret"></span></button>');
		$('#propertyCliDropdown').append('<input type="hidden" id="propertyCliHidden" name="propertyCliHidden" value="" /><ul class="dropdown-menu" id="propertyCliUl" ><li><a href="#" onclick="event.preventDefault();" selected="selected">None</a></li></ul></div>'); 
	    	
      	for(var i = 0; i < data.length; i++){
  			$('#propertyCliHidden').val(data[i].id);
      		$('#propertyCliUl').append('<li><a href="#" onclick="event.preventDefault();">[' + data[i].id + '] ' + data[i].client + '</a></li>');
      	}
      	
      	$("#propertyCliDropdown").on('click', 'ul li a', function(){
	    	$("#btn-propertyCli").text($(this).text());
	    	$("#btn-propertyCli").val($(this).text());
	
			var id = "";
	    	var str = $("#btn-propertyCli").val();
	    	var regex = /\[(.*?)\]/g;
	    	var newStr = str.match(regex);
	    	if(newStr != null){
	    		id = newStr[0].replace(/[\[\]']+/g, '');
	    	}
			$("#propertyCliHidden").val(id);
	    });
	    
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

