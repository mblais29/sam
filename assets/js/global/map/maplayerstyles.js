if($('body').is('#mapLayerStyles')){
	$(".panel").draggable();

}

function getLayerStyleValues(id){
	$('#layer-style-add').show();
}

function closeLayerStyleAddPanel(){
	$('#layer-style-add').slideUp();
	$('#layer-style-add input').val("");
	var newTypeValue = 'Type <span class="caret"></span>';
	var newPrefixValue = 'Prefix <span class="caret"></span>';
	var newColourValue = 'Marker Colour <span class="caret"></span>';
	$('button#layer-type-dropdown').html(newTypeValue);
	$('button#layer-prefix-dropdown').html(newPrefixValue);
	$('button#layer-colour-dropdown').html(newColourValue);
}

function updateTypedropdown(type){
	var newValue = type + ' <span class="caret"></span>';
	$('button#layer-type-dropdown').html(newValue);
	var lowercasevalue = type.toLowerCase();
	$('#layerType').val(lowercasevalue);
	if(lowercasevalue == 'point'){
		$('div#markerStyles').show();
	}else{
		$('div#markerStyles').hide();
	}
}

function updatePrefixdropdown(prefix){
	var newValue = prefix + ' <span class="caret"></span>';
	$('button#layer-prefix-dropdown').html(newValue);
	var newValue = ""; 
	if(prefix == "Font Awesome"){
		newValue = "fa";
	}else{
		newValue = "glyphicon";
	}
	$('#markerPrefix').val(newValue);
}

function updateMarkerColourdropdown(colour){
	var newValue = colour + ' <span class="caret"></span>';
	$('button#layer-colour-dropdown').html(newValue);
	var lowercasevalue = colour.replace(/ /g, "").toLowerCase();
	$('#markerColour').val(lowercasevalue);
}

function getLayerStyleValue(styleId){
	$.ajax('/maplayerstyles/retrieveStyleRecord?styleId=' + styleId,{
      success: function(data) {
      	console.log(data);
      	$('#layer-style-edit').show();
        populateEditForm(data);
      }
 	});
}

function populateEditForm(data){
	$('input#edit-description').val(data[0].description);
	$('#layer-type-dropdown-edit').val(editTypedropdown(data[0].type));
	$('input#layerStyleEdit').val(JSON.stringify(data[0].style).replace(/{/g, "").replace(/}/g, ""));
	
}

function editTypedropdown(type){
	var newValue = type.charAt(0).toUpperCase() + type.slice(1) + ' <span class="caret"></span>';
	$('button#layer-type-dropdown-edit').html(newValue);
	var lowercasevalue = type.toLowerCase();
	$('#layerTypeEdit').val(lowercasevalue);
	if(lowercasevalue == 'point'){
		$('div#markerStyles').show();
	}else{
		$('div#markerStyles').hide();
	}
}

function updateEditTypedropdown(type){
	var newValue = type + ' <span class="caret"></span>';
	$('button#layer-type-dropdown-edit').html(newValue);
	var lowercasevalue = type.toLowerCase();
	$('#layerTypeEdit').val(lowercasevalue);
	if(lowercasevalue == 'point'){
		$('div#markerStyles').show();
	}else{
		$('div#markerStyles').hide();
	}
}
