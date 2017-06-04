/**
 * ExpensecategoryController
 *
 * @description :: Server-side logic for managing expensecategories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req,res,next){
		var obj = {
			category: req.param('category'),
			description: req.param('description')
		};
		
		Expensecategory.create(obj, function expensecategorycreate(err,category){
			if(err){
				//AlertService.error(req, JSON.stringify(err));
				//res.redirect('/security');
				res.json(err);
			};

			//AlertService.success(req, 'You have created the ' + req.param('category') + ' Expense Type!');

			//res.redirect('/security');
			res.json(category);
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
	}
};

