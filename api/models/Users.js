/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	//Takes the object being saved and compares it with the schema
  schema: true,
  attributes: {
	firstname: {
		type: 'string',
		required: true
	},
	lastname: {
		type: 'string',
		required: true
	},
	email: {
		type: 'string',
		primaryKey: true,
		email: true,
		required: true,
		unique:true
	},
	admin: {
		type: 'boolean',
		defaultsTo: false
	},
	securitygroups: {
		collection: 'Security',
        via: 'secid',
        defaultsTo : 'GUEST'
	},
	profileimage: {
		type: 'string'
	},
	encryptedPassword: {
		type: 'string'
	},
	//Rewrites the toJSON and removes the passwords and CSRF token from the object
	toJSON: function(){
		var obj = this.toObject();
		delete obj.password;
		delete obj.confirmation;
		delete obj.encryptedPassword;
		delete obj._csrf;
		return obj;
	}
  },
  beforeCreate: function(values, next){
  	//Checks to see that the password and password confirmation match
  	if(!values.password || values.password != values.confirmation){
  		return next({err: ["Password does not match password confirmation."]});
  	}
  	require('bcrypt').hash(values.password, 10, function passwordEncrypted(err,encryptedPassword){
  		if(err) return next(err);
  		values.encryptedPassword = encryptedPassword;
  		//values.online = true;
  		next();
  	});
  }
};

