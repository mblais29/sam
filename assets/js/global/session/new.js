if($('body').is('#logon-body')){

	$(function() {
	    loadPage();
	});

}

function loadPage(){
	
	setTimeout(function(){
		$("span.loader-outer").fadeOut();
		$("div#wrapper-login").fadeIn(2000); 
	}, 4000);
}