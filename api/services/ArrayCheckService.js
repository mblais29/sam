module.exports = {
	checkArray: function(array, val) {
	    for(var i=0;i < array.length; i++) {
	    	if (array[i] === val) {
	    		return true;
	    	}
	    }
	    return false;
	},

};