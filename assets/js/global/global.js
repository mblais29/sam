//Delay displaying the user table to allow footable to load
function loadPage() {
  
  $('#loading').css('display', 'none');
  $('#loading').css('opacity', '0');
  
  if (document.getElementById("map")) {
	  $('#map').css('visibility', 'visible');
  };
  if (document.getElementsByClassName("show-users")) {
	  $('div.show-users').css('visibility', 'visible');
  };
  if (document.getElementsByClassName("edit-users")) {
	  $('div.edit-users').css('visibility', 'visible');
  };
 
  
  $('#'+ tableId).css('display', 'table');
  $('#' + tableId).css('opacity', '1');
  $('#table-title').css('display', 'block');
  $('#table-title').css('opacity', '1');
  $('#' + tableId).footable();

}
setTimeout(loadPage, 1000); // after 1 second

/* FUNCTIONS */

//Pulls parameters from url ex: $.urlParam('id') can use it anywhere
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
};
