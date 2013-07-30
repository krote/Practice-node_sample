
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express);

var app = express();
var domain = (process.env.NODE_ENV === 'production') ? '10.0.0.1' : '127.0.0.1';

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// for login management
app.use(express.cookieParser());
app.use(express.session({
	secret: 'secret',
	store: new MongoStore({
		db:'session',
		host:domain,
		clear_interval:60*60
	}),
	cookie:{
		httpOnly:false,
		maxAge:new Date(Date.now() + 60 * 60 * 10000)
	}
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// for development environments
app.configure('development', function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

// for production environments
app.configure('production', function(){
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', {maxAge:oneYear}));
	app.use(express.errorHandler());
});


/**
*	loginCheck
*/
var loginCheck = function(req, res, next){
	if( req.session.user ){
		console.log('find user !');
		next();
	}else{
		console.log('please login');
		res.redirect('/login');
	}
};

app.get('/', loginCheck, routes.index);
app.get('/login', routes.login)
//app.get('/users', user.list);

/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/

var server = http.createServer(app);
server.listen(app.get('port'));

var io = require('socket.io').listen(server);
var model = require('./model');

io.sockets.on('connection', function(socket){
	console.log('Socket.IO session connection');

	// first. show all records
	model.User.find().lean().exec(function(err, users){
		if( err ) console.log(err);
		socket.emit('searchResult', users);
	});

	socket.on('save', function(msg){
		console.log('save event has come');
		model.User.update(
			{userId: msg.userId}, msg, {upsert:true},
			function(err){ if(err) console.log(err); }
			);
	});
	socket.on('search', function(msg){
		console.log('search event has come');
		model.User.find(msg).lean().exec(function(err, users){
			if(err) console.log('has something error');
			socket.emit('searchResult', users.toJSON());
		})
	});
});

