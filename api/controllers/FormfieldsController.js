/**
 * FormfieldsController
 *
 * @description :: Server-side logic for managing formfields
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	index: function(req, res, next){
		if(req.session.authenticated){
			if(req.session.User.admin){
				Formfields.find(function foundForms(err,formfields){
					if(err) {
						AlertService.error(req, JSON.stringify(err));
					};
					res.view({
						formfields: formfields,
						title: 'Formfields'
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
		var formObj = {
			formid: req.param('form'),
			formfieldname: req.param('formfieldname'),
			fieldname: req.param('fieldName'),
			formfieldtype: req.param('formfieldtypehidden')
		};
		
		Formfields.create(formObj, function formfieldCreated(err,formfield){
			if(err){
				AlertService.error(req, JSON.stringify(err));
			};
			console.log('Created Formfield ' + req.param('formfieldname') + ' Successfully');
		});

		res.redirect('/forms');
	},
	
	edit: function(req,res,next){
		Formfields.findOne(req.param('formfieldid')).exec(function (err, formfield) {
			return res.ok(formfield);
		});
	},
	
	//Update the Form Field from edit page
	update: function(req, res, next){
		var formFieldObj = {};
			 formFieldObj = {
				formfieldid: req.param('formfieldid'),
				formfieldname: req.param('formfieldName'),
				fieldname: req.param('fieldName'),
				formfieldtype: req.param('formfield-type-hidden')
			};

		Formfields.update(req.param('formfieldid'), formFieldObj, function formfieldsUpdated(err){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				};
			res.redirect('/formfields');
			return;
		});
	},
	
	//Delete the Form Field
	destroy: function(req, res, next){
		Formfields.findOne(req.param('formfieldid'), function foundFormfield(err,formfield){
			if(err) return next(err);
			if(!formfield) return next('Form Field doesn\'t exist...');
			Formfields.destroy(req.param('formfieldid'), function formfieldDestroyed(err){
				if(err) return next(err);
			});
			res.redirect('/formfields');
		});
	},
	
	'insert': function(req, res, next){
		var record = req.allParams();

		var binaryField = "";
		var fileNames = {};

		var table = req.param("collection");
		
		var currentModel = "'" + table + "'";

		for(var prop in record) {
	        if(record[prop] === ''){
	            delete record[prop];
	          }
	            
	        if(prop === 'binary'){
	        	binaryField = record[prop];
	        	delete record[prop];
	        }
	        
	    }

		/* Deletes the _csrf and collection records from the array */
		 delete record._csrf; 
		 delete record.collection;

		 /* Converts the key to lowercase before saving to database */
		 var lowercaseRecord = ObjectServices.convertLowercase(record);
		 
		 /* Removes any underscores in the field name when inserting new record */
		 var finalRecord = ObjectServices.removeUnderscore(lowercaseRecord);

		 sails.models[table].create(finalRecord).exec(function (err, records) {
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/forms/myForms');
			};

			//If files exist in the parameters upload the file to the docs bucket
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

				  sails.models[table].findOne({id: records["id"]}).exec(
					  function(err,foundRecords){
					  	
					    var getOneRecord = foundRecords;
					    getOneRecord[binaryField] = filesUploaded;
					    getOneRecord.save(
					      function(err){
					      	if(err){
								AlertService.error(req, JSON.stringify(err));
								res.redirect('/forms/myForms');
							};
					      });
					});
				});
			 }
			return res.ok();
		 });
		 AlertService.success(req, 'Record saved successfully!');
		 res.redirect('/forms/myForms');
	},
	
	'getDocs': function(req, res, next){
		var file = req.param('path');
		var fileName = req.param('filename');
		res.download(file, fileName);
	}
};

