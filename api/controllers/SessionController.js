/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');
module.exports = {
	
	'new': function(req,res){
		if(req.session.authenticated){
			res.redirect('/map');
		}else{
			res.view('session/new');
		}
	},
	
	create: function(req,res,next){
		//checks to see if the user has entered a username and password
		if(!req.param('email') || !req.param('password')){
			AlertService.warning(req, 'The entered email and or password is incorrect.');
			res.redirect('/session/new');
			return;
		}
		//Finds the user by their email
		Users.findOneByEmail(req.param('email')).exec(function foundUser(err,user){

			if(err) AlertService.error(req, err);
			//If no user is found throw an error
			if(!user){
				AlertService.warning(req, 'No user with the email ' + req.param('email') + ' found.');
				res.redirect('/session/new');
				return;

			}
			//Compares the user password from the form to the user password found
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err,valid){
				if(err) return next(err);
				//If password from the database does not match throw an error
				if(!valid){
					AlertService.error(req, 'Incorrect Password.');
					res.redirect('/session/new');
					return;
				}
				
				//Log in user
				req.session.authenticated = true;
				req.session.User = user;
				//console.log(user);
				
				//if user is admin user redirects to user list page
				if(req.session.User.admin){
					res.redirect('/map');
					return;
				}
				//Redirect to their profile page
				res.redirect('/users/show?email=' + user.email);
			});
		});	
	},
	
	destroy: function(req, res, next){
		//Wipe out session
		req.session.destroy();
		
		//Redirect browser to signin page
		res.redirect('/session/new');
	}
};

