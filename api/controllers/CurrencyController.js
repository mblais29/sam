/**
 * CurrenciesController
 *
 * @description :: Server-side logic for managing currencies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		if(req.session.authenticated){
			if(req.session.User.admin){
				/* Add populateAll to get all the foreign keys for the client model */
				Currency.find().populateAll().exec(function foundClientss(err,data){
					if(err) return next(err);
					res.view({
						currencies: data,
						title: 'Currencies'
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
			currency: req.param('currencyType'),
			description: req.param('currencyDesc'),
			symbol: req.param('currencySym')
		};
		
		Currency.create(obj, function currencycreate(err,currency){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/currency');
			};

			AlertService.success(req, 'You have successfully created the ' + req.param('currencyDesc') + ' Currency!');
			res.redirect('/currency');
		});
	},
	
	update: function(req, res, next){

		var obj = {
			description: req.param('currencyDescEdit'),
			symbol: req.param('currencySymEdit')
		};

		Currency.update(req.param('currencyTypeEdit'), obj, function currencyUpdated(err){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/currency');
				return;
			}
			AlertService.success(req, req.param('currencyDescEdit') + ' updated successfully!');
			return res.redirect('/currency');
		}); 
	},
	
	destroy: function(req, res, next){
		Currency.findOne(req.param('currency'), function foundCurrency(err,currency){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/currency');
			}
			if(!currency) {
				AlertService.warning(req, 'Currency doesn\'t exist...');
				res.redirect('/currency');
			}
			Currency.destroy(req.param('currency'), function currencyDestroyed(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/currency');
				}
			});

			AlertService.success(req, 'You have deleted the ' + currency.description + ' successfully!');
			res.redirect('/currency');
		});
	},
	
	'retrieveCurrencyRecord': function(req, res, next){
		Currency.findOne({currency: req.param('currency')}).exec(function (err, response) {
			if(err) return next(err);
			
			return res.ok(response);
		});
	},
	
	'retrieveRecords': function(req, res, next){
		Currency.find().exec(function (err, response) {
			if(err) return next(err);
			return res.ok(response);
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

