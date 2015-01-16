var clockSpan, media, msSinceHour;

onload = function () {
	media = document.getElementById("video");
	clockSpan = document.getElementById("time");

	// Start clock
	updateClock();

	syncVideo();
}


function getMillisecondFromHour() {
        // how long since start of the hour?
        var date = new Date();
        var dateHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
        return date - dateHour;
}

function updateClock() {
	var date = new Date();
	clockSpan.innerHTML = date.toLocaleTimeString();

	requestAnimFrame(updateClock);
}


function syncVideo() {
	intervalSyncVideo = setInterval(checkVideoSync, 100);

        video.currentTime = getMillisecondFromHour() / 1000;
	video.addEventListener("seeked", seekComplete);
}

function checkVideoSync() {
	if (media.buffered.end) {
		
	}
}

function seekComplete() {
	console.log("Seeked: "+ video.currentTime);
	console.log("Time:   "+ msSinceHour);
	video.removeEventListener("seeked", seekComplete);
	video.play();
}


window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();

