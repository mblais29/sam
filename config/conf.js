/* Notes: 
 *	1. Cannot have _ in the model field names
 * 	2. You must create a model for the table you want to insert data into via myForms
 * 
 * 
*/

module.exports.conf = {
	/* Store Documents & Files */
    docUrl: 'C:/Users/MitchelBlais/Documents/files/',
    
    /* Stores the profile images */
    profileImgUrl: 'C:/Users/MitchelBlais/Documents/files/profileImg/',
    
    /* Allowed file types for uploading */
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};
