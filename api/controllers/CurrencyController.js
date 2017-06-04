/**
 * CurrenciesController
 *
 * @description :: Server-side logic for managing currencies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req,res,next){
		var obj = {
			currency: req.param('currency'),
			description: req.param('description')
		};
		
		Currency.create(obj, function clientscreate(err,currency){
			if(err){
				//AlertService.error(req, JSON.stringify(err));
				//res.redirect('/security');
				res.json(err);
			};

			//AlertService.success(req, 'You have created the ' + req.param('category') + ' Expense Type!');

			//res.redirect('/security');
			res.json(currency);
		});
	},
	'getRecords': function(req, res, next){
		Currency.find().exec(function (err, response) {
			if(err) return next(err);
			//Must return res.ok() to send the data to the ajax call
			for(var i = 0; i < response.length; i++){
				response[i]["primary_key"] = Currency.primaryKey;
			};
			return res.ok(response);
		});
	}
};

