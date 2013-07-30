
/*
 * GET home page.
 */

var TITLE = "Node Sample"

var model = require('../model.js'),
	User = model.User;

/**
*	index
*/
exports.index = function(req, res){
  res.render('index', { title: TITLE });
};


/**
*	login
*/
exports.login = function(req, res){
	console.log('login event has come');
	var email 		= req.query.email;
	var password	= req.query.password;
	console.log('email is:' + email + ', password is:' + password );

	var query = { 'email':email, 'password':password};

	User.find(query, function(err, data){
		if(err){
			console.log(err);
		}
		if( data == "" ){
			res.render('login', {title:TITLE});
			console.log('not find user');
		}else{
			console.log(req.session);
			req.session.user = email;
			res.redirect('/');
		}
	});
};
