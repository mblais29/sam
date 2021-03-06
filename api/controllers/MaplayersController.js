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
					//res.json(data[1]["layerstyle"][0]["description"]);
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
		var layerStyle = "";
		if(req.param('layerCreateStyle') !== -1){
			layerStyle = req.param('layerCreateStyle');
		}else{
			layerStyle = '';
		}
		
		var obj = {
				name: req.param('layer-create-name'),
				layerid: req.param('layer-create-id'),
				layertableref: req.param('layer-create-table'),
				url: req.param('layer-create-url'),
				layertype: req.param('layerCreateType'),
				layerstyle: layerStyle,
				layerattributesonclick: req.param('layer-create-attr'),
				layerassignedform: req.param('layerCreateForm'),
				minzoom: req.param('layer-create-minzoom'),
				maxzoom: req.param('layer-create-maxzoom')
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
	
	update: function(req, res, next){
		var record = req.allParams();
		 
		 var obj = {};
		 obj['name'] = record['layer-edit-name'];
		 obj['layertableref'] = record['layer-edit-table'];
		 obj['url'] = record['layer-edit-url'];
		 obj['layertype'] = record['layerEditType'];
		 if(record['layerEditStyle'] != -1){
		 	obj['layerstyle'] = record['layerEditStyle'];
		 }else{
		 	obj['layerstyle'] = [];
		 }
		 
		 obj['layerattributesonclick'] = record['layer-edit-attr'];
		 obj['layerassignedform'] = record['layerEditForm'];
		 obj['minzoom'] = record['layer-edit-minzoom'];
		 obj['maxzoom'] = record['layer-edit-maxzoom'];

		 Maplayers.update(req.param('layer-edit-id'), obj, function mapLayerUpdated(err, maplayer){
			if(err){
				console.log(obj);
				console.log(err);
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/maplayers');
				return;
			};
	      	AlertService.success(req, req.param('layer-edit-name') + ' Map Layer updated successfully!');
			return res.redirect('/maplayers');
		  });
	},
	
	destroy: function(req, res, next){
		Maplayers.findOne(req.param('layerId'), function foundMaplayer(err,layer){
			if(err){
				console.log(err);
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/maplayers');
			}

			Maplayers.destroy(req.param('layerId'), function maplayerDestroyed(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/maplayers');
				}
			});

			AlertService.success(req, 'You have deleted the ' + layer.name + ' layer successfully!');
			res.redirect('/maplayers');
		});
	},
	
	'retrieveLayerStyles': function(req, res, next){
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
	},
	
	'retrieveSelectedLayer': function(req, res, next){
		Maplayers.find().where({layerid: req.param('id')}).populateAll().exec(function (err, response) {
			if(err) return next(err);
			
			return res.ok(response);
		});
	},
	
	'getMapLayers': function(req, res, next){
		Maplayers.find().populateAll().exec(function (err, response) {
			if(err) return next(err);
			
			return res.ok(response);
		});
	},
	
	'saveEditedLayerRecord': function(req, res, next){
		var pg = require('pg');
		var pgconnection = new pg.Client({
			user: sails.config.connections.postgresServer.user,
		  	host: sails.config.connections.postgresServer.host,
		  	database: sails.config.connections.postgresServer.database,
		  	password: sails.config.connections.postgresServer.password,
		  	port: sails.config.connections.postgresServer.port,
		});
		
		var geometry = req.param('geom');
		var recordId = req.param('id');
		var layerTable = req.param('table');

		var queryString = 'UPDATE public.' + layerTable + ' SET geom = ST_Force2D(ST_GeomFromGeoJSON(\'' + geometry + '\')) WHERE gid = ' + recordId + ';' ;
		
		//console.log(queryString);
		pgconnection.connect(function(err, client, done){
			client.query(queryString, function(err, result){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					console.log(err);
					return res.ok(false);
				};
				client.end();
				//AlertService.success(req, 'Layer record saved successfully...');
				return res.ok(true);

			});
		});
		
	}
};

