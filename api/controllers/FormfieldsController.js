/**
 * FormfieldsController
 *
 * @description :: Server-side logic for managing formfields
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	index: function(req, res, next){
		if(req.session.authenticated){
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
	}
};
