if($('body').is('#mapLayers')){
	$(".panel").draggable();

}

function getLayers(id){
	$('#layer-create-add').show();
	$("button#layerAdd").attr("disabled", "disabled");
	getLayerStyles();
	getLayerForms();
}

function closeLayerCreateAddPanel(){
	$('#layer-create-add').slideUp();
	$('#layer-create-add input').val("");
	$('#layer-create-add textarea').val("");
	$('#layer-create-styles').empty();
	$('#layer-create-assigned-form').empty();
	$("button#layerAdd").attr("disabled", false);
	var newTypeValue = 'Type <span class="caret"></span>';
	$('button#layer-create-type-dropdown').html(newTypeValue);
}

function updateCreateTypedropdown(type){
	var newValue = type + ' <span class="caret"></span>';
	$('button#layer-create-type-dropdown').html(newValue);
	var lowercasevalue = type.toLowerCase();
	$('#layerCreateType').val(lowercasevalue);
}

function getLayerStyles(){
	$.ajax('/maplayers/retrieveLayers',{
      success: function(data) {
      	addToLayerStyleDropdown(data);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function addToLayerStyleDropdown(data){
	$('#layer-create-styles').append('<label class="control-label col-sm-3" for="layer-create-style">Style:</label>');
	$('#layer-create-styles').append('<div class="dropdown col-sm-8"><button class="btn btn-default dropdown-toggle" type="button" id="layer-create-style-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Style <span class="caret"></span></button><ul id="layerCreateStyleDropdown" class="dropdown-menu" aria-labelledby="layer-create-style-dropdown"></ul></div><input type="hidden" id="layerCreateStyle" name="layerCreateStyle" value="" />');
	
	var listOfStyles = "";
	for(var i = 0; i < data.length; i++){
		listOfStyles += '<li><a href="#" onclick="updateCreateStyledropdown(' + data[i].id + ', \'' + data[i].description + '\'); return false;">' + data[i].description + '</a></li>';
	}
	
	$('ul#layerCreateStyleDropdown').append(listOfStyles);
}

function updateCreateStyledropdown(id, desc){
	var newValue = desc + ' <span class="caret"></span>';
	$('button#layer-create-style-dropdown').html(newValue);
	$('#layerCreateStyle').val(id);
}

function getLayerForms(){
	$.ajax('/maplayers/retrieveForms',{
      success: function(data) {
      	addToLayerFormDropdown(data);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function addToLayerFormDropdown(data){
	$('#layer-create-assigned-form').append('<label class="control-label col-sm-3" for="layer-create-Form">Assigned Form:</label>');
	$('#layer-create-assigned-form').append('<div class="dropdown col-sm-8"><button class="btn btn-default dropdown-toggle" type="button" id="layer-create-form" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Assign Form <span class="caret"></span></button><ul id="layerCreateFormDropdown" class="dropdown-menu" aria-labelledby="layer-create-style-dropdown"></ul></div><input type="hidden" id="layerCreateForm" name="layerCreateForm" value="" />');
	
	var listOfForms = "";
	for(var i = 0; i < data.length; i++){
		listOfForms += '<li><a href="#" onclick="updateCreateFormdropdown(' + data[i].formid + ', \'' + data[i].formname + '\'); return false;">' + data[i].formname + '</a></li>';
	}
	
	$('ul#layerCreateFormDropdown').append(listOfForms);
}

function updateCreateFormdropdown(id, name){
	var newValue = name + ' <span class="caret"></span>';
	$('button#layer-create-form').html(newValue);
	$('#layerCreateForm').val(id);
}
