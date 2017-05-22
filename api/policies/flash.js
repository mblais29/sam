/**
 * flash
 *
 * @module      :: Policy
 * @description :: TODO: You might write a short summary of how this policy works and what it represents here.
 * @help        :: http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function(req, res, next) {

  	res.locals.flash = {};
	if(!req.session.flash) return next();
	
	//If exists create a copy of it and assign it to res.local.flash
	res.locals.flash = _.clone(req.session.flash);
	
	//Clears Flash
	req.session.flash = {};
	
  	return next();

};
