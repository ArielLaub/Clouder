var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var emailValidator = function(email) {
    //var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    //return emailRegex.test(email.text); // Assuming email has a text attribut
    return true;
};

var AccountSchema   = new Schema({
    email: { type: String, index: { unique: true }, validate: [emailValidator, 'invalid email address']},
    givenName: String,
    surname: String,
    status: {type: String, enum: ['Initial', 'Pending', 'Active', 'Suspended']}
});

var accounts = mongoose.model('Account', AccountSchema);
module.exports = accounts;