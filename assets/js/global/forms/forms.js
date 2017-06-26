if($('body').is('#formIndex')){
	$(".panel").draggable();
	
	$('#formPreviewClose').on('click', function(){
		$('#form-preview').slideUp();
		//Removes all children elements within form
		$('#formPreview').empty();
	});
	
	$('#formEditClose').on('click', function(){
		$('#form-edit').slideUp();
		$('#formname').val("");
	});
	
	$('#formfieldClose').on('click', function(){
		$('#formfieldadd').slideUp();
		$("#btn-formfieldtype").text('Select Type');
		$('#formfieldname').val("");
	});
	
	$("#addNewFormField").on('click', 'li a', function(){
      $("#btn-formfieldtype").text($(this).text());
      $("#btn-formfieldtype").val($(this).text());
      $("#formfieldtypehidden").val($(this).text());
      
    });
    
    $("#addsecgroup").on('click', 'li a', function(){
    	$("#btn-secgroup").text($(this).text());
    	$("#btn-secgroup").val($(this).text());

		/* Removes the [] around the security.secid */
    	var str = $("#btn-secgroup").val();
    	var regex = /\[(.*?)\]/g;
    	var newStr = str.match(regex);
    	var secId = newStr[0].replace(/[\[\]']+/g, '');
		$("#secgrouphidden").val(secId);
    });
    
    /* Forms Edit Page changes hidden input value on click */
    $("#editsecgroup").on('click', 'li a', function(){
    	$("#btn-seceditgroup").text($(this).text());
    	$("#btn-seceditgroup").val($(this).text());

		/* Removes the [] around the security.secid */
    	var str = $("#btn-seceditgroup").val();
    	var regex = /\[(.*?)\]/g;
    	var newStr = str.match(regex);
    	var secId = newStr[0].replace(/[\[\]']+/g, '');
		$("#seceditgrouphidden").val(secId);
    });
    
};

if($('body').is('#myForm')){
	$('#myformClose').on('click', function(){
		$('#myform-selected').slideUp();
		//Removes all children elements within form
		$('#formSelected').empty();
		$('#myform-title').empty();
	});
	
	$('#myformViewRecordClose').on('click', function(){
		$('#myform-viewrecords').slideUp();
		//Removes all children elements within form
		$('#myform-panel-records').empty();
	});
};

/* FUNCTIONS */

function closeFormAddPanel(){
	$('#form-add').slideUp();
	$('input[type=text]').rules('remove'); 
	$('#formCreate input').val("");
	$("#btn-secgroup").text('Select Type');
	$("#btn-secgroup").val('Select Type');
	$("#secgrouphidden").val('');
}

function forceLower(strInput){
	strInput.value = strInput.value.toLowerCase();
};

function submitMyForm(){
	$('#formSelected').submit();
};

function getFormfieldValue(formid){
	$('#form').val(formid);
	$('#formfieldadd').show();
};

function getFormValue(formid){
	$('#form-edit').show();
	$.ajax('/forms/edit?formid=' + formid,{
      success: function(data) {
      	$('#form-id').val(data.formid);
      	$('#formname').val(data.formname);
      	getFormSec(data.formid);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
};

function getFormSec(id, sec){
	$.get('/forms/getSecGroup?formid=' + id )
		.done(function(data){
			var formSecGroup = data[0].securitygroup[0].secid;
			$.get('/security/getSecgroupEnum')
				.done(function(data) {
					if ( $('#seceditGroupDropdown').children().length === 0 ) {
						for (i = 0; i < data.length; i++) { 
					    	$('#seceditGroupDropdown').append('<li><a href="#">' + '[' + data[i].secid + '] ' + data[i].secname + '</a></li>');
						}
					};
					for (i = 0; i < data.length; i++) { 
						if(formSecGroup === data[i].secid){
							$("#btn-seceditgroup").text('[' + data[i].secid + '] ' + data[i].secname);
							$("#btn-seceditgroup").val('[' + data[i].secid + '] ' + data[i].secname);
							$("#seceditgrouphidden").val(data[i].secid);
						};
					};
					$('#formfield-edit').show();
				}).error(function(err){
					alert(err);
				});
		});
}

function insertPreviewFormData(formid){
	$('#form-preview').show();
	$.ajax('/forms/populate?formid=' + formid,{
      success: function(data) {
      	//console.log(data);
      	generatePreviewForm(data);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function insertSelectedFormData(formid){
	$('#myform-selected').show();
	$.ajax('/forms/populate?formid=' + formid,{
      success: function(data) {
      	$('#myform-title').append('<span>' + data[0].formname + '</span>');
      	generateForm(data);
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function arrayCheck(array, val){
	for(var i=0;i < array.length; i++) {
    	if (array[i].title === val) {
    		return true;
    	}
    }
    return false;
}

function getForeignKeyRecords(table, origName, field, keyId, buttonKey, hiddenInput, dropdown, form){

	$.ajax({
		url:'/' + table + '/getRecords',
		dataType : 'json',
      	success : function(result) {

      		$('#' + form).append('<label for="' + dropdown + '">' + origName + ':</label><div class="dropdown" id="' + dropdown + '"><button id="' +  buttonKey + '" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">Select<span class="caret"></span></button>');
			$('#' + dropdown).append('<input type="hidden" id="' + hiddenInput + '" name="' + hiddenInput + '" value="" /><ul class="dropdown-menu" id="' + keyId + '" ><li><a href="#">None</a></li></ul></div>');

      		for(var i in result){
     			var primaryKey = result[i]["primary_key"];
     			var primaryKeyRecord = result[i][primaryKey];

      			$('#' + keyId).append('<li><a href="#">' + '[' + primaryKeyRecord + '] ' + result[i][field] + '</a></li>');
      			
      		}
      		$('#' + keyId).on('click', 'li a', function(){
			    	$("#" + buttonKey).text($(this).text());
		    		$("#" + buttonKey).val($(this).text());
		    		
		    		/* Removes the [] around the security.secid */
			    	var str = $("#" + buttonKey).text();
			    	var regex = /\[(.*?)\]/g;
			    	var newStr = str.match(regex);
			    	var id = newStr[0].replace(/[\[\]']+/g, '');
					$("#" + hiddenInput).val(id);
					console.log("#" + hiddenInput);
					console.log($("#" + hiddenInput).val());

			    });
      		
      	}
  	});
}

function generatePreviewForm(data){
	$('#formSelected').append('<div class="form-group" id="collection"></div>');
	for (var i = 0; i < data.length; i++){
		var obj = data[i];
	    for (var key in obj){
	    	if(key === 'formfields'){
	    		for (var i = 0; i < obj[key].length; i++){
	    			var formfieldObject = obj[key][i];
	    			/* If name has a space replace with '_' */
	    			var inputName = formfieldObject.fieldname.replace(/\s/g, '_');

	    			$('#formSelected').append('<div class="form-group" id="' + 'formfieldid' + formfieldObject.formfieldid + '"></div>');
	    			var inputType = "";
	    			switch (formfieldObject.formfieldtype) {
					    case 'character varying':
					    		inputType = "text";
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'text':
					        inputType = "text";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<textarea class="form-control" rows="5" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '"></textarea>');
					        break;
					    case 'integer':
					        inputType = "number";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'numeric':
					        inputType = "number";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'date':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<div class="input-group date form_date col-md-5" data-date="" data-date-format="dd MM yyyy" data-link-field="' + inputName + formfieldObject.formfieldid + '" data-link-format="yyyy-mm-dd" style="width:100%"><input class="form-control" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<input type="hidden" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '" value="" />');
					        $('.form_date').datetimepicker({
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
					        break;
					    case 'datetime':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<div class="input-group date form_datetime col-md-5" data-date="" data-link-field="' + inputName + formfieldObject.formfieldid + '" style="width:100%"><input class="form-control" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<input type="hidden" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '" value="" />');
					        $('.form_datetime').datetimepicker({
					        	format: "yyyy-mm-dd hh:ii:00",
						        weekStart: 1,
						        todayBtn:  1,
								autoclose: 1,
								todayHighlight: 1,
								startView: 2,
								forceParse: 0,
						        showMeridian: 1,
								pickerPosition: "bottom-left"
						    });
					        break;
					    case 'binary':
					    	/* If input string is file show the file upload else just create a text input */
					    		inputType = "file";
					    		var lowercase = formfieldObject.fieldname.toString().toLowerCase();
					    	
								$('<input name="binary" type="hidden" value="' + lowercase + '" />').appendTo('#formfieldid' + formfieldObject.formfieldid);
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + formfieldObject.formfieldid + '" multiple />');
								
								
								$('#' + inputName + formfieldObject.formfieldid).filestyle({
									size: 'sm',
									buttonName : 'btn-info',
									buttonText : 'Upload'
								});
					        break;
					    case 'boolean':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="formfield_boolean">' + formfieldObject.formfieldname + ':</label><div class="dropdown" id="formfield_boolean"><button id="boolean" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Yes or No  <span class="caret"></span></button>');
					        $('#formfield_boolean').append('<input type="hidden" id="formfield_boolean_val" name="formfield_boolean_val" ><ul class="dropdown-menu"><li><a href="#">Yes</a></li><li><a href="#">No</a></li></ul></div>');
					        $("#formfield_boolean").on('click', 'li a', function(){
						    $("#boolean").text($(this).text());
						    if($(this).text() === 'Yes'){
						    	$("#formfield_boolean_val").val('true');
						    	$("#boolean").removeClass('btn-primary');
						    	$("#boolean").removeClass('btn-danger');
						    	$("#boolean").addClass('btn-success');
						    }else{
						    	$("#formfield_boolean_val").val('false');
						    	$("#boolean").removeClass('btn-primary');
						    	$("#boolean").removeClass('btn-success');
						    	$("#boolean").addClass('btn-danger');
						    }
						    });
					        break;
					     
					     case 'foreign key':
							
							var form = 'formfieldid' + formfieldObject.formfieldid;
							var origName = formfieldObject.formfieldname;
					     	var table = formfieldObject.formfieldname.replace(/\s/g, '').toLowerCase().replace(/\w+/g, function(txt) {
							  return txt.charAt(0).toUpperCase() + txt.substr(1);
							});

					     	var field = formfieldObject.fieldname;
					     	var keyId = "key-" + formfieldObject.formfieldid;
					     	var buttonKey = 'foreign_key-' +  formfieldObject.formfieldid;
					     	var hiddenInput = formfieldObject.fieldname;

					     	var dropdown = formfieldObject.fieldname + "-" + formfieldObject.formfieldid;
					     	
					     	getForeignKeyRecords(table, origName, field, keyId, buttonKey, hiddenInput, dropdown, form);
					     	break;
					};
				}
	    	}
	    	
	    }
	}
}

function generateForm(data){
	$('#formSelected').append('<div class="form-group" id="collection"></div>');
	$('#collection').append('<input type="hidden" name="collection" value="' + data[0].tablename + '" />');
	for (var i = 0; i < data.length; i++){
		var obj = data[i];
	    for (var key in obj){
	    	if(key === 'formfields'){
	    		for (var i = 0; i < obj[key].length; i++){
	    			var formfieldObject = obj[key][i];
	    			/* If name has a space replace with '_' */
	    			var inputName = formfieldObject.fieldname.replace(/\s/g, '_');

	    			$('#formSelected').append('<div class="form-group" id="' + 'formfieldid' + formfieldObject.formfieldid + '"></div>');
	    			var inputType = "";
	    			switch (formfieldObject.formfieldtype) {
					    case 'character varying':
					    		inputType = "text";
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'text':
					        inputType = "text";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<textarea class="form-control" rows="5" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '"></textarea>');
					        break;
					    case 'integer':
					        inputType = "number";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'numeric':
					        inputType = "number";
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    			$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + formfieldObject.formfieldname + formfieldObject.formfieldid + '" name="' + inputName + '">');
					        break;
					    case 'date':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<div class="input-group date form_date col-md-5" data-date="" data-date-format="dd MM yyyy" data-link-field="' + inputName + formfieldObject.formfieldid + '" data-link-format="yyyy-mm-dd" style="width:100%"><input class="form-control" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<input type="hidden" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '" value="" />');
					        $('.form_date').datetimepicker({
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
					        break;
					    case 'datetime':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<div class="input-group date form_datetime col-md-5" data-date="" data-link-field="' + inputName + formfieldObject.formfieldid + '" style="width:100%"><input class="form-control" size="16" type="text" value="" readonly><span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');
					        $('#formfieldid' + formfieldObject.formfieldid).append('<input type="hidden" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + '" value="" />');
					        $('.form_datetime').datetimepicker({
					        	format: "yyyy-mm-dd hh:ii:00",
						        weekStart: 1,
						        todayBtn:  1,
								autoclose: 1,
								todayHighlight: 1,
								startView: 2,
								forceParse: 0,
						        showMeridian: 1,
								pickerPosition: "bottom-left"
						    });
					        break;
					    case 'binary':
					    	/* If input string is file show the file upload else just create a text input */
					    		inputType = "file";
					    		var lowercase = formfieldObject.fieldname.toString().toLowerCase();
					    	
								$('<input name="binary" type="hidden" value="' + lowercase + '" />').appendTo('#formfieldid' + formfieldObject.formfieldid);
					    		$('#formfieldid' + formfieldObject.formfieldid).append('<label for="' + inputName + formfieldObject.formfieldid + '">' + formfieldObject.formfieldname + ':</label>');
			    				$('#formfieldid' + formfieldObject.formfieldid).append('<input type="' + inputType + '" class="form-control" id="' + inputName + formfieldObject.formfieldid + '" name="' + inputName + formfieldObject.formfieldid + '" multiple />');
								
								
								$('#' + inputName + formfieldObject.formfieldid).filestyle({
									size: 'sm',
									buttonName : 'btn-info',
									buttonText : 'Upload'
								});
					        break;
					    case 'boolean':
					        $('#formfieldid' + formfieldObject.formfieldid).append('<label for="formfield_boolean">' + formfieldObject.formfieldname + ':</label><div class="dropdown" id="formfield_boolean"><button id="boolean" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Yes or No  <span class="caret"></span></button>');
					        $('#formfield_boolean').append('<input type="hidden" id="formfield_boolean_val" name="formfield_boolean_val" ><ul class="dropdown-menu"><li><a href="#">Yes</a></li><li><a href="#">No</a></li></ul></div>');
					        $("#formfield_boolean").on('click', 'li a', function(){
						    $("#boolean").text($(this).text());
						    if($(this).text() === 'Yes'){
						    	$("#formfield_boolean_val").val('true');
						    	$("#boolean").removeClass('btn-primary');
						    	$("#boolean").removeClass('btn-danger');
						    	$("#boolean").addClass('btn-success');
						    }else{
						    	$("#formfield_boolean_val").val('false');
						    	$("#boolean").removeClass('btn-primary');
						    	$("#boolean").removeClass('btn-success');
						    	$("#boolean").addClass('btn-danger');
						    }
						    });
					        break;
					     
					     case 'foreign key':
							
							var form = 'formfieldid' + formfieldObject.formfieldid;
							var origName = formfieldObject.formfieldname;
					     	var table = formfieldObject.formfieldname.replace(/\s/g, '').toLowerCase().replace(/\w+/g, function(txt) {
							  return txt.charAt(0).toUpperCase() + txt.substr(1);
							});

					     	var field = formfieldObject.fieldname;
					     	var keyId = "key-" + formfieldObject.formfieldid;
					     	var buttonKey = 'foreign_key-' +  formfieldObject.formfieldid;
					     	var hiddenInput = formfieldObject.fieldname;

					     	var dropdown = formfieldObject.fieldname + "-" + formfieldObject.formfieldid;
					     	
					     	getForeignKeyRecords(table, origName, field, keyId, buttonKey, hiddenInput, dropdown, form);
					     	break;
					};
				}
	    	}
	    	
	    }
	}
}
