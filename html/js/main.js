var clockSpan;
var video;

onload = function () {
	video = document.getElementById("video");
	clockSpan = document.getElementById("time");

	// Start clock
	updateClock();

	syncVideo();
}


function updateClock() {
	var date = new Date();
	clockSpan.innerHTML = date.toLocaleTimeString();

	requestAnimFrame(updateClock);
}

function syncVideo() {
        // how long since start of the hour?
        var date = new Date();
        var dateHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
        var msSinceHour = date - dateHour;

        video.currentTime = (msSinceHour + 100) / 1000;
        video.play();
}


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();


