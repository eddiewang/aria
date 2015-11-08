var express = require('express');
var request = require('request');
var router = express.Router();

router.post('/create', function(req, res, next){
	var userId = req.body;
	var users = App.db.collection('users');
	var documentObject = {
		"user": userId.id,
		"name": userId.name,
		"location": userId.location,
		"friends": userId.friends,
		"packages": []
	};
	users.insert(documentObject);
	res.json(documentObject);
});

var citiesAPI = {
	jfk:"new york",
	msy:"new orleans",
	bgi:"bridgetown",
	sdq:"santo domingo",
	cun:"cancun",
	pop:"puerto playa",
	lax:"los angeles",
	sxs:"st. martin",
	las:"las vegas",
	mco:"orlando",
	chs:"charleston",
	tpa:"tampa",
	puj:"punta cana",
	aua:"aruba",
	rsw:"fort myers",
	san:"san diego",
	uvf:"saint lucia",
	sfo:"san francisco",
	nas:"nassau",
	cur:"curacao",
	fll:"fort lauderdale",
	pls:"turks and caicos",
	mbj:"jamaica",
	lir:"costa rica",
	sju:"san juan",
	pbi:"west palm beach",
	azs:"samana",
	bda:"bermuda",
	lrm:"la romana",
	gcm:"georgetown",
	gnd:"grenada",
    "new york": "jfk", 
    "new orleans": "msy", 
    "bridgetown": "bgi", 
    "santo domingo": "sdq", 
    "cancun": "cun",
    "aruba": "aua",
    "bermuda": "bda",
    "bridgetown": "bgi",
    "cancun": "cun",
    "charleston": "chs",
    "costa rica": "lir",
    "curacao": "cur",
    "fort lauderdale": "fll",
    "fort myers": "rsw",
    "georgetown": "gcm",
    "grenada": "gnd",
    "jamaica": "mbj",
    "la romana": "lrm",
    "las vegas": "las",
    "los angeles": "lax",
    "nassau": "nas",
    "new orleans": "msy",
    "orlando": "mco",
    "puerto playa": "pop",
    "punta cana": "puj",
    "saint lucia": "uvf",
    "samana": "azs",
    "san diego": "san",
    "san francisco": "sfo",
    "san juan": "sju",
    "santo domingo": "sdq",
    "st.martin": "sxs",
    "tampa": "tpa",
    "turks and caicos": "pls",
    "west palm beach": "pbi"
}
var SETTINGS = {
	indexes : [0, 3], //MANDATORY
	afterDate : {
		$gte : (new Date(Date.parse("2000-11-29T00:00:00.000Z"))).toISOString() //OPTIONAL
	},
	beforeDate : {
		$lte : (new Date(Date.parse("2099-11-29T00:00:00.000Z"))).toISOString() //OPTIONAL
	},
	nightLife : null, //OPTIONAL
	romance : null, //OPTIONAL
	beach : null, //OPTIONAL
	family : null, //OPTIONAL
	exploration : null //OPTIONAL
};


