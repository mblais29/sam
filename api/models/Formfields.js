/**
 * Formfields.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
autoPK: false,
  attributes: {
	formfieldid: {
		type: 'integer',
		primaryKey: true,
    	autoIncrement: true
	},
	formid: {
		model:'Forms'
	},
	formfieldname: {
		type: 'string',
		required: true
	},
	fieldname: {
		type: 'string',
		required: true
	},
	formfieldtype: {
		type: 'string',
    	enum: ['character varying', 'text', 'integer', 'numeric', 'date', 'datetime', 'binary', 'boolean'],
    	defaultsTo: 'string'
	}
  },
  
};

