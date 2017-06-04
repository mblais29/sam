/**
 * ExpensesController
 *
 * @description :: Server-side logic for managing expenses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		if(req.session.authenticated){
			/* Add populateAll to get all the foreign keys for the form model */
			Expenses.find().populateAll().exec(function foundForms(err,data){
				if(err) return next(err);
	
				res.view({
					expenses: data,
					title: 'Expenses'
				});
			});
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	      		//NEED TO WORK ON THE FILE UPLOAD FOR EXPENSES
};

