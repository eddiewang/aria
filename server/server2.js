var express = require('express');
var app = express();
var path = require('path'); 
var mysql = require('mysql');


var SQL_MODULE = {
	
	sqlDetails : {
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'jetblue',
		multipleStatements: true
	},
	
	runSQL : function(socket, callback) {
		var connection = mysql.createConnection(SQL_MODULE.sqlDetails);
		connection.connect();
		
		connection.query('USE `' + SQL_MODULE.sqlDetails["database"] + '`', function(err, results) {
			if (err) {
				socket.emit('SQL_ERROR',  err.message);
			} else {
				callback(connection);
			}
		});
	}
};

var CHAT_MODULE = {

	create_post : function(socket, user_id, comment_id, rating) {
		SQL_MODULE.runSQL(socket, function(connection) {
			
			var query = "INSERT INTO comment_feedback (user_id, date_created, last_modified, rating, comment_id) \
						 VALUES (" + connection.escape(user_id) + ", NOW(), NOW(), " + connection.escape(rating) + ", " + connection.escape(comment_id) + ")";
						 
			connection.query(query, function(err, result) {
				if (err) {
					socket.emit('create_comment_feedback_fail',  err.message);
				} else {
					socket.emit('create_comment_feedback_succeed',  1);
				}
				connection.end();
			});
		});
	}
};





app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	var dest = 'index.html';
	res.sendFile(dest, { root: __dirname });
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('JetBlue started at http://%s:%s', host, port);
});

var io = require('socket.io').listen(server);








io.on('connection', function(socket){
	console.log('a user connected');

	
	
	
	socket.on('message', function(data){
		CHAT_MODULE.create_post(socket, data.message);
	});

	
	
	socket.on('disconnect', function() {
		console.log('a user left');
	});
});