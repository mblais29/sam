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
	
	'insertReceipt': function(req, res, next){
		var expenseId = req.param('expenseId');
		var newObj = {};
		var newDocObj = {};
		
		if(typeof req._fileparser.upstreams[0] !== 'undefined'){
		 	var uploadFile = req._fileparser.upstreams[0];

			var filesUploaded = {};
		 	uploadFile.upload({
			  dirname: sails.config.conf.docUrl
			}, function(err, uploadedFiles) {
			  if (err) { return res.serverError(err); }
			  for(var i = 0; i < uploadedFiles.length; i++){
			  	filesUploaded[uploadedFiles[i].filename] = uploadedFiles[i].fd;
			  }
			  
			  Expenses.findOne({id: expenseId}).exec(function (err, result){
				  
				  if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/expenses');
				  };
				  
				  var currentDocs = result.documents;
				  
				  for(var key in filesUploaded){
				  	newObj[key] = filesUploaded[key];
				  }
				  
				  for(var key in currentDocs){
				  	newObj[key] = currentDocs[key];
				  }
				  
				  newDocObj['documents'] = newObj;
				  
				  Expenses.update(expenseId, newDocObj, function docsUpdated(err){
					if(err){
						AlertService.error(req, JSON.stringify(err));
						res.redirect('/expenses');
						};
					
					AlertService.success(req, 'Document added successfully!');
					res.redirect('/expenses');
				  });
			  });

			});

		 }
	}
};

