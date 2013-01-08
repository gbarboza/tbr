var mongoose = require('mongoose');

var linkSchema = new mongoose.Schema({
    url: String,
    desc: String,
    folder: { type: String, default: 'Main'}
});

var userSchema = new mongoose.Schema({
    email: String,
    /* Bcrypt hash */
    pass: String,
    folders: [String],
    links: [linkSchema]
});

exports.User = mongoose.model('User', userSchema);
