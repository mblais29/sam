/**
 * FormfieldsController
 *
 * @description :: Server-side logic for managing formfields
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	index: function(req, res, next){
		Formfields.find(function foundForms(err,formfields){
			if(err) return next(err);
			res.view({
				formfields: formfields,
				title: 'Formfields'
			});
		});
	},
	
	create: function(req,res,next){
		var formObj = {
			formid: req.param('form'),
			formfieldname: req.param('formfieldname'),
			formfieldtype: req.param('formfieldtypehidden')
		};
		
		Formfields.create(formObj, function formfieldCreated(err,formfield){
			if(err){
				console.log(err);
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
				formfieldtype: req.param('formfield-type-hidden')
			};

		Formfields.update(req.param('formfieldid'), formFieldObj, function formfieldsUpdated(err){
			if(err){
				req.session.flash = {
				err: err
				};
			res.redirect('/formfields');
			return;
			}
			Forms.findOne(req.param('formID')).exec(function (err, form) {
				var collection = form.collectionname;
				var MongoClient = require('mongodb').MongoClient;
		 		var myCollection;
		 		var newFieldName = {};
		 		var previousFieldName = req.param('previous-field-name').toLowerCase();
		 		var changedFieldName = req.param('formfieldName').toLowerCase();
		 		newFieldName[previousFieldName] = changedFieldName;
		 		
				MongoClient.connect(sails.config.conf.url, function(err, db) {
				    if(err)
				    	throw err;
				         
				    myCollection = db.collection(collection);
				    myCollection.update({}, {$rename:newFieldName}, {multi: true});
					
					return res.redirect('/formfields');
				});
				
			});
			
		}); 
	},
	
	'insert': function(req, res, next){
		var binaryField = req.param('binary');
		var record = req.allParams();

		for(var prop in record) {
	        if(record[prop] === '')
	            delete record[prop];
	        if(prop === 'binary')
	        	delete record[prop];
	        
	    }

		/* Deletes the _csrf and collection records from the array */
		 delete record._csrf; 
		 delete record.collection;

		 /* Converts the key to lowercase before saving to database */
		 var lowercaseRecord = ObjectServices.convertLowercase(record);
		 
		 /* Removes any underscores in the field name when inserting new record */
		 var finalRecord = ObjectServices.removeUnderscore(lowercaseRecord);

		 var MongoClient = require('mongodb').MongoClient;
		 var myCollection;
		 var insertedId;
		 var docName = [];
		 var docId = [];
		 
		 MongoClient.connect(sails.config.conf.url, function(err, db) {
		     if(err)
		         throw err;
		         
		     myCollection = db.collection(req.param('collection'));
		     myCollection.insert(finalRecord, function(err, result) {
			     if(err)
			         throw err;

	 			 insertedId = result.insertedIds[0];

	 			 //If files exist in the parameters upload the file to the docs bucket
	 			 if(typeof req._fileparser.upstreams[0] !== 'undefined'){
				 	var uploadFile = req._fileparser.upstreams[0];
				 	
				 	//console.log(uploadFile._files['length']);
				 	//console.log(uploadFile);
				 	//console.log(req._fileparser.upstreams[0]._files[0].stream.filename.split('.').pop());
					  
				 		uploadFile.upload({
						   adapter: require('skipper-gridfs'),
						   uri: sails.config.conf.docUrl,
						   saveAs: function(file, handler) {handler(null,file.filename);},
						   maxBytes: 1000000000, //1GB or 1000mb
						   }, function (err, filesUploaded) {
							   
							   if (err) return res.negotiate(err);
							   //If there are more than 1 file create an array or else just load the one file
							   if(filesUploaded.length > 1){
							     for(var i = 0; i < filesUploaded.length; i++){
							     	docName.push(filesUploaded[i].filename);
							     	docId.push(filesUploaded[i].extra['fileId']);
								   }
							   }else{
							     docName = filesUploaded[0].filename;
							     docId = filesUploaded[0].extra['fileId'];
							   };
							   
							   var docObj = {};
							   docObj[binaryField] = docName;
							   docObj["docid"] = docId;

							   //Updates the new record with uploaded file name
					           myCollection.update({_id:insertedId}, {$set:docObj});
						 });
					 }
			 });
		 });
		res.redirect('/forms/myForms');
	},
	
	'streamFile': function (req, res) {
		
		var docAdapter = require('skipper-gridfs')({
			//reaam.docs is the database.file[bucket]
			uri: sails.config.conf.docUrl
		});

		var value = req.param('docid');
		var fileName;
		var MongoClient = require('mongodb').MongoClient;
    	var ObjectID = require('mongodb').ObjectID;
    	
    	MongoClient.connect(sails.config.conf.url, function(err, db) {
		     if(err)
		         throw err;
		     var myCollection = db.collection('docs.files');

		     // Find the file name
		     myCollection.findOne({"_id" : ObjectID("" + value + "")}, function(err, records) {
				fileName = records['filename'];
				//res.json(fileName);

				//Download the selected file
				docAdapter.read(fileName, function(error , file) {
					 if(error) {
						res.json(error);
					} else {
						res.set({'Content-Disposition': 'attachment; filename=' + fileName + ''});
						res.send(new Buffer(file, 'binary'));
					}
				 });
		     });
		         
		});  
    },
    
    'getDocs': function (req, res) {
    	var MongoClient = require('mongodb').MongoClient;
    	var ObjectID = require('mongodb').ObjectID;
		var myCollection;
		
		MongoClient.connect(sails.config.conf.url, function(err, db) {
		     if(err)
		         throw err;

		     myCollection = db.collection(req.param('collection'));
		     
		     // Find the document records
		     myCollection.find({_id:ObjectID(req.param('recordid'))}).toArray(function(err, records) {
				//Need to only return the docids not everything....
				
		     	res.json(records);
		     });
		         
		});
    
    },
    
    'checkField': function(req, res, cb){
		var formId = parseInt(req.param("formid"));
		Formfields.findOne({formid: formId, formfieldname: req.param("formfieldname")}).exec(function (err, formfield) {
			if(err) return next(err);
			if(formfield){
				return res.ok(formfield["formfieldtype"]);
			}
		});
	},
	'addDoc': function (req, res) {

		var MongoClient = require('mongodb').MongoClient;
    	var ObjectID = require('mongodb').ObjectID;

		var insertedId = req.param('id');
		var binaryField = req.param('binaryField');

		var docName = [];
		var docId = [];
		 
		MongoClient.connect(sails.config.conf.url, function(err, db) {
		     if(err)
		         throw err;
		      myCollection = db.collection(req.param('collection'));
		     //If files exist in the parameters upload the file to the docs bucket
 			 if(typeof req._fileparser.upstreams[0] !== 'undefined'){
			 	var uploadFile = req._fileparser.upstreams[0];
			 	
		 		uploadFile.upload({
				   adapter: require('skipper-gridfs'),
				   uri: sails.config.conf.docUrl,
				   saveAs: function(file, handler) {handler(null,file.filename);},
				   maxBytes: 1000000000, //1GB or 1000mb
				   }, function (err, filesUploaded) {
					   
					   if (err) return res.negotiate(err);
					   //If there are more than 1 file create an array or else just load the one file
					   if(filesUploaded.length > 1){
					     for(var i = 0; i < filesUploaded.length; i++){
					     	docName.push(filesUploaded[i].filename);
					     	docId.push(filesUploaded[i].extra['fileId']);
						   }
					   }else{
					     docName = filesUploaded[0].filename;
					     docId = filesUploaded[0].extra['fileId'];
					   };
					   
					   var docObj = {};
					   docObj[binaryField] = docName;
					   docObj["docid"] = docId;

					   //Updates the new record with uploaded file name
					   myCollection.find({_id:ObjectID(insertedId)}).forEach(
					     function(e, i){ 
				       		if(e[binaryField] instanceof Array){
				       			var isArray = false;
				       			for(var key in docObj){
				       				if(docObj[key] instanceof Array){
				       					isArray = true;
				       					for(var i = 0; i < docObj[key].length; i++){
					       					var newObj = {};
					       					newObj[key] = docObj[key][i];
					       					myCollection.update({_id:ObjectID(insertedId)}, {$push:newObj});
					       				}
				       				}
				       			}
				       			if(isArray === false){
				       				myCollection.update({_id:ObjectID(insertedId)}, {$push:docObj});
				       			}
				       				
				       		}else{
				       		//If the current record only has one document rewrite ($set) the binary field records and docid
				       			var newArrName = [];
				       			var newArrId = [];
				       			newArrName.push(e[binaryField]);
				       			newArrId.push(e["docid"]);
								var isArray = false;
								
				       			for(var key in docObj){
				       			//Handles mongodb records array
				       				if(docObj[key] instanceof Array){
				       					isArray = true;
				       					for(var i = 0; i < docObj[key].length; i++){
						       				var newObj = {};
						       				if(key === binaryField){
						       					newArrName.push(docObj[key][i]);
						       					newObj[key] = newArrName;
						       				};
						       				if(key === "docid"){
						       					newArrId.push(docObj[key][i]);
						       					newObj[key] = newArrId;
						       				};
						       				
				       					}
				       					myCollection.update({_id:ObjectID(insertedId)}, {$set:newObj});
				       				};
				       			};
				       			//Handles mongodb records if it is not already an array (rewrites the field record)
				       			if(isArray === false){
			       					for(var key in docObj){
				       					var newObj = {};
				       					if(key === binaryField){
					       					newArrName.push(docObj[key]);
					       					newObj[key] = newArrName;
				       					};
				       					if(key === "docid"){
					       					newArrId.push(docObj[key]);
					       					newObj[key] = newArrId;
					       				};
					       				myCollection.update({_id:ObjectID(insertedId)}, {$set:newObj});
			       					}
				       			}
				       		}
					   });
				 });
			}
		 });
		 res.redirect('/forms/myForms');
	},
	
	'deleteDoc': function (req, res) {
		var docId = req.param('docid');
		var record = req.param('record');
		var docName = req.param('docname');
		var field = req.param('formfield');
		
		var n = {};
        n[field] = docName;
        	
		var docAdapter = require('skipper-gridfs')({
	    	//reaam.docs is the database.file[bucket]
            uri: sails.config.conf.docUrl
        });
		
		var MongoClient = require('mongodb').MongoClient;
    	var ObjectID = require('mongodb').ObjectID;
		var myCollection;
		
		MongoClient.connect(sails.config.conf.url, function(err, db) {
		     if(err)
		         throw err;

		     myCollection = db.collection(req.param('collection'));
		     
		     // Delete document record from collection
		     myCollection.find({_id:ObjectID(record)}).toArray(function(err, records) {
		     	//If there are more than one file assigned to the record $pull or else $unset
		     	console.log(field);
		     	if(records[0][field] instanceof Array && records[0][field].length > 1){
		     		myCollection.update({_id:ObjectID(record)},{$pull: {docid:ObjectID(docId)}}, function(err, result) {
						if (err) {
			                console.log(err);
			            }
			            
			            myCollection.update({_id:ObjectID(record)},{$pull: n}, function(err, result) {
							if (err) {
				                console.log(err);
				            }
				        });
		            	//Remove the file from the database
		            	var docCollection = db.collection('docs.files');     
					    docCollection.remove({_id:ObjectID(docId)}, function(err){
					      if (err) {
			                console.log(err);
			            	}          
					    });
				     });
		     	}else{
		     		myCollection.update({_id:ObjectID(record)},{$unset: {docid:ObjectID(docId)}}, function(err, result) {
						if (err) {
			                console.log(err);
			            }
			            myCollection.update({_id:ObjectID(record)},{$unset: n}, function(err, result) {
							if (err) {
				                console.log(err);
				            }
				        });
		            	//Remove the file from the database
		            	var docCollection = db.collection('docs.files');     
					    docCollection.remove({_id:ObjectID(docId)}, function(err){
					      if (err) {
			                console.log(err);
			            	}          
					    });
				     });
		     	}
		     });     
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
	}
};

