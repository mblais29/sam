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
	collectionname: {
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
  },
 //Before create create an autoincremented formid using the sequence model
  beforeCreate : function (values, cb) {
        // add seq number, use
        FormSequence.next("order", function(err, num) {
            if (err) return cb(err);
            values.formid = num;
            cb();
        });
   }
    
};

