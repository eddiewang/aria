var $siri_classic = document.getElementById('container-classic');
var siri_obj = $($siri_classic);

var am = 1;

var SW = new SiriWave({
	width: 259,
	height: 100,
	speed: 0.12,
	amplitude: am,
	container: $siri_classic,
	autostart: true,
});

var turnOn = function() {
	siri_obj.css('visibility', 'visible');
};

var turnOff = function() {
	siri_obj.css('visibility', 'hidden');
};

siri_obj.css('visibility', 'hidden');

$(document).ready(function() {

	var obj = $('.deals');
	obj.scroll(function() {

	   if(obj.scrollTop() + obj.innerHeight() == obj[0].scrollHeight) {
		   getNextPage();
	   }
	});
});
