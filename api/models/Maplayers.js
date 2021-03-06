/**
 * Layers.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	layerid: {
		type: 'string',
		primaryKey: true,
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
	},
	minzoom:{
		type: 'integer',
		defaultsTo: 0
	},
	maxzoom: {
		type: 'integer',
		defaultsTo: 20
	}
  }
};

