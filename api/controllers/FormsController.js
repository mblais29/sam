/**
 * FormsController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	//List of Users page
	index: function(req, res, next){
		if(req.session.authenticated){
			/* Add populateAll to get all the foreign keys for the form model */
			Forms.find().populateAll().exec(function foundForms(err,data){
				if(err) return next(err);
	
				res.view({
					forms: data,
					title: 'Forms'
				});
			});
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	
	create: function(req,res,next){
		var formObj = {
			formname: req.param('formName'),
			tablename: req.param('formTableName'),
			securitygroup: req.param('secgrouphidden')
		};
		
		Forms.create(formObj, function formCreated(err,form){
			if(err){
				AlertService.error(req, JSON.stringify(err));
			};
			console.log('Created Form ' + req.param('formName') + ' Successfully');
			res.redirect('/forms');
		});
	},
	
	edit: function(req,res,next){
		Forms.findOne(req.param('formid')).exec(function (err, form) {
			return res.ok(form);
		});
	},
	
	update: function(req, res, next){
		var formObj = {};
			 formObj = {
				formid: req.param('form-id'),
				formname: req.param('formname'),
				securitygroup: req.param('seceditgrouphidden')
			};

		Forms.update(req.param('form-id'), formObj, function formsUpdated(err){
			if(err){
				AlertService.error(req, JSON.stringify(err));
			res.redirect('/forms');
			return;
			}
			return res.redirect('/forms');
		}); 
	},
	
	//Delete the Form
	destroy: function(req, res, next){
		Forms.find().where({formid: req.param('formid')}).populateAll().exec(function (err, response) {
			var fields = response[0].formfields;
			if(fields.length){
				AlertService.warning(req, 'Must delete the form fields first before deleting the form...');
				res.redirect('/forms');
				return;
			}else{
				Forms.findOne(req.param('formid'), function foundForm(err,form){
					if(err) return next(err);
					if(!form) return next('Form doesn\'t exist...');
					Forms.destroy(req.param('formid'), function formDestroyed(err){
						AlertService.warning(req, JSON.stringify(err));
					});
					res.redirect('/forms');
				});
			}
    	});
	},
	
	'myForms': function(req, res){
		var userSecGroups = [];
		//Searches for current user and checks the security groups assigned to them
		if(req.session.authenticated){
			Users.findOneByEmail(req.session.User.email).populateAll().exec(function foundUser(err,user){
				for(var i = 0; i<user.securitygroups.length; i++){
					userSecGroups.push(user.securitygroups[i].secid);
				}
	
				Forms.find().populateAll().exec(function foundForms(err,data){
					//Lists only forms user has access too
					var formList = [];
					var formSecGroup = "";
					for(var i = 0; i < data.length; i++){
						formSecGroup = data[i].securitygroup[0].secid;
	
						if(ArrayCheckService.checkArray(userSecGroups, formSecGroup) === true){
							formList.push(data[i]);
						};
					}
					res.view({
						forms: formList,
						title: 'myForms'
					});
				});
				
			});
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	
	'populate': function(req, res, next){
		Forms.find().where({formid: req.param('formid')}).populateAll().exec(function (err, response) {
			if(err) return next(err);
			//Must return res.ok() to send the data to the ajax call
			return res.ok(response);
		});
	},
	
	'getSecGroup': function(req, res){
		Forms.find().where({formid: req.param('formid')}).populateAll().exec(function (err, records) {
			if(err) return next(err);
			//Must return res.ok() to send the data to the ajax call
			return res.ok(records);
		});
	},
	
};

