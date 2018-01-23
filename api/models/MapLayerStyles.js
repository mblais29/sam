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
    	enum: ['polygon', 'point', 'line']
	},
	style: {
		type: 'json'
	},
	prefix: {
		type: 'string',
		enum: ['fa', 'glyphicon']
	},
	markerColour: {
		type: 'string',
		enum: ['red', 'darkred', 'orange', 'green', 'darkgreen', 'blue', 'purple', 'darkpurple', 'cadetblue']
	},
	markerIcon: {
		type: 'string'
	},
	markerIconColor: {
		type: 'string'
	}
  }
};

