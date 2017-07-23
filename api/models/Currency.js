/**
 * Currencies.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	currency: {
		type: 'string',
		primaryKey: true,
    	unique: true
	},
	description: {
		type: 'string',
		required: true
	},
	symbol: {
		type: 'string',
		required: true
	}
  }
};

