/**
 * MapLayerStyles.js
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
	description: {
		type: 'string',
		required: true
	},
	type: {
		type: 'string',
		required: true,
    	enum: ['polygon', 'point', 'line'],
    	defaultsTo: 'polygon',
    	required: true
	},
	style: {
		type: 'json',
		defaultsTo: null
	},
	prefix: {
		type: 'string',
		enum: ['fa', 'glyphicon'],
		defaultsTo: null
	},
	markerColour: {
		type: 'string',
		enum: ['red', 'darkred', 'orange', 'green', 'darkgreen', 'blue', 'purple', 'darkpurple', 'cadetblue'],
		defaultsTo: null
	},
	markerIcon: {
		type: 'string',
		defaultsTo: null
	},
	markerIconColor: {
		type: 'string',
		defaultsTo: null
	}
  }
};

