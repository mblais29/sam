/**
 * MapController
 *
 * @description :: Server-side logic for managing maps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function(req,res){
		//if session is authenticated go to map else redirect to login page
		if(req.session.authenticated){
			res.view({
				title: 'Map'
			});
			return;
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	
	'getAllMapLayers': function(req,res,next){
		Maplayers.find().populateAll().exec(function foundLayers(err,data){
			if(err) return next(err);
			return res.json(data);
		});
	},

};

