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
			markerIconColor: req.param('marker-icon-colour'),
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
		var phone = req.param('phone');
		var phoneNumber = phone[0] + "-" + phone[1] + "-" + phone[2];

		var obj = {
			client: req.param('client-name'),
			address: req.param('client-address'),
			phone: phoneNumber,
			contact: req.param('client-contact'),
			email: req.param('client-email')
		};
		
		Client.update(req.param('client-id'), obj, function clientUpdated(err){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/client');
				return;
			}
			AlertService.success(req, 'Client ' + req.param('client-name') + ' updated successfully!');
			return res.redirect('/client');
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

