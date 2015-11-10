var express = require('express');
var app = express();
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
				socket.emit('SQL_ERROR: ',  err.message);
			} else {
				callback(connection);
			}
		});
	}
};


var CHAT_MODULE = {

	get_packages_1 : function(socket) {
		SQL_MODULE.runSQL(socket, function(connection) {
			
			var query = "SELECT origin,destination,hotel_property,hotel_night_stay,hotel_check_in_date,hotel_check_out_date,expedia_price,jetblue_price,percent_saving,month,advance_start_week,advance_end_week,count,nightLife,romance,beach,family,exploration,type_id,direction_id \
						 FROM package \
						 LIMIT 100";
						 
			connection.query(query, function(err,rows,fields) {
				if (err) {
					socket.emit('sql_fail',  err.message);
				} else {
					socket.emit('sql_work',  rows);
				}
				connection.end();
			});
		});
	}
};





app.use(express.static(__dirname + '/public'));
/*
app.get('/', function (req, res) {
	var dest = 'index.html';
	res.sendFile(dest, { root: __dirname });
});
*/
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('JetBlue started at http://%s:%s', host, port);
});

var io = require('socket.io').listen(server);




var script = {
	'data' : [
		{
			'msg' : 'Hello, Welcome back Ryan D\'Souza',
			'userId' : 0,
			'delay' : 1000
		},
		{
			'userId' : -1,
			'choices' : ['No', 'Yes'],
			'delay' : 1000,
			'answer' : 1
		},
		{
			'msg' : 'whats up',
			'userId' : 1,
			'delay' : 1000
		},
		{
			'msg' : 'Jason Du has joined the room',
			'userId' : 0,
			'delay' : 1000
		},
		{
			'msg' : 'Meh1',
			'userId' : 2,
			'delay' : 1000
		},
		{
			'msg' : 'Meh2',
			'userId' : 0,
			'delay' : 1000
		},
		{
			'msg' : 'Eddie Wang has joined the room',
			'userId' : 0,
			'delay' : 1000
		}
	]
};

function sendScriptMessage(socket, index) {
	socket.emit('sendChat', script);
}


io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('getScript', function(data) {
		sendScriptMessage(socket, 0);
	});
	socket.on('get_packages', function() {
		CHAT_MODULE.get_packages_1(socket);
	});
	socket.on('disconnect', function() {
		console.log('a user left');
	});
});