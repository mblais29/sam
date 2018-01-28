/**
 * Properties.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	id: {
		type: 'integer',
		primaryKey: true,
    	autoIncrement: true
	},
	featureid: {
		type: 'integer',
		required: true
	},
	comments: {
		type: 'longtext'
	},
	employeename: {
		type: 'string',
		required: true
	},
  }
};

