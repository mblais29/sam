/**
 * ClientsController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		if(req.session.authenticated){
			if(req.session.User.admin){
				/* Add populateAll to get all the foreign keys for the client model */
				Client.find().populateAll().exec(function foundClients(err,data){
					if(err) return next(err);
					res.view({
						clients: data,
						title: 'Clients'
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
		var phone = req.param('phone');
		var phoneNumber = phone[0] + "-" + phone[1] + "-" + phone[2];

		var obj = {
			client: req.param('clientName'),
			address: req.param('clientAddress'),
			phone: phoneNumber,
			contact: req.param('clientContact'),
			email: req.param('clientEmail')
		};
		
		Client.create(obj, function clientscreate(err,client){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/client');
			};

			AlertService.success(req, 'Client ' + req.param('clientName') + ' created successfully!');
			res.redirect('/client');
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
		
		Client.update(req.param('client-id'), obj, function cientUpdated(err){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/client');
				return;
			}
			AlertService.success(req, 'Client ' + req.param('client-name') + ' updated successfully!');
			return res.redirect('/client');
		}); 
	},
	
	destroy: function(req, res, next){
		Client.findOne(req.param('clientid'), function foundClient(err,client){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/client');
			}
			if(!client) {
				AlertService.warning(req, 'Client doesn\'t exist...');
				res.redirect('/client');
			}
			Client.destroy(req.param('clientid'), function clientDestroyed(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/client');
				}
				
			});

			AlertService.success(req, 'You have deleted ' + client.client + '!');
			res.redirect('/client');
		});
	},
	
	'retrieveClientRecord': function(req, res, next){
		Client.findOne({id: req.param('clientId')}).exec(function (err, response) {
			if(err) return next(err);
			
			return res.ok(response);
		});
	},
	
	'retrieveRecords': function(req, res, next){
		Client.find().exec(function (err, response) {
			if(err) return next(err);
			return res.ok(response);
		});
	},
	
	'getRecords': function(req, res, next){
		Client.find().exec(function (err, response) {
			if(err) return next(err);
			//Must return res.ok() to send the data to the ajax call
			for(var i = 0; i < response.length; i++){
				response[i]["primary_key"] = Client.primaryKey;
			}
			return res.ok(response);
		});
	}
};

