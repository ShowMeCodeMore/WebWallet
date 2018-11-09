var mongoose = require('../../db'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : String,
    userpassword : String,
    keystore : String
})

module.exports = mongoose.model('User',UserSchema);