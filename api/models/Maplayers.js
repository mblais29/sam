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
	layerid: {
		type: 'string',
		required: true
	},
	name: {
		type: 'string',
		required: true
	},
	url: {
		type: 'string',
		required: true
	},
	layertableref: {
		type: 'string',
		required: true
	},
	layertype: {
		type: 'string',
		required: true,
    	enum: ['polygon', 'point', 'line'],
    	defaultsTo: 'polygon',
    	required: true
	},
	layerstyle: {
		collection: 'MapLayerStyles',
        via: 'id'
	},
	layerattributesonclick: {
		type: 'string'
	},
	layerassignedform: {
		collection: 'Forms',
        via: 'formid'
	}
  }
};

