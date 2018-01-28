/**
 * Layers.js
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
	name: {
		type: 'string',
		required: true
	},
	layer_table_ref: {
		type: 'string',
		required: true
	},
	layer_type: {
		type: 'string',
		required: true,
    	enum: ['polygon', 'point', 'line'],
    	defaultsTo: 'polygon',
    	required: true
	},
	layer_style: {
		collection: 'MapLayerStyles',
        via: 'id'
	},
	layer_attributes_onclick: {
		type: 'string'
	},
	layer_assigned_form: {
		collection: 'Forms',
        via: 'formid'
	}
  }
};

