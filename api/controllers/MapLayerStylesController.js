/**
 * MapLayerStylesController
 *
 * @description :: Server-side logic for managing Maplayerstyles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function(req,res){
		//if session is authenticated go to map else redirect to login page
		if(req.session.authenticated){
			if(req.session.User.admin){
				/* Add populateAll to get all the foreign keys for the client model */
				MapLayerStyles.find().exec(function foundClientss(err,data){
					if(err) return next(err);
					res.view({
						styles: data,
						title: 'MapLayerStyles'
					});
				});
			}else{
				res.redirect('/map');
				return;
			}
		}else{
			res.redirect('/session/new');
			return;
		}
	},
};

