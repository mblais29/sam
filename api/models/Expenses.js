/**
 * Expenses.js
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
	employee: {
		type: 'string',
		required: true
	},
	name: {
		type: 'string',
		required: true
	},
	category: {
		collection: 'Expensecategory',
        via: 'id'
	},
	client: {
		collection: 'Client',
        via: 'id'
	},
	comment: {
		type: 'text'
	},
	date: {
		type: 'date',
		required: true
	},
	amount: {
		type: 'float',
		required: true
	},
	currency: {
		collection: 'Currency',
        via: 'currency'
	},
	documents: {
		type: 'json'
	},
  }
};

