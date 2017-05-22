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
	formfieldtype: {
		type: 'string',
    	enum: ['string', 'text', 'integer', 'float', 'date', 'datetime', 'binary', 'boolean', 'json', 'mediumtext', 'longtext'],
    	defaultsTo: 'string'
	}
  },
  //Before create create an autoincremented formid using the sequence model
  beforeCreate : function (values, cb) {
        // add seq number, use
        FormfieldSequence.next("order", function(err, num) {
            if (err) return cb(err);
            values.formfieldid = num;
            cb();
        });
    }
};

