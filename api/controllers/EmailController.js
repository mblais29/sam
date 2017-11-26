/**
 * EmailController
 *
 * @description :: Server-side logic for managing Emails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	sendEmail: function(req, res) {
		var userObj = {
			email: req.param('email')
		};
		
		
		//Finds the user by their email
		Users.findOneByEmail(userObj.email, function foundUser(err,user){
			if(err) return next(err);
			//If no user is found throw an error
			if(!user){
				AlertService.error(req, 'The email address ' + req.param('email')+ ' not found...');
				res.redirect('/users/emailpassword');
				return;

			}
			
			//Hash the user email for security
			require('bcrypt').hash(user.email, 10, function encrypted(err,encryptedEmail){
				var sendHashedEmail = "";
		  		if(err) return next(err);
		  		sendHashedEmail = encryptedEmail;
		  		
		  		sails.hooks.email.send(
				  "passwordResetEmail",
				  {
				  	protocol: req.protocol,
				  	host: req.host,
				  	port: req.port,
				    recipientName: user.firstname + ' ' + user.lastname,
				    senderName: user.firstname,
				    senderEmail: user.email,
				    hashedEmail: sendHashedEmail,
				    userId: user.id
				  },
				  {
				    from: "Admin <admin@sam.com>",
				    to: user.email,
				    subject: "Password Reset Email"
				  },
				  function(err) {console.log(err || "Email is sent");}
				);		
			
			//return res.send('Emailed password reset link to email provided...');
			res.redirect('/session/new');
			return;
			
		  });
		});
	}
};

