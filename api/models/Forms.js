/**
 * Forms.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {
	formid: {
		type: 'integer',
		primaryKey: true,
    	autoIncrement: true
	},
	formname: {
		type: 'string',
		required: true
	},
	tablename: {
		type: 'string',
		required: true
	},
	securitygroup: {
		collection: 'Security',
        via: 'secid'
	},
	formfields: {
		collection: 'Formfields',
        via: 'formid'
	}
  }
    
};

