if($('body').is('#formfieldIndex')){
	$( "#formfield-edit" ).draggable();
	$('#formfieldclosebutton').on('click', function(){
		$('#formfield-edit').slideUp();
	});
	$("#formfield-dropdown").on('click', 'li a', function(){
      $("#btn-formfield-type").text($(this).text());
      $("#btn-formfield-type").val($(this).text());
      $("#formfield-type-hidden").val($(this).text());
   });
};

/* FUNCTIONS */

function getformfieldsrecords(formfieldid){
	$.ajax('/formfields/edit?formfieldid=' + formfieldid,{
      success: function(data) {
      	//console.log(data);
      	$('#formfieldid').val(data.formfieldid);
      	$('#formID').val(data.formid);
      	$('#formfieldName').val(data.formfieldname);
      	$('#fieldName').val(data.fieldname);
      	$('#previous-field-name').val(data.formfieldname);
      	$('#btn-formfield-type').text(data.formfieldtype);
      	$('#formfield-type-hidden').val(data.formfieldtype);
      	$('#formfield-edit').show();
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}


