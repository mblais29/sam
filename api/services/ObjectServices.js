module.exports = {
	convertLowercase: function(obj) {
		    var output = {};
		    //console.log(obj);
		    for (i in obj) {
		    	
		        if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
		           output[i.toLowerCase()] = ConvertKeysToLowerCase(obj[i]);
		        }else if(Object.prototype.toString.apply(obj[i]) === '[object Array]'){
					output[i.toLowerCase()]=[];
		             output[i.toLowerCase()].push(ConvertKeysToLowerCase(obj[i][0]));
		        } else {
		            output[i.toLowerCase()] = obj[i];
		        }
		    }
		    return output;
		},
	removeSpace: function(obj){
		var output = {};
		for (var k in obj) {
		    if (k.replace(/\s/g, '') != k) {
		        obj[k.replace(/\s/g, '_')] = obj[k];
		        delete obj[k];
		    }
		}
		return obj;
	},
	removeUnderscore: function(obj){
		var output = {};
		for (var k in obj) {
			output[k.split("_").join(" ")] = obj[k];
		}
		return output;
	}

};