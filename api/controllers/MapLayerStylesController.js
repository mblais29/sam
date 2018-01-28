/**
 * MapLayerStylesController
 *
 * @description :: Server-side logic for managing Maplayerstyles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function(req,res){
		//if session is authenticated go to map else redirect to login page
		if(req.session.authenticated){
			if(req.session.User.admin){
				/* Add populateAll to get all the foreign keys for the client model */
				MapLayerStyles.find().exec(function foundClientss(err,data){
					if(err) return next(err);
					res.view({
						styles: data,
						title: 'MapLayerStyles'
					});
				});
			}else{
				res.redirect('/map');
				return;
			}
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	create: function(req,res,next){
		var obj = {
				description: req.param('description'),
				type: req.param('layerType'),
				style: '{' + req.param('layerStyle') + '}',
				prefix: req.param('markerPrefix'),
				markerColour: req.param('markerColour'),
				markerIcon: req.param('marker-icon'),
				markerIconColor: req.param('marker-icon-colour')
		};
		
		
		MapLayerStyles.create(obj, function stylecreate(err,client){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/maplayerstyles');
			};

			AlertService.success(req, 'Successfully created a new layer style!');
			res.redirect('/maplayerstyles');
		});
	},
	
	update: function(req, res, next){

		var obj = {
			description: req.param('edit-description'),
			type: req.param('layerTypeEdit'),
			style: '{' + req.param('layerStyleEdit') + '}'
		};
		
		if(req.param('markerEditPrefix') != "" || req.param('markerEditPrefix') != undefined){
			obj.prefix = req.param('markerEditPrefix');
		}
		
		if(req.param('markerEditColour') != "" || req.param('markerEditColour') != undefined){
			obj.markerColour = req.param('markerEditColour');
		}
		
		if(req.param('marker-edit-icon') != "" || req.param('marker-edit-icon') != undefined){
			obj.markerIcon = req.param('marker-edit-icon');
		}
		
		if(req.param('marker-edit-icon-colour') != "" || req.param('marker-edit-icon') != undefined){
			obj.markerIconColor = req.param('marker-edit-icon-colour');
		}

		MapLayerStyles.update(req.param('layerStyleId'), obj, function mapLayerStyleUpdated(err){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/maplayerstyles');
				return;
			}
			AlertService.success(req, 'Updated layer style successfully!');
			return res.redirect('/maplayerstyles');
		}); 
	},
	
	destroy: function(req, res, next){
		MapLayerStyles.findOne(req.param('styleId'), function foundStyle(err,style){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/maplayerstyles');
			}
			if(!style) {
				AlertService.warning(req, 'Layer Style doesn\'t exist...');
				res.redirect('/maplayerstyles');
			}
			MapLayerStyles.destroy(req.param('styleId'), function layerStyleDestroyed(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/maplayerstyles');
				}
				
			});

			AlertService.success(req, 'You have deleted the ' + style.description + '  style!');
			res.redirect('/maplayerstyles');
		});
	},
	
	'retrieveStyleRecord': function(req, res, next){
		MapLayerStyles.find().where({id: req.param('styleId')}).populateAll().exec(function (err, response) {
			if(err) return next(err);
			//Must return res.ok() to send the data to the ajax call
			return res.ok(response);
		});
	}
};

