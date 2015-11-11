var express = require('express');
var app = express();
var mysql = require('mysql');



function getQuery(sqlid, page) {
	if (sqlid == 0) {
		return "SELECT origin,destination,hotel_property,hotel_night_stay,hotel_check_in_date,hotel_check_out_date,expedia_price,jetblue_price,percent_saving,month,advance_start_week,advance_end_week,count,nightLife,romance,beach,family,exploration,type_id,direction_id \
						 FROM package \
						 WHERE origin='JFK' AND (destination='SFO' or destination='LAS' or destination='MBJ') and family=1 \
						 order by origin, RAND() \
						 LIMIT " + (20*page) + ",20";
	} else if (sqlid == 1) {
		return "SELECT origin,destination,hotel_property,hotel_night_stay,hotel_check_in_date,hotel_check_out_date,expedia_price,jetblue_price,percent_saving,month,advance_start_week,advance_end_week,count,nightLife,romance,beach,family,exploration,type_id,direction_id \
						 FROM package \
						 WHERE origin='JFK' AND (destination='SFO' or destination='LAS' or destination='MBJ') and family=1 and hotel_night_stay>=3 and hotel_night_stay<=7 and jetblue_price < 1000 \
						 order by origin, RAND() \
						 LIMIT " + (20*page) + ",20";
	} else if (sqlid == 2) {
		return "SELECT origin,destination,hotel_property,hotel_night_stay,hotel_check_in_date,hotel_check_out_date,expedia_price,jetblue_price,percent_saving,month,advance_start_week,advance_end_week,count,nightLife,romance,beach,family,exploration,type_id,direction_id \
						 FROM package \
						 WHERE origin='JFK' AND (destination='SFO' or destination='MBJ' or destination='CUN') and family=1 and hotel_night_stay>=3 and hotel_night_stay<=7 and jetblue_price < 1000 \
						 order by origin, RAND() \
						 LIMIT " + (20*page) + ",20";
	} else if (sqlid == 3) {
		return "SELECT origin,destination,hotel_property,hotel_night_stay,hotel_check_in_date,hotel_check_out_date,expedia_price,jetblue_price,percent_saving,month,advance_start_week,advance_end_week,count,nightLife,romance,beach,family,exploration,type_id,direction_id \
						 FROM package \
						 WHERE origin='JFK' AND (destination='SFO' or destination='MBJ' or destination='CUN') and family=1 and hotel_check_in_date = '2015-11-25' and hotel_check_out_date = '2015-12-02' and jetblue_price < 1000 \
						 order by origin, RAND() \
						 LIMIT " + (20*page) + ",20";
	}
}

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

	get_packages : function(socket, sqlid, page) {
		SQL_MODULE.runSQL(socket, function(connection) {
			
			var query = getQuery(sqlid, page);
			
			console.log(sqlid);
			console.log(query);
						 
			connection.query(query, function(err,rows,fields) {
				if (err) {
					socket.emit('sql_fail',  err.message);
				} else {
					socket.emit(page == 0 ? 'sql_work' : 'sql_work_next_page',  rows);
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
			'msg' : 'Welcome back Ryan! I see you\'re located in New York, is this where you want to depart from?',
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
			'msg' : 'Great! Do you have any preferences for your next travel destination?',
			'userId' : 0,
			'delay' : 1300
		},

		{
			'msg' : ' Yes, San Francisco, Las Vegas, or Jamaica',
			'userId' : 1,
			'delay' : 1000,
		},

		{
			'msg' : ' I also want to be somewhere that\'s  family oriented',
			'userId' : 1,
			'delay' : 500
		},

		{
			'msg' : 'Jason and Eddie have been added to the group',
			'userId' : 0,
			'delay' : 300
		},

		{ 
			'userId' : -2,
			'sqlid' : 0,
		},

		{
			'msg' : 'Got it, and how long do you plan to stay?',
			'userId' : 0,
			'delay' : 1300
		},
	

		{
			'msg' : 'I\'m thinking about 3-7 days, sometime in November',
			'userId' : 1,
			'delay' : 1000
		},

		{
			'msg' : 'Do you have a budget?',
			'userId' : 0,
			'delay' : 1000
		},

		{
			'msg' : 'Preferably under $1,000',
			'userId' : 1,
			'delay' : 2000
		},

		{ 
			'userId' : -2,
			'sqlid' : 1
		},

		{
			'msg' : 'Okay, please wait while I collect the answers from everyone in this group',
			'userId' : 0,
			'delay' : 3500
		},

		{
			'msg' : 'Jason and Eddie have both agreed on San Francisco or Jamaica and also suggested Cancun',
			'userId' : 0,
			'delay' : 1000
		},

		{ 
			'userId' : -2,
			'sqlid' : 2
		},

		{
			'msg' : 'I am fine with Cancun as well',
			'userId' : 1,
			'delay' : 500
		},

		{
			'msg' : 'Based on the responses, the best times to travel for this group are:',
			'userId' : 0,
			'delay' : 300
		},


		{
			'userId' : -1,
			'choices' : ['Nov 14 - Nov 21', 'Nov 16 - Nov 20', 'Nov 20 - Nov 27', 'Nov 25 - Dec 2'],
			'delay' : 3000,
			'answer' : 3
		},

		{
			'msg' : 'Narrowing down the results based on everyone\'s choices',
			'userId' : 0,
			'delay' : 1000
		},

		{ 
			'userId' : -2,
			'sqlid' : 3
		},

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
	socket.on('get_packages', function(data) {
		CHAT_MODULE.get_packages(socket, data.sqlid, data.page);
	});
	socket.on('disconnect', function() {
		console.log('a user left');
	});
});