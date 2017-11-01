/**
 * ExpensesController
 *
 * @description :: Server-side logic for managing expenses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		var moment = require('moment');

		if(req.session.authenticated){
			if(req.session.User.admin){
				/* Add populateAll to get all the foreign keys for the form model */
				Expenses.find().populateAll().exec(function foundForms(err,data){
					if(err) return next(err);
					res.view({
						expenses: data,
						moment: moment,
						title: 'Expenses'
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
	
	update: function(req, res, next){
		var record = req.allParams();
		
		/* Deletes the _csrf and collection records from the array */
		 delete record._csrf;
		 delete record['expense-id'];
		 
		 var obj = {};
		 obj['employee'] = record['expense-employee'];
		 obj['name'] = record['expense-name'];
		 obj['category'] = record['expenseCatHidden'];
		 obj['client'] = record['expenseCliHidden'];
		 obj['comment'] = record['expense-comment'];
		 obj['date'] = record['expenseDate'];
		 obj['amount'] = record['expense-amount'];
		 obj['currency'] = record['expenseCurrHidden'];

		 Expenses.update(req.param('expense-id'), obj, function expenseUpdated(err, expense){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/expenses');
				return;
			};
	      	AlertService.success(req, req.param('expense-employee') + ' expense ' + req.param('expense-name') + ' updated successfully!');
			return res.redirect('/expenses');
		  });
	},
	
	destroy: function(req, res, next){
		var fs = require('fs');
		
		Expenses.findOne(req.param('id'), function foundExpense(err,expense){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/expenses');
			}
			if(!expense) {
				AlertService.warning(req, 'Expense doesn\'t exist...');
				res.redirect('/expenses');
			}
			
			var currentDocs = expense.documents;
			
			for(var key in currentDocs){
				var path = currentDocs[key].substring(0, currentDocs[key].lastIndexOf("\\") + 1);
				var deletedDirectory = currentDocs[key].substring(0, currentDocs[key].lastIndexOf("\\") + 1) + "deleted\\";
				var newPath = deletedDirectory + key;
				
				//Creates a deleted folder directory if it does not exist
				if (!fs.existsSync(deletedDirectory)){
				    fs.mkdirSync(deletedDirectory);
				}
				
				//Renames encrypted file name to original file name and moves to deleted directory
				fs.rename(currentDocs[key], newPath, function(err) {
					if(err){
				    	AlertService.error(req, JSON.stringify(err));
				    	res.redirect('/expenses');
				    }
				    
				});
				//Deletes record from documents object
				delete currentDocs[key];
			};
			
			Expenses.destroy(req.param('id'), function expenseDestroyed(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/expenses');
				}
				
			});

			AlertService.success(req, 'You have deleted ' + expense.name + ' expense record!');
			res.redirect('/expenses');
		});
	},
	
	'retrieveExpenseRecord': function(req, res, next){
		Expenses.find().where({id: req.param('expenseId')}).populateAll().exec(function (err, response) {
			if(err) return next(err);
			
			return res.ok(response);
		});
	},
	
	'insertReceipt': function(req, res, next){
		var expenseId = req.param('expenseId');
		var newObj = {};
		var newDocObj = {};
		var filesUploaded = {};
		
		if(typeof req._fileparser.upstreams[0] !== 'undefined'){
		 	var uploadFile = req._fileparser.upstreams[0];
			var checkFiles = uploadFile._files;

			var numberOfValidFiles = 0;
			var numberOfInValidFiles = 0;
			var invalidFilesTypes = [];
			
			var validFileType = sails.config.conf.allowedTypes;
			
			for(var a = 0; a < checkFiles.length; a++){
				if(validFileType.indexOf(checkFiles[a]["stream"].headers["content-type"]) != -1){
					numberOfValidFiles++;
				}else{
					var error = checkFiles[a]["stream"].filename + ": [ " + checkFiles[a]["stream"].headers["content-type"] + " ] - Invalid File Type";
					invalidFilesTypes.push(error);
					numberOfInValidFiles++;
				}
			};
			
			if(numberOfInValidFiles === 0){
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
			  }else{
			  	AlertService.error(req, JSON.stringify(invalidFilesTypes));
				res.redirect('/expenses');
			  }
			}
	},
	
	'removeReceipt': function(req, res, next){
		var fs = require('fs');
		var expenseId = req.param('id');
		var receiptName = req.param('receiptName');

		Expenses.findOne({id: expenseId}).exec(function (err, result){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/expenses');
			  };
			
			var currentDocs = result.documents;

			for(var key in currentDocs){
				if(key === receiptName){
					var path = currentDocs[key].substring(0, currentDocs[key].lastIndexOf("\\") + 1);
					var deletedDirectory = currentDocs[key].substring(0, currentDocs[key].lastIndexOf("\\") + 1) + "deleted\\";
					var newPath = deletedDirectory + key;
					
					//Creates a deleted folder directory if it does not exist
					if (!fs.existsSync(deletedDirectory)){
					    fs.mkdirSync(deletedDirectory);
					}
					
					//Renames encrypted file name to original file name and moves to deleted directory
					fs.rename(currentDocs[key], newPath, function(err) {
						if(err){
					    	AlertService.error(req, JSON.stringify(err));
					    	res.redirect('/expenses');
					    }
					    
					});
					//Deletes record from documents object
					delete currentDocs[key];
				}
			};
			var newDocObj = {};
			newDocObj['documents'] = currentDocs;
			//Updates the database with the current documents
			Expenses.update(expenseId, newDocObj, function docsUpdated(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/expenses');
					};
				AlertService.success(req, 'Document removed successfully!');
				res.redirect('/expenses');
			  });
		});
		
	}
};

