if($('body').is('#propertiesIndex')){
	$("#property-add").draggable();
	$("#property-edit").draggable();
	
	$('#addReceiptClose').on('click', function(){
		$('#add-receipt').slideUp();
		$("#receipt-upload").filestyle('clear');
	});
	
	$('#propertyEditClose').on('click', function(){
		$('#property-edit').slideUp();
		$('#propertyEdit input').val("");
	});
	
	
	addPropertyCliValues();
};


function closePropertyAddPanel(){
	$('#property-add').slideUp();
	$('#propertyCreate input').val("");
};

function getPropertyValue(id){
	$('#property-edit').show();
	
	$.ajax('/properties/getSelectedRecord?id=' + id, {
      success: function(data) {

		var currentClient = data[0].client[0].id;
      	$('#property-id').val(data[0].id);
      	$('#property-address').val(data[0].address);
      	$('#desc').val(data[0].description);
      	
      	addClientValues(currentClient);
      }
    });
   
};

function addClientValues(currentClient){
	$.ajax('/client/retrieveRecords', {
      success: function(data) {
      	var exists = $('#propertyClientDropdown').length;
		if(exists == 0){
	      	$('#property-client').append('<label class="control-label col-sm-2" for="propertyclient">Client:</label><div class="dropdown col-sm-9" id="propertyClientDropdown"><button class="btn btn-default dropdown-toggle" id="btn-propertyClient" type="button" data-toggle="dropdown">Select<span class="caret"></span></button>');
			$('#propertyClientDropdown').append('<input type="hidden" id="propertyClientHidden" name="propertyClientHidden" value="" /><ul class="dropdown-menu" id="propertyClientUl" ><li><a href="#" onclick="event.preventDefault();" >None</a></li></ul></div>'); 
		}	
	      	for(var i = 0; i < data.length; i++){

	  			if(data[i].id === currentClient){
	  				if(exists == 0){
	  					$('#propertyClientUl').append('<li><a href="#" onclick="event.preventDefault();">[' + data[i].id + '] ' + data[i].client + '</a></li>');
	  				}
	  				$("#btn-propertyClient").text('[' + data[i].id + '] ' + data[i].client);
		    		$("#btn-propertyClient").val('[' + data[i].id + '] ' + data[i].client);
		    		$("#propertyClientHidden").val(data[i].id);
	  			}else{
	  				if(exists == 0){
	  					$('#propertyClientUl').append('<li><a href="#" onclick="event.preventDefault();">[' + data[i].id + '] ' + data[i].client + '</a></li>');
	  				}
	  			}
	      		
	      	}
	      	
	      	$("#propertyClientDropdown").on('click', 'ul li a', function(){
		    	$("#btn-propertyClient").text($(this).text());
		    	$("#btn-propertyClient").val($(this).text());
		
				var id = "";
		    	var str = $("#btn-propertyClient").val();
		    	var regex = /\[(.*?)\]/g;
		    	var newStr = str.match(regex);
		    	if(newStr != null){
		    		id = newStr[0].replace(/[\[\]']+/g, '');
		    	}
				$("#propertyClientHidden").val(id);
		    });
	    
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}




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

