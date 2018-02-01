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

function closeEditLayerStyleAddPanel(){
	$('#layer-style-edit').slideUp();
	$('#layer-style-edit input').val("");
	var newTypeValue = 'Type <span class="caret"></span>';
	var newPrefixValue = 'Prefix <span class="caret"></span>';
	var newColourValue = 'Marker Colour <span class="caret"></span>';
	$('button#layer-type-dropdown-edit').html(newTypeValue);
	$('button#layer-edit-prefix-dropdown').html(newPrefixValue);
	$('button#layer-edit-colour-dropdown').html(newColourValue);
}

function updateTypedropdown(type){
	var newValue = type + ' <span class="caret"></span>';
	$('button#layer-type-dropdown').html(newValue);
	var lowercasevalue = type.toLowerCase();
	$('#layerType').val(lowercasevalue);
	if(lowercasevalue == 'point'){
		$('div#markerStyles').show();
	}else{
		$('input#markerPrefix').val("");
		$('input#markerColour').val("");
		$('input#marker-icon').val("");
		$('input#marker-icon-colour').val("");
		
		var newPrefixValue = 'Prefix <span class="caret"></span>';
		var newColourValue = 'Marker Colour <span class="caret"></span>';
		$('button#layer-prefix-dropdown').html(newPrefixValue);
		$('button#layer-colour-dropdown').html(newColourValue);
		$('div#markerStyles').hide();
	}
}

function updatePrefixdropdown(prefix, btnId, hiddenInput){
	var newValue = prefix + ' <span class="caret"></span>';
	$('button#' + btnId).html(newValue);
	var newValue = ""; 
	if(prefix == "Font Awesome"){
		newValue = "fa";
	}else{
		newValue = "glyphicon";
	}
	$('#' + hiddenInput).val(newValue);
}

function updateMarkerColourdropdown(colour, btnId, hiddenInput){
	var newValue = colour + ' <span class="caret"></span>';
	$('button#' + btnId).html(newValue);
	var lowercasevalue = colour.replace(/ /g, "").toLowerCase();
	$('#' + hiddenInput).val(lowercasevalue);
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
	$('input#layerStyleId').val(data[0].id);
	$('input#edit-description').val(data[0].description);
	$('#layer-type-dropdown-edit').val(editTypedropdown(data[0].type));
	$('input#layerStyleEdit').val(JSON.stringify(data[0].style).replace(/{/g, "").replace(/}/g, ""));
	if(data[0].type == 'point'){
		$('#markerEditStyles').show();
		updateEditPrefixdropdown(data[0].prefix);
		updateMarkerEditColourdropdown(data[0].markerColour);
		$('input#marker-edit-icon').val(data[0].markerIcon);
		$('input#marker-edit-icon-colour').val(data[0].markerIconColor);
	}else{
		$('input#markerEditPrefix').val("");
		$('input#markerEditColour').val("");
		$('input#marker-edit-icon').val("");
		$('input#marker-edit-icon-colour').val("");
		$('#markerEditStyles').hide();
	}
	
	
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
		$('div#markerEditStyles').show();
	}else{
		$('div#markerEditStyles').hide();
		$('input#markerEditColour').val("");
		$('input#markerEditPrefix').val("");
		$('input#marker-edit-icon').val("");
		$('input#marker-edit-icon-colour').val("");

		var newPrefixValue = 'Prefix <span class="caret"></span>';
		var newColourValue = 'Marker Colour <span class="caret"></span>';
		$('button#layer-edit-prefix-dropdown').html(newPrefixValue);
		$('button#layer-edit-colour-dropdown').html(newColourValue);
	}
}

function updateEditPrefixdropdown(prefix){
	var newPrefix = "";
	var newValue = "";
	
	if(prefix == "fa"){
		newValue = "fa";
		newPrefix = "Font Awesome";
	}else{
		newValue = "glyphicon";
		newPrefix = "Glyphicon";
	}
	$('#markerEditPrefix').val(newValue);
	var newValue = newPrefix + ' <span class="caret"></span>';
	$('button#layer-edit-prefix-dropdown').html(newValue); 
	
}

function updateMarkerEditColourdropdown(colour){
	var newValue = colour.charAt(0).toUpperCase() + colour.slice(1) + ' <span class="caret"></span>';
	$('button#layer-edit-colour-dropdown').html(newValue);
	var lowercasevalue = colour.replace(/ /g, "").toLowerCase();
	$('#markerEditColour').val(lowercasevalue);
}
