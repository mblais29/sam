if($('body').is('#logon-body')){

	$(function() {
	    loadPage();
	
		window.realEstate = function () {
		    $('#realEstate').fadeIn(function() {
		    	setTimeout(window.forestry, 8500);
		    });
		};
		
		window.forestry = function () {
	        $('#forestry').fadeIn(function() {
	            setTimeout(window.mining, 8500);
	        });
		};
		
		window.mining = function () {
	        $('#mining').fadeIn(function() {
	            setTimeout(window.oil, 8500);
	        });
		};
		
		window.oil = function () {
	        $('#oil').fadeIn();
		};
		
		window.realEstate();
	    
	    
	    
	});

}

function loadPage(){
	
	setTimeout(function(){
		$("span.loader-outer").fadeOut();
		$("div#wrapper-login").fadeIn(2000); 
	}, 4000);
}