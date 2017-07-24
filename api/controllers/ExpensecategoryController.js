/**
 * ExpensecategoryController
 *
 * @description :: Server-side logic for managing expensecategories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		if(req.session.authenticated && req.session.User.admin){
			/* Add populateAll to get all the foreign keys for the client model */
			Expensecategory.find().populateAll().exec(function foundExpenseCat(err,data){
				if(err) return next(err);
				res.view({
					expensecat: data,
					title: 'Expense Categories'
				});
			});
		}else if(req.session.User.admin === false){
			res.redirect('/map');
			return;
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	
	create: function(req,res,next){
		var obj = {
			category: req.param('expenseCategory'),
			description: req.param('expenseDesc')
		};
		
		Expensecategory.create(obj, function expensecategorycreate(err,category){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/expensecategory');
				res.json(err);
			};

			AlertService.success(req, 'You have created the ' + req.param('expenseCategory') + ' Expense Category successfully!');
			res.redirect('/expensecategory');
		});
	},
	
	update: function(req, res, next){
		var record = req.allParams();
		
		/* Deletes the _csrf and collection records from the array */
		 delete record._csrf;
		 delete record['expenseCat-id'];
		 
		 var obj = {};
		 obj['category'] = record['expenseCat-category'];
		 obj['description'] = record['expenseCat-desc'];

		 Expensecategory.update(req.param('expenseCat-id'), obj, function expenseCatUpdated(err, expense){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/expensecategory');
				return;
			};
	      	AlertService.success(req, req.param('expenseCat-desc') + ' expense type' + ' updated successfully!');
			return res.redirect('/expensecategory');
		  });
	},
	
	destroy: function(req, res, next){
		Expensecategory.findOne(req.param('expensecatid'), function foundExpenseCat(err,expenseCat){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/expensecategory');
			}
			if(!expenseCat) {
				AlertService.warning(req, 'Expense Category doesn\'t exist...');
				res.redirect('/expensecategory');
			}
			
			Expensecategory.destroy(req.param('expensecatid'), function expenseDestroyed(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/expensecategory');
				}
				
			});

			AlertService.success(req, 'You have deleted ' + expenseCat.description + ' expense category record!');
			res.redirect('/expensecategory');
		});
	},
	
	'retrieveRecords': function(req, res, next){
		Expensecategory.find().exec(function (err, response) {
			if(err) return next(err);
			return res.ok(response);
		});
	},
	
	'getRecords': function(req, res, next){
		Expensecategory.find().exec(function (err, response) {
			if(err) return next(err);
			//Must return res.ok() to send the data to the ajax call
			for(var i = 0; i < response.length; i++){
				response[i]["primary_key"] = Expensecategory.primaryKey;
			}
			return res.ok(response);
		});
	},
	
	'retrieveExpenseCatRecord': function(req, res, next){
		Expensecategory.findOne({id: req.param('expenseCatId')}).exec(function (err, response) {
			if(err) return next(err);
			
			return res.ok(response);
		});
	}
};

