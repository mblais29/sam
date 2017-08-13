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
			client: req.param('property-client'),
			address: req.param('property-address'),
			description: req.param('property-desc'),
			
		};
		
		Properties.create(obj, function propertycreate(err,property){
			if(err){
				//AlertService.error(req, JSON.stringify(err));
				//res.redirect('/map');
			};

			//AlertService.success(req, 'Property created successfully!');
			//res.redirect('/map');
			res.json(property);
		});
	},
	
	'getRecords': function(req,res,next){
		Properties.find().populateAll().exec(function foundClients(err,data){
			if(err) return next(err);
			return res.ok(data);
		});
	}
};

