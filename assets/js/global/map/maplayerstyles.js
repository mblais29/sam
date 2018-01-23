if($('body').is('#mapLayerStyles')){
	$(".panel").draggable();

}

function getLayerStyleValues(id){
	$('#layer-style-add').show();
}

function closeLayerStyleAddPanel(){
	$('#layer-style-add').slideUp();
	$('#layer-style-add').val("");
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
