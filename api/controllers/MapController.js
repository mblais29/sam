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
	
	'saveProperty': function(req,res,next){
		var pg = require('pg');
		var pgconnection = new pg.Client({
			user: sails.config.connections.postgresServer.user,
		  	host: sails.config.connections.postgresServer.host,
		  	database: sails.config.connections.postgresServer.database,
		  	password: sails.config.connections.postgresServer.password,
		  	port: sails.config.connections.postgresServer.port,
		});

		var geometry = req.param('geom');
		var parseJSON = JSON.parse(geometry);
		var queryString = 'INSERT INTO public.property_objects (property_id, geom) VALUES (' + req.param('id') + ', ST_GeomFromGeoJSON(\'' + parseJSON + '\'))';

		pgconnection.connect(function(err, client, done){
			client.query(queryString, function(err, result){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					return res.ok(false);
				};
				client.end();
				AlertService.success(req, 'Property created successfully...');
				return res.ok(true);

			});
		});
	},
	
	'getPropertyRecords': function(req,res,next){
		Properties.find().where({id: req.param('property_id')}).populateAll().exec(function foundClients(err,data){
			if(err) return next(err);
			return res.ok(data);
		});
	},
};

