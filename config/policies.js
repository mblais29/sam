/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/
	
  expenses: {
  	index: ['flashAlert'],
  	create: ['flashAlert']
  },
  
  expensecategory: {
  	index: ['flashAlert'],
  	create: ['flashAlert']
  },
  
  currency: {
  	index: ['flashAlert'],
  	create: ['flashAlert']
  },
  
  client: {
  	index: ['flashAlert'],
  	create: ['flashAlert']
  },
  
  forms: {
  	index: ['flashAlert'],
  	create: ['flashAlert'],
  	destroy: ['flashAlert'],
  	'myforms': ['flashAlert']
  },
  
  formfields: {
  	index: ['flashAlert'],
 	create: ['flashAlert'],
 	update: ['flashAlert']
  },
  
  maplayerstyles: {
  	index: ['flashAlert']
  },
  
  maplayers: {
  	index: ['flashAlert']
  },
  
  map: {
  	index: ['flashAlert']
  },
  
  properties: {
	index: ['flashAlert'],
	create: ['flashAlert']
  },
  
  security: {
	index: ['flashAlert'],
	create: ['flashAlert']
  },
  session: {
  	'new': ['flashAlert'],
  },
  
  users: {
  	show: ['flashAlert'],
  	edit: ['flashAlert'],
  	'new': ['flashAlert'],
  	'emailpassword': ['flashAlert'],
  	'resetpassword': ['flashAlert']
  },

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};
