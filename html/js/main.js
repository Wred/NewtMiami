
var clockSpan;
var video;

onload = function () {

	// how long since start of the hour?
	var date = new Date();
	var dateHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
	var msSinceHour = date - dateHour;

	video = document.getElementById("video");

	video.currentTime = (msSinceHour) / 1000;
	video.play();

	clockSpan = document.getElementById("time");
	updateClock();

}


function updateClock() {

	var date = new Date();
	clockSpan.innerHTML = date.toLocaleTimeString();

	requestAnimFrame(updateClock);

}


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();