function machineLearning(query_params, success, fail) {
	//pass an object with query data. Must have indexes as a key.
	//
	/*
	SAMPLE OBJECT
	filters = {
		indexes: [20, 40] //MANDATORY
		afterDate: 2015-01-01T00:00:00.000Z //OPTIONAL
		beforeDate: 2015-04-01T00:00:00.000Z //OPTIONAL
		nightLife: true || false //OPTIONAL
		romance: true || false //OPTIONAL
		beach: true || false //OPTIONAL
		family: true || false //OPTIONAL
		exploration: true || false //OPTIONAL
	}
	 */
	 
	 /*
	if (!query_params){
		fail({success: false, message: 'Please pass search indexes'});
		return;
	}
	if (!query_params.indexes){
		fail({success: false, message: 'Please pass search indexes'});
		return;
	}
	if (!query_params.message){
		fail({success: false, message: 'Please send valid message'});
		return;
	} 

	*/
	console.log(query_params);

	console.log('got an answer', query_params);

	// var listRomance = ["affair", "amour", "facscination", "enchantment", "fling", "flirtation", "love","passionate","romantic"];
	// var listNightLife = ["night life", "club"];
	// var beach = ["fun", "ocean", "relaxing", "beach"];
	// var exploration = ["adventure", "exploration", "explore"];
	// var family = ["family", "kids",   d"children"];
	var relatedWords = [];
	var apiCount = 0;
	query_params.message = query_params.message.toLowerCase();
	query_params.message.replace(',',' ');

	console.log('message',query_params.message)
		if(citiesAPI[query_params.message] && query_params.question == 1){
			query_params.destination = citiesAPI[query_params.message].toUpperCase();
		} else if(citiesAPI[query_params.message] && query_params.question == 2){
			query_params.origin = citiesAPI[query_params.message];
		}
	inputs = query_params.message.split(' ');
	var queryArray = query_params.message.indexOf(' ') != -1 ? query_params.message.split(' ') : [query_params.message];

	console.log(queryArray);


	for(var i = 0; i < queryArray.length; i++){
		


		request('http://words.bighugelabs.com/api/2/75d7a7bb4cd682bbaabb453abaeb97da/'+queryArray[i]+'/json', function (error, response, body) {
		  
			console.log(error);
				console.log(response.statusCode);
				console.log(body);
		  if (!error && response.statusCode == 200) {

			console.log("2222");

		    // build 1D array from JSON object
		    var obj = JSON.parse(response.body);

			console.log(response.body);

		    for(var key in obj){
		    	var obj2= obj[key];
		    	for(var key2 in obj2){
		    		if(key2 == "ant"){
		    			continue;
		    		}
		    		for(var i = 0; i < obj2[key2].length; i++){
		    			relatedWords.push(obj2[key2][i].toLowerCase());
		    		}
		    	}
		    }
		    apiCount++;
		    if(apiCount == queryArray.length){

		    	//console.log(relatedWords);
		    	console.log('query_params', query_params);
		    	runQuery(relatedWords, query_params, successQuery, failQuery);
		    	function successQuery(data){
		    		success(data);
		    	}
		    	function failQuery(data){
		    		console.log('failed to query', fail);
		    		fail(data);
		    	}
		    }
		    //console.log(relatedWords);
		  } else{
		  	apiCount++;
		    if(apiCount == queryArray.length){
		    	runQuery(relatedWords, query_params, successQuery, failQuery);
		    	function successQuery(data){
		    		console.log('successfully queryed', data);
		    		success(data);
		    	}
		    	function failQuery(data){
		    		console.log('failed to query', fail);
		    		fail(data);
		    	}
		    }
	  		console.log('something went wrong');
	  	  }
		})
	}
}
function runQuery(relatedWords, query_params, success, fail){
	console.log('query params in runquery',query_params);
	var foundKeywords = [];
	var dataList = ['romance', 'night life','beach', 'exploration','family'];
    //match arrays from database to machine learning apis
    if(relatedWords.indexOf(dataList[0]) > -1){
    	foundKeywords.push(dataList[0]);
    	SETTINGS.romance = true;
    }
    if(relatedWords.indexOf(dataList[1]) > -1){
    	foundKeywords.push(dataList[1]);
    	SETTINGS.nightlife = true;
    }
    if(relatedWords.indexOf(dataList[2]) > -1){
    	foundKeywords.push(dataList[2]);
    	SETTINGS.beach = true;
    }
    if(relatedWords.indexOf(dataList[3]) > -1){
    	foundKeywords.push(dataList[3]);
    	SETTINGS.exploration = true;
    }
    if(relatedWords.indexOf(dataList[4]) > -1){
    	foundKeywords.push(dataList[4]);
    	SETTINGS.family = true;
    }

    console.log(foundKeywords);
	// query_params.message = query_params.message.toLowerCase();
	
	// if (!SETTINGS.romance) {
	// 	for(var i = 0; i < listRomance.length; i++){
	// 		if(query_params.message.indexOf(listRomance[i]) > -1){
	// 			SETTINGS.romance = true;
	// 			foundKeywords.push(listRomance[i]);
	// 			break;
	// 		}
	// 	}
	// }
	// if (!SETTINGS.nightLife) {
	// 	for(var i = 0; i < listNightLife.length; i++){
	// 		if(query_params.message.indexOf(listNightLife[i]) > -1){
	// 			SETTINGS.nightLife = true;
	// 			foundKeywords.push(listNightLife[i]);
	// 			break;
	// 		}
	// 	}
	// }
	// if (!SETTINGS.beach) {
	// 	for(var i = 0; i < beach.length; i++){
	// 		if(query_params.message.indexOf(beach[i]) > -1){
	// 			SETTINGS.beach = true;
	// 			foundKeywords.push(beach[i]);
	// 			break;
	// 		}
	// 	}
	// }
	// if (!SETTINGS.exploration) {
	// 	for(var i = 0; i < exploration.length; i++){
	// 		if(query_params.message.indexOf(exploration[i]) > -1){
	// 			SETTINGS.exploration = true;
	// 			foundKeywords.push(exploration[i]);
	// 			break;
	// 		}
	// 	}
	// }
	// if (!SETTINGS.family) {
	// 	for(var i = 0; i < family.length; i++){
	// 		if(query_params.message.indexOf(family[i]) > -1){
	// 			SETTINGS.family = true;
	// 			foundKeywords.push(family[i]);
	// 			break;
	// 		}
	// 	}
	// }
	// if (!SETTINGS.family && !query_params.exploration && !query_params.beach && !query_params.nightLife && !query_params.romance){
	// 	SETTINGS.family = true;
	// 	foundKeywords.push("family");
	// }
	
	// //get the correct dates intervals
	if(query_params.afterDate){
		var date = new Date(Date.parse(query_params.afterDate));
	    SETTINGS.afterDate = {
	        $gte: date.toISOString()
	    };
		foundKeywords.push(date);
	}
	if(query_params.beforeDate){
		var date = new Date(Date.parse(query_params.beforeDate));
		SETTINGS.beforeDate = {
		    $lte: date.toISOString()
		};
		foundKeywords.push(date);
	}
	
	
	// if("message" in query_params){
	// 	delete query_params["message"];
	// }
	// if("indexes" in query_params){
	// 	delete query_params["indexes"];
	// }
	// if("afterDate" in query_params){
	// 	delete query_params["afterDate"];
	// }
	// if("beforeDate" in query_params){
	// 	delete query_params["beforeDate"];
	// }
	
	delete query_params["question"];
	delete query_params["message"];
	var query_indexes = query_params.indexes;
	delete query_params.indexes;
	
		query_params.hotel_check_in_date = SETTINGS.afterDate
		query_params.hotel_check_out_date = SETTINGS.beforeDate
	
	if (SETTINGS.nightLife != null) { query_params.nightLife = SETTINGS.nightLife; }
	if (SETTINGS.romance != null) { query_params.romance = SETTINGS.romance; }
	if (SETTINGS.beach != null) { query_params.beach = SETTINGS.beach; }
	if (SETTINGS.family != null) { query_params.family = SETTINGS.family; }
	if (SETTINGS.exploration != null) { query_params.exploration = SETTINGS.exploration; }
	
	var data = App.db.collection('packages');
	

	console.log(query_params);

	console.log(query_params);
	data.find(query_params).skip(query_indexes[0]).limit(query_indexes[1]-query_indexes[0]).toArray(function(err, docs) {
		if (err) {
			fail({
		        success: false,
		        message: err
		    });
		}
		else {
			//city information
			//console.log(docs);
			for(var i = 0; i < docs.length; i++){
				docs[i].destinationCity = citiesAPI[(docs[i].destination).toLowerCase()];
				docs[i].originCity = citiesAPI[(docs[i].origin).toLowerCase()];
			}
			//console.log(docs[0]);
			success({
		        success: true,
		        result: docs,
		        length: docs.length,
				keywords : foundKeywords
		    });
		}
	});
};
function editDistance(a, b){
	if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}
module.exports = machineLearning;
