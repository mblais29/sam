/**
 * SecurityController
 *
 * @description :: Server-side logic for managing securities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	//List of Security Groups page
	index: function(req, res, next){
		if(req.session.authenticated){
			if(req.session.User.admin){
				Security.find(function foundSecurity(err,security){
					if(err) return next(err);
					res.view({
						security: security,
						title: 'Security Groups'
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
	
	create: function(req,res,next){
		var secObj = {
			secname: req.param('secName'),
			secid: req.param('secId')
		};
		
		Security.create(secObj, function secGroupCreated(err,sec){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/security');
			};

			AlertService.success(req, 'You have created the ' + req.param('secName') + ' Security Group!');

			res.redirect('/security');
		});
	},
	
	edit: function(req,res,next){
		Security.findOne(req.param('secid')).exec(function (err, securityGroup) {
			return res.ok(securityGroup);
		});
	},
	
	//Update the Security Group
	update: function(req, res, next){
		var secObj = {};
			 secObj = {
				secid: req.param('sec-id'),
				secname: req.param('secname')
			};
		//console.log(secObj);
		Security.update(req.param('sec-id'), secObj, function securityGroupUpdated(err){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/security');
				return;
			}
			return res.redirect('/security');
		}); 
	},
	
	//Delete a Security Group
	destroy: function(req, res, next){
		Security.findOne(req.param('secid'), function foundUser(err,secGroup){
			if(err){
				AlertService.error(req, JSON.stringify(err));
				res.redirect('/security');
			}
			if(!secGroup) {
				AlertService.warning(req, 'Security Group doesn\'t exist...');
				res.redirect('/security');
			}
			Security.destroy(req.param('secid'), function secGroupDestroyed(err){
				if(err){
					AlertService.error(req, JSON.stringify(err));
					res.redirect('/security');
				}
			});

			AlertService.success(req, 'You have deleted the ' + secGroup.secname + ' Security Group!');
			res.redirect('/security');
		});
	},
	
	'getSecgroupEnum': function(req, res, next){
		Security.find().exec(function(err, data) {
            if (err) return next(err);
            return res.ok(data);
        });
        
	}
};

