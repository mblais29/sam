if($('body').is('#mapLayers')){
	$(".panel").draggable();
	$('#maplayerEditClose').on('click', function(){
		closeLayerEditPanel();
	});

}

function getLayers(id){
	$('#layer-create-add').show();
	$("button#layerAdd").attr("disabled", "disabled");
	getLayerStyles();
	getLayerForms();
}

function editLayers(id){
	$('#layer-create-edit').show();
	getLayerInfo(id);
	$("button#layerAdd").attr("disabled", "disabled");
}

function getLayerInfo(id){
	$.ajax('/maplayers/retrieveSelectedLayer?id=' + id,{
      success: function(data) {
      	addLayerInfoToEditPanel(data);
      	var layerStyleId = data[0].layerstyle[0].id;
      	
      	var layerForm = data[0].layerassignedform[0];
      	var layerFormId = "";
      	if(layerForm != undefined){
      		layerFormId = data[0].layerassignedform[0].formid;
      	}
      	getLayerStylesEditPanel(layerStyleId);
      	getFormsEditPanel(layerFormId);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function addLayerInfoToEditPanel(data){
	$('#layer-edit-id').val(data[0].layerid);
	$('#layer-edit-name').val(data[0].name);
	$('#layer-edit-table').val(data[0].layertableref);
	$('#layer-edit-table').val(data[0].layertableref);
	$('#layer-edit-url').val(data[0].url);
	
	var layerType = data[0].layertype;
	var layerTypeText = layerType.charAt(0).toUpperCase() + layerType.slice(1) + ' <span class="caret"></span>';
	$('button#layer-edit-type-dropdown').html(layerTypeText);
	$('#layerEditType').val(layerType);
	
	$('#layer-edit-attr').val(data[0].layerattributesonclick);
	$('#layer-edit-minzoom').val(data[0].minzoom);
	$('#layer-edit-maxzoom').val(data[0].maxzoom);
}

function getLayerStylesEditPanel(styleId){
	$.ajax('/maplayers/retrieveLayerStyles',{
      success: function(data) {
      	addToEditLayerStyleDropdown(data, styleId);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function addToEditLayerStyleDropdown(data, styleId){
	$('#layer-edit-styles').append('<label class="control-label col-sm-3" for="layer-edit-style">Style:</label>');
	$('#layer-edit-styles').append('<div class="dropdown col-sm-8"><button class="btn btn-default dropdown-toggle" type="button" id="layer-edit-style-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Style <span class="caret"></span></button><ul id="layerEditStyleDropdown" class="dropdown-menu" aria-labelledby="layer-edit-style-dropdown"></ul></div><input type="hidden" id="layerEditStyle" name="layerEditStyle" value="" />');
	
	var listOfStyles = "";
	for(var i = 0; i < data.length; i++){
		listOfStyles += '<li><a href="#" onclick="updateEditStyledropdown(' + data[i].id + ', \'' + data[i].description + '\'); return false;">' + data[i].description + '</a></li>';
		if(data[i].id === styleId){
			updateEditStyledropdown(data[i].id, data[i].description);
		}
	}
	
	$('ul#layerEditStyleDropdown').append(listOfStyles);
}

function getFormsEditPanel(layerFormId){
	$.ajax('/maplayers/retrieveForms',{
      success: function(data) {
      	addToEditLayerFormDropdown(data, layerFormId);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function addToEditLayerFormDropdown(data, layerFormId){
	$('#layer-edit-assigned-form').append('<label class="control-label col-sm-3" for="layer-edit-Form">Assigned Form:</label>');
	$('#layer-edit-assigned-form').append('<div class="dropdown col-sm-8"><button class="btn btn-default dropdown-toggle" type="button" id="layer-edit-form" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Assign Form <span class="caret"></span></button><ul id="layerEditFormDropdown" class="dropdown-menu" aria-labelledby="layer-edit-form-dropdown"></ul></div><input type="hidden" id="layerEditForm" name="layerEditForm" value="" />');
	
	var listOfForms = "";
	for(var i = 0; i < data.length; i++){
		listOfForms += '<li><a href="#" onclick="updateEditFormdropdown(' + data[i].formid + ', \'' + data[i].formname + '\'); return false;">' + data[i].formname + '</a></li>';
		if(data[i].formid === layerFormId){
			updateEditFormdropdown(data[i].formid, data[i].formname);
		}
	}
	
	$('ul#layerEditFormDropdown').append(listOfForms);
}

function updateEditFormdropdown(id, name){
	var newValue = name + ' <span class="caret"></span>';
	$('button#layer-edit-form').html(newValue);
	$('#layerEditForm').val(id);
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

function closeLayerEditPanel(){
	$('#layer-create-edit').slideUp();
	$('#layer-create-edit input').val("");
	$('#layer-create-edit textarea').val("");
	$('#layer-edit-styles').empty();
	$('#layer-edit-assigned-form').empty();
	$("button#layerAdd").attr("disabled", false);
	var newTypeValue = 'Type <span class="caret"></span>';
	$('button#layer-edit-type-dropdown').html(newTypeValue);
}

function updateCreateTypedropdown(type){
	var newValue = type + ' <span class="caret"></span>';
	$('button#layer-create-type-dropdown').html(newValue);
	var lowercasevalue = type.toLowerCase();
	$('#layerCreateType').val(lowercasevalue);
}

function updateLayerEditTypedropdown(type){
	var newValue = type + ' <span class="caret"></span>';
	$('button#layer-edit-type-dropdown').html(newValue);
	var lowercasevalue = type.toLowerCase();
	$('#layerEditType').val(lowercasevalue);
}

function getLayerStyles(){
	$.ajax('/maplayers/retrieveLayerStyles',{
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

function updateEditStyledropdown(id, desc){
	var newValue = desc + ' <span class="caret"></span>';
	$('button#layer-edit-style-dropdown').html(newValue);
	$('#layerEditStyle').val(id);
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
