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
};

