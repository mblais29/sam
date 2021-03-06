/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		if(req.session.authenticated){
			if(req.session.User.admin){
				Users.find().populateAll().exec(function foundUsers(err,users){
					if(err) return next(err);
		
					res.view({
						users: users,
						title: 'Users'
					});
				});
				return;
			}else{
				res.redirect('/map');
				return;
			}
		}else{
			res.redirect('/session/new');
			return;
		}
		
	},
	'new': function(req,res){
		res.view();
	},
	create: function(req,res,next){
		var userObj = {
			firstname: req.param('firstname'),
			lastname: req.param('lastname'),
			email: req.param('email'),
			password: req.param('password'),
			confirmation: req.param('confirmation')
		};
		
		Users.create(userObj, function userCreated(err,user){
			//if there is an error return it
			if(err){
				console.log(err);
				req.session.flash = {
					err: err
				};
				//If error returns user to sign-up page
				return res.redirect('/user/new');
			};
			res.redirect('/session/new');
		});
	},
	//Update the User from edit page
	update: function(req, res, next){
		var userObj = {};
		if(req.session.User.admin){
			 userObj = {
				firstname: req.param('firstname'),
				lastname: req.param('lastname'),
				email: req.param('email'),
				admin: req.param('admin')
			};
		}else{
			userObj = {
				firstname: req.param('firstname'),
				lastname: req.param('lastname'),
				email: req.param('email')
			};
		}

		Users.update(req.param('email'), userObj, function userUpdated(err){
			if(err){
				AlertService.error(req, err);
				res.redirect('/users/edit?email=' + req.param('email'));
				return;
			}
			return res.redirect('/users/show?email=' + req.param('email'));
		});
	},
	//shows selected user
	show: function(req, res, next){
		if(req.session.authenticated){
			Users.find(req.param('email')).populateAll().exec(function foundUser(err,user){
				if(err) return next(err);
				if(!user) return next();
	
				res.view({
					user: user,
					title: 'Show'
				});
			});
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	//Stream user profile image
	profileImg: function (req, res) {
		Users.findOne(req.param('email'), function foundUser(err,user){
			var storedProfileImg = user.profileimage;

		    var SkipperDisk = require('skipper-disk');
		    var fileAdapter = SkipperDisk(/* optional opts */);
		    fileAdapter.read(storedProfileImg).on('error', function (err) {
		      return res.serverError(err);
		    }).pipe(res);
		});
    },
	//Edit User
	edit: function(req, res, next){
		if(req.session.authenticated){
			Users.findOne(req.param('email')).populateAll().exec(function foundUser(err,user){
				if(err) return next(err);
				if(!user) return next('User doesn\'t exist...');
				res.view({
					user: user
				});
			});
		}else{
			res.redirect('/session/new');
			return;
		}
	},
	'resetpassword': function(req,res){
		//Pulls the user id from the url
		currentUserId = req.param('email');
		res.view();
	},
	
	'emailpassword': function(req,res){
		res.view();
	},
	
	//Update User's Password
	'updatepassword': function(req,res){
		//Creates User Object based on inputed values
		var userObj = {
			hashedEmail: req.param('hashedemail'),
			email: req.param('email'),
			password: req.param('password'),
			confirmation: req.param('confirmation')
		};
		
		require('bcrypt').compare(userObj.email, userObj.hashedEmail, function(err, response) {
		    //Compares entered email with url hashed email userObj.hashedEmail
		    if(response){
		    	//Finds the user by their email
				Users.findOneByEmail(userObj.email, function foundUser(err,user){
					if(err) return next(err);
					//If no user is found throw an error
					if(!user){
						AlertService.error(req, 'The user with an email address of ' + req.param('email')+ ' not found');
						return res.redirect('/users/resetpassword?hashedemail=' + userObj.hashedEmail);
					}else if(userObj.email == user.email){
						require('bcrypt').compare(userObj.password, user.encryptedPassword, function(err,valid){
							if(err){
								AlertService.error(req, 'Problem comparing the new password with password record in the database!');
								return res.redirect('/users/resetpassword?hashedemail=' + userObj.hashedEmail);
							} else if (valid){
								AlertService.error(req, 'Please enter a new unique password!');
								return res.redirect('/users/resetpassword?hashedemail=' + userObj.hashedEmail);
							} else {
								require('bcrypt').hash(userObj.password, 10, function passwordEncrypted(err,newEncryptedPassword){
							  		if(err) return next(err);
									var userNewPassword = {
										encryptedPassword: newEncryptedPassword
									};
			
									//Updates the User's Password in the database with the new password
							  		Users.update(user.id, userNewPassword, function userUpdatedPassword(err){
							  			if(err){
											AlertService.error(req, err);
											return res.redirect('/session/new');
										}
										AlertService.success(req, 'Password for user ' + user.email + ' updated successfully!');
										return res.redirect('/session/new');
									});
							  	});
							}
						});	
					}else{
						console.log('User id and email do not match!');
					}
				});
			}else{
				AlertService.error(req, 'Email entered is incorrect...');
				return res.redirect('/users/resetpassword?hashedemail=' + userObj.hashedEmail);
			}
		});
		
	},
	//Adds User security
	'addUserSecGroup': function(req, res, next){
		Users.findOne(req.param('userEmail')).populate('securitygroups').exec(function (err, user){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/users/edit?email=' + req.param('userEmail'));
					return;
			    }
				Security.findOne({secid:req.param('userAddSecGroup')}).exec(function (err, sec){
					//Adds new Security Group to the database
				    user.securitygroups.add(sec.secid);
				    user.save(function(err){
				    	if(err){
						AlertService.error(req, JSON.stringify(err));
						res.redirect('/users/edit?email=' + req.param('userEmail'));
						return;
					  }
				      return res.ok();
				    });
				});
			return res.redirect('/users/show?email=' + req.param('userEmail'));
		});
	},
	'deleteSecGroup': function(req, res, next){
		Users.findOne(req.param('email')).populate('securitygroups').exec(function removeSecGroup(err, usersec){
		  usersec.securitygroups.remove(req.param('secgroup'));
		  usersec.save();
		});
	},
	destroy: function(req, res, next){
		Users.findOne(req.param('email'), function foundUser(err,user){
			if(err) AlertService.error(req, err);
			if(!user) AlertService.error(req, 'User doesn\'t exist.');
			Users.destroy(req.param('email'), function userDestroyed(err){
				if(err) return next(err);
			});
			res.redirect('/users');
		});
	}
	
};

