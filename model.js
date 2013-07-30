var domain = (process.env.NODE_ENV === 'production') ? '0.0.0.0' : '127.0.0.1';
var mongoose = require('mongoose');
var url = 'mongodb://' + domain + ':27017/node_sample';
var db = mongoose.connect(url);
db.connection.on('connected',function(){
	console.log('MongoDB connected');
});

var crypto = require('crypto');

/**
*	= User Model =
*/
var User = new mongoose.Schema({
	email:{
		type:String, 
		unique:true
	},
	name:String,
	password:String,
	_id:String
}, {collection:'users'});

exports.User = db.model('users', User);


