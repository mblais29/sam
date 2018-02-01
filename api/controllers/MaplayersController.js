/**
 * LayersController
 *
 * @description :: Server-side logic for managing layers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		if(req.session.authenticated){
			if(req.session.User.admin){
				Maplayers.find().populateAll().exec(function foundLayers(err,data){
					if(err) return next(err);
					res.view({
						layers: data,
						title: 'MapLayers'
					});
					//res.json(data);
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
				name: req.param('layer-create-name'),
				layertableref: req.param('layer-create-table'),
				layertype: req.param('layerCreateType'),
				layerstyle: req.param('layerCreateStyle'),
				layerattributesonclick: req.param('layer-create-attr'),
				layerassignedform: req.param('layerCreateForm')
		};
		
		
		Maplayers.create(obj, function layercreate(err,layers){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/maplayers');
			};

			AlertService.success(req, 'Successfully created a new layer!');
			res.redirect('/maplayers');
		});
	},
	
	'retrieveLayers': function(req, res, next){
		MapLayerStyles.find().exec(function (err, response) {
			if(err) return next(err);
			return res.ok(response);
		});
	},
	
	'retrieveForms': function(req, res, next){
		Forms.find().exec(function (err, response) {
			if(err) return next(err);
			return res.ok(response);
		});
	}
};

