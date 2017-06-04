/**
 * ClientsController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req,res,next){
		var obj = {
			name: req.param('client_name'),
			address: req.param('client_address'),
			phone: req.param('client_phone'),
			contact: req.param('contact'),
			email: req.param('email')
		};
		
		Client.create(obj, function clientscreate(err,client){
			if(err){
				//AlertService.error(req, JSON.stringify(err));
				//res.redirect('/security');
				res.json(err);
			};

			//AlertService.success(req, 'You have created the ' + req.param('category') + ' Expense Type!');

			//res.redirect('/security');
			res.json(client);
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

