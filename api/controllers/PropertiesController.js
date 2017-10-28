/**
 * PropertiesController
 *
 * @description :: Server-side logic for managing properties
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		if(req.session.authenticated){
			if(req.session.User.admin){
				/* Add populateAll to get all the foreign keys for the client model */
				Properties.find().populateAll().exec(function foundClients(err,data){
					if(err) return next(err);
					res.view({
						properties: data,
						title: 'Properties'
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
			client: req.param('propertyCliHidden'),
			address: req.param('property-address'),
			description: req.param('property-desc'),
			
		};
		
		Properties.create(obj, function propertycreate(err,property){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/properties');
			};

			AlertService.success(req, 'Property created successfully!');
			res.redirect('/properties');
		});
	},
	
	destroy: function(req, res, next){
		Properties.find().where({id: req.param('propertyid')}).populateAll().exec(function foundProperty(err,property){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/properties');
			}
			if(!property) {
				AlertService.warning(req, 'Property doesn\'t exist...');
				res.redirect('/properties');
			}

			Properties.destroy(req.param('propertyid'), function propertyDestroyed(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/properties');
				}
				
			});

			AlertService.success(req, 'You have deleted the ' + property[0].client[0].client + ' property record, with ' + property[0].client[0].contact + ' as a contact!');
			res.redirect('/properties');
		});
	},
	
	'getRecords': function(req,res,next){
		Properties.find().populateAll().exec(function foundClients(err,data){
			if(err) return next(err);
			return res.ok(data);
		});
	},
	
	'getPropertyLocations': function(req,res,next){

		var pg = require('pg');
		var pgconnection = new pg.Client({
			user: sails.config.connections.postgresServer.user,
		  	host: sails.config.connections.postgresServer.host,
		  	database: sails.config.connections.postgresServer.database,
		  	password: sails.config.connections.postgresServer.password,
		  	port: sails.config.connections.postgresServer.port,
		});
		
		var queryString = 'SELECT property_id, ST_AsGeoJSON(geom) as geojson FROM public.property_objects';
		
		pgconnection.connect(function(err, property, done){
			property.query(queryString, function(err, result){
				if(err){
					console.log(err);
				};
				property.end();
				return res.ok(result);
			});
		});
	},
	
	
};

