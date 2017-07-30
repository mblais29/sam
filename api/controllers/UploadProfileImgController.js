/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	upload: function(req, res) {

		if (req.method === 'GET')
			return res.json({ 'status': 'GET not allowed' });

		var uploadFile = req.file('uploadFile');
		
		
		uploadFile.upload({
			  dirname: sails.config.conf.profileImgUrl
			}, function(err, uploadedFiles) {
			  if (err) { return res.serverError(err); }
			  var userId = req.session.User.email;
			  console.log(uploadedFiles[0].fd );
			 var userObj = {
				//Adds the encrypted filename to user.profileimage field record for user being edited
				  profileimage: uploadedFiles[0].fd 
			  };
				Users.update(userId, userObj, function userUpdated(err){
					if(err){
						res.json(err);
					}
				});  
			  return res.redirect('/user/show?email=' + userId);
		  
			});
	}
};

