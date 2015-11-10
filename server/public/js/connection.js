$(document).ready(function() {
	
	setUpSockets();

});

var lowerBound = 0, upperBound = 500;
var chatID = 0;
var chatQueue;
var counterChat = 0;

function handleQueue() {

	if (counterChat < chatQueue.length) {
		var data = chatQueue[counterChat];
		
		setTimeout(function() {
			if (data.userId == -1) {
				showChoices(data);
			} else if (data.userId == 0) {
				showAIRow({
					'msg' : data.msg
				});
			} else {
				showUserRow({
					'msg' : data.msg
				});
			}
		}, data.delay);
		
		counterChat += 1;
	}
}

function setUpSockets() {
	var socket = io();


	socket.on('connect_error', function(err) {
		console.log("socket failed");
	});

	socket.on('connect', function() {

		$('div#facebooklogin').on('click', function(){
			var myWindow = window.open("fbpopup.html", "Facebook", "width=400, height=200, location=0, menubar=0, status=0, titlebar=0, toolbar=0");
			setTimeout(function() {
				myWindow.close();
				$("#login > div").eq(0).fadeOut("slow", function() {
					$("#login > div").eq(1).fadeIn("slow");
				});
			}, 500);
		});

		socket.on('sendChat', function(data){
			chatQueue = data.data;
			handleQueue();
		});
		
		socket.on('sql_fail', function(data) {
			alert(data);
		});
		
		socket.on('sql_work', function(data) {
			updatePackages(data);
		});
	});
	
	$(".friend_icon").click(function() {
		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected");
		} else {
			$(this).addClass("selected");
		}
	});
	$("#enter_chat").click(function() {
		$("#login").eq(0).fadeOut("slow");
		socket.emit('getScript', 1);
		socket.emit('get_packages', 1);
	});
}



function updatePackages(data) {
	var max_limit = 1000;
	
	for(var i=0; i<data.length; i+=1) {
		
		var d1 = new Date(Date.parse(data[i].hotel_check_in_date));
		var d2 = new Date(Date.parse(data[i].hotel_check_out_date));

		var pep = (Math.floor((Math.random() * max_limit) + 1));
		
		var strVar="";
		
		strVar += "        <section class=\"modal--fade\" id=\"modal-fade-" + i + "\" data-stackable=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"label-fade\" aria-hidden=\"true\">";
		strVar += "            <div class=\"modal-inner card-detail\">";
		strVar += "                <div class=\"detail-banner\">";
		strVar += "                    <img src=\"images\/header-detail.jpg\"><\/img>";
		strVar += "                    <div class=\"cities\">";
		strVar += "                        <div class=\"departure\">";
		strVar += "                            <h2 class=\"destination-code\">"+data[i].origin+"<\/h2>";
		//strVar += "                            <h2 class=\"destination-title\">San Francisco<\/h2>";
		strVar += "                        <\/div>";
		strVar += "                        <img class=\"detail-plane-icon\" src=\"images\/plane.png\"><\/img>";
		strVar += "                        <div class=\"destination\">";
		strVar += "                            <h2 class=\"destination-code\">"+data[i].destination+"<\/h2>";
		//strVar += "                            <h2 class=\"destination-title\">New York<\/h2>";
		strVar += "                        <\/div>";
		strVar += "                    <\/div>";
		strVar += "                    <div class=\"hotel\">";
		strVar += "                        <span class=\"name\">"+data[i].hotel_property+"<\/span>";
		strVar += "                        <div class=\"date\">" + formatDate(d1) + " - " + formatDate(d2) + "<\/div>";
		strVar += "                    <\/div>";
		strVar += "                    <div class=\"price\">$"+data[i].jetblue_price+"<\/div>";

		strVar += "                    <div class=\"savings\">"+data[i].percent_saving+"% savings<\/div>";
		strVar += "                    <div class=\"tags\">";
		
		if (data[i].nightLife=="1") strVar += "                <span class=\"tag-entry\">Nightlife<\/span>";
		if (data[i].romance=="1") strVar += "                <span class=\"tag-entry\">Romance<\/span>";
		if (data[i].beach=="1") strVar += "                <span class=\"tag-entry\">Beach<\/span><\/span>";
		if (data[i].family=="1") strVar += "                <span class=\"tag-entry\">Family<\/span><\/span>";
		if (data[i].exploration=="1") strVar += "                <span class=\"tag-entry\">Exploration<\/span>";
		
		
		strVar += "                    <\/div>";
		strVar += "                <\/div>";
		strVar += "                <div class=\"modal-content\">";
		strVar += "                    <div class=\"container\">";
		strVar += "                        <div class=\"row\">";
		strVar += "                            <div class=\"two-thirds column\">";
		strVar += "                                <span class=\"modalHeader\"><strong>Google Flights<\/strong><\/span>";
		strVar += "                              <br>";
		strVar += "                              <span class=\"modalDesc\"><a target='_blank' href='https://www.google.ca/flights/?hl=en&authuser=0#search;f=" + data[i].origin + ";t=" + data[i].destination + ";d=" + formatDate2(d1) + ";r=" + formatDate2(d2) + "'>Click to View<\/a><\/span>";
		strVar += "                            <\/div>";
		strVar += "                            <div class=\"one-third column\">";
		strVar += "                                <a class=\"button u-full-width\" href=\"https://book.jetblue.com/shop/search/#\" target='_blank'>Join Flight<\/a>";
		//strVar += "                                <span id=\"ticketsLeft\">23<\/span>";
		//strVar += "                                <span id=\"ticketsRight\">tickets left<\/span>";
		strVar += "                                ";
		strVar += "                            <\/div>";
		strVar += "                        <\/div>";
		strVar += "                    <\/div>";
		strVar += "                <\/div>";
		strVar += "            <\/div>";
		strVar += "            <a href=\"#!\" class=\"modal-close\" title=\"Close this modal\" data-dismiss=\"modal\" data-close=\"Close\"><\/a>";
		strVar += "        <\/section>";
		strVar += "        <a href=\"#modal-fade-"+i+"\">";
		strVar += "            <div class=\"card\">";
		strVar += "                <div class=\"head\">";
		strVar += "                    <div class=\"destination\">"+data[i].origin+"<span>-<\/span>"+data[i].destination+"<\/div>";
		strVar += "                    <div class=\"hotel-property\">"+data[i].hotel_property+"<\/div>";
		strVar += "                    <div class=\"date-initial\">" + formatDate(d1) + "<\/div>";
		strVar += "                    <span class=\"date-connector\">-<\/span>";
		strVar += "                    <div class=\"date-end\">" + formatDate(d2) + "<\/div>";
		strVar += "                    <div class=\"price\">$" + Math.ceil(data[i].jetblue_price) + "<\/div>";

		strVar += "                <\/div>";
		strVar += "                <div class=\"progress\">";
		strVar += "                    <progress value=\"" + (Math.floor((pep/max_limit) * 100)) + "\" max=\"100\"><\/progress>";
		strVar += "                <\/div>";
		strVar += "                <div class=\"join\"><\/div>";
		strVar += "                <button class=\"join\">Join flight<\/button>";
		strVar += "                <span class=\"joined\">" + pep + " people are down<\/span>";
		strVar += "                <div class=\"tag-set\">";
		if (data[i].nightLife=="1") strVar += "                <span class=\"tag\">Nightlife<\/span>";
		if (data[i].romance=="1") strVar += "                <span class=\"tag\">Romance<\/span>";
		if (data[i].beach=="1") strVar += "                <span class=\"tag\">Beach<\/span><\/span>";
		if (data[i].family=="1") strVar += "                <span class=\"tag\">Family<\/span><\/span>";
		if (data[i].exploration=="1") strVar += "                <span class=\"tag\">Exploration<\/span>";
		strVar += "                <\/div>";
		strVar += "            <\/div>";
		strVar += "        <\/a>";


			
		$("div.deals").append(strVar);
	}
}


function formatDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

// 2015-11-26
function formatDate2(date) {
	var m = (date.getMonth()+1);
	var d = date.getDate();
	
	m = (m < 10) ? "0"+m : m;
	d = (d < 10) ? "0"+d : d;
	
	return date.getFullYear() + "-" + m + "-" + d;
}


function showChoices(data) {
	var str = '';
	
	var form = $("<form>");
	for(var i=0; i<data.choices.length; i+=1) {
		str+='<input type="radio" value="' + data.choices[i] + '">' + data.choices[i] + '<br>';
	}
	
	form.append(str);
	
	$("#message_field").append(form);
	
	setTimeout(function() {
		form.find("input").eq(data.answer).prop('checked',true);
		setTimeout(function() {
			form.remove();
			handleQueue();
		}, 1000);
	}, 1300);
}

function showAIRow(data) {
	
    var str = '<div class="row">';
    str += '<div class="text bot">';
    str += '<img src="images/bot-icon.png" class="icon botIcon"></img>';
    str += '<div class="comment" id="chat_id_' + chatID + '"></div>';
    str += '</div>';
    str += '</div>';
	
	$("#message_field").append(str);
	
	turnOn();
	
	$("#chat_id_" + chatID).typed({
        strings: [data.msg],
        typeSpeed: 50,
        onStringTyped: function() {

			$('.typed-cursor').hide();
        	
			turnOff();
			
			handleQueue();
        }
    });
	
	chatID += 1;
	
	var body = $("#message_field");
	body.animate({scrollTop:body[0].scrollHeight}, 500);
}



function showUserRow(data) {

	var obj = $("#chat_id_" + chatID)[0];
	var dest = $("#message_input")[0];

	userType(obj, 0, data.msg, dest, function() {
		pressEnter();
		
		handleQueue();
		
		var body = $("#message_field");
		body.animate({scrollTop:body[0].scrollHeight}, 500);
	});
	
	chatID += 1;
}

function userType(obj, i, str, dest, callback) {
	if (i < str.length) {
		dest.value += str.charAt(i);
		setTimeout(function() {
			userType(obj, i+1, str, dest, callback);
		}, 50 + Math.random() * 50);
	} else {
		callback();
	}
}

function pressEnter() {
	var val = $("#message_input").val();
	$("#message_input").val("");

    var str = '<div class="row">';
    str += '<div class="text user">';
    str += '<div class="comment">' + val + '</div>';
    str += '</div>';
	str += '</div>';

	$("#message_field").append(str);
}