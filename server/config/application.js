var env             = process.env.NODE_ENV || 'development',
    config          = require('./config.js')[env],
    packageJson     = require('../package.json'),
    path            = require('path'),
    express         = require('express'),
    cookieParser    = require('cookie-parser'),
  	bodyParser      = require('body-parser'),
	machineLearning = require('./../routes/api.js');

/**
 * Global application object
 */
 

 


 
global.App = {
  	app: express(),
    server: null,
	port: process.env.PORT || config.port || 3000,
	IP: process.env.IP || config.IP || '0.0.0.0',
	version: packageJson.version,
	root: path.join(__dirname, '..'),
    env: env,
    config: config,
	db: null,
	appPath: function (path) {
		return this.root + '/' + path;
	},
	require: function (path) {
		return require(this.appPath(path));
	},	
	start: function () {
		if (!this.started) {
			console.log('Loading App in ' + env + ' mode.');
			this.started = true;
			this.server = this.app.listen(this.port, this.IP, function () {
				console.log('Running App Version ' + App.version + ' at ' + App.IP + ' on port ' + App.port + ' in ' + App.env + ' mode.');
			});
			this.app.on('error', onError);
			
			setUpSockets(this.server);
		}
	},
	stop: function () {        
        if (this.server) this.server.close();
	},
	route: function (path) {
		return this.require('./routes/' + path);
	},
	middleware: function (path) {
		return this.require('./middlewares/' + path);
	}
};


// Middlewares
App.app.use(bodyParser.json());
App.app.use(bodyParser.urlencoded({ extended: false }));
App.app.use(cookieParser());
App.app.use(express.static(App.appPath('public')));

App.app.get('/', function(req, res, next) {
    res.sendfile("index.html");
});

// Routing
App.require('config/routes')();


// Database connection
App.require('./config/database.js')(process.env.DATABASE_URL || config.db_url || 'mongodb://eddieadmin:hotline123@ds029814.mongolab.com:29814/yhacks');


// error handlers

/**
 * Development error handler.
 * Will print stacktrace.
 */
if (App.app.get('env') === 'development') {
  	App.app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.json({
	    	success: false,
	    	message: err.message,
	    	error: err
	    });
	});
}

/**
 * Production error handler.
 * No stacktraces leaked to user.
 */
App.app.use(function(err, req, res, next) {
  	res.status(err.status || 500);
  	res.json({
    	success: false,
    	message: err.message,
    	error: {}
  	});
});


// Helper functions

/**
 * Normalize a port into a number, string, or false.
 */ 
function normalizePort(val) {
 	var port = parseInt(val, 10);

  	if (isNaN(port)) {
    	// named pipe
    	return val;
  	}

  	if (port >= 0) {
    	// port number
    	return port;
  	}

  	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  	if (error.syscall !== 'listen') {
    	throw error;
  	}

  	var bind = typeof port === 'string'
    	? 'Pipe ' + port
    	: 'Port ' + port;

  	// handle specific listen errors with friendly messages
  	switch (error.code) {
    	case 'EACCES':
	      	console.error(bind + ' requires elevated privileges');
	      	process.exit(1);
	      	break;
    	case 'EADDRINUSE':
		      console.error(bind + ' is already in use');
		      process.exit(1);
		      break;
	    default:
	      	throw error;
  	}
}










var sockets = {};
var broadcasting = false;
var questions = [
	{
		'id' : 0,
		'question' : "It appears that you are located in New Haven. Would you like to add more depart locations?",
		'fill_in' : false,
		'choices' : ['No', 'Yes']
	},
	{
		'id' : 1,
		'question' : "Please tell us where you would like to travel to. You may list multiple places.",
		'fill_in' : true,
		'choices' : []
	},
	{
		'id' : 2,
		'question' : "Please tell us you would like to depart from. You may list multiple places.",
		'fill_in' : true,
		'choices' : []
	},
	{
		'id' : 3,
		'question' : "Below are your recommended flights. Tell us more requirements to refine your results!",
		'fill_in' : true,
		'choices' : []
	},
	{
		'id' : 4,
		'question' : "I didn’t quit understand that. Please rephrase what you said.",
		'fill_in' : true,
		'choices' : []
	}
];
var active_users = {
	
};


function getArray() {
	var data = [];
	for (var i=0; i<questions.length; i+=1) {
		data.push(null);
	}
	return data;
} 


function setUpSockets(server) {
	
	// socket stuff
	var askQuestion = function(socket, FBID) {
		var cur_user = active_users[FBID];
		var user_answers = cur_user.questions;
			
		for(var i=0; i<user_answers.length; i+=1) {
			
			console.log(i, user_answers[i]);
			if (user_answers[i] == null) {
				socket.emit('ask_question', questions[i]);
				break;
			}
		}
	};
	
	
	var io = require('socket.io').listen(server);
	io.on('connection', function(socket){
		console.log('a user connected');
		
		socket.on('login', function(data) {
			var FBID = data.facebookid;
			if (FBID in active_users) {
				console.log('a user returned');
			} else {
				active_users[FBID] = {
					'socket' : socket,
					'questions' : getArray(),
					'fid' : FBID
				};
			}
			console.log('authenticated');
			askQuestion(socket, FBID)
			




			socket.on('receive_answer', function(data) {
				console.log("got data", data);
				// parse the user answer and split it into array accordingly
				
				// update answer back into user array
				console.log("using fbid" , FBID);
				console.log("using fbid" , FBID);
				active_users[FBID].questions[data.id] = data.answer;
				
				askQuestion(socket, FBID);

				socket.emit('receive_answer_success', data.tagid);
			});
			
			socket.on('send_message', function(data) {

				console.log("HERE", data);


				if (!broadcasting) {
					
					broadcasting = true;
					machineLearning(data, function(data) {
						io.emit('recieve_message_success', data);
						broadcasting = false;
					}, function(data) {
						socket.emit('recieve_message_fail', data);
						broadcasting = false;
					});
				} else {
					socket.emit('recieve_message_fail', {
						success: false,
						message: 'A change is currently happening in the server, please try again'
					});
				}
			});
		});
		socket.on('disconnect', function() {
			console.log('a user left');
		});
	});
}