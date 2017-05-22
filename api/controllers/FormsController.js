/**
 * FormsController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	//List of Users page
	index: function(req, res, next){
		/* Add populateAll to get all the foreign keys for the form model */
		Forms.find().populateAll().exec(function foundForms(err,data){
			if(err) return next(err);

			res.view({
				forms: data,
				title: 'Forms'
			});
		});
	},
	
	'myForms': function(req, res){
		var userSecGroups = [];
		//Searches for current user and checks the security groups assigned to them
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
	},
	
};

