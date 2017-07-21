/**
 * ClientsController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		if(req.session.authenticated){
			/* Add populateAll to get all the foreign keys for the client model */
			Client.find().populateAll().exec(function foundClientss(err,data){
				if(err) return next(err);
				res.view({
					clients: data,
					title: 'Clients'
				});
			});
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

