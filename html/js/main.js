var clockSpan,
	media,
	msSinceHour,
	status;

window.addEventListener("load", function onload(e) {
	media = document.getElementById("video");
	clockSpan = document.getElementById("time");
	status = document.getElementById("status");

	// Start clock
	updateClock();

	syncVideo();
});


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
	// seek to position we want
	video.currentTime = getMillisecondFromHour() / 1000;
	// check the buffer to see when we have enough to play
	intervalSyncVideo = setInterval(checkVideoSync, 100);
}

function isTimeBuffered(time) {
	var i, l = video.buffered.length;
	for (i=0;i<l;i++) {
		if ((time > video.buffered.start(i)) && (time <= video.buffered.end(i))) {
			return true;
		}
	}
	return false;
}

function checkVideoSync() {
	// How many ms from hour?
	var currentTime = getMillisecondFromHour() / 1000;
	video.currentTime = currentTime + 0.03; // seek takes about 30ms on my system

	// have we buffered far enough ahead to start playing?
	if (isTimeBuffered(currentTime + .5)) {
		// we're good to go!
		video.play();
		// stop checking
		clearInterval(intervalSyncVideo);
 		video.addEventListener("seeked", seekComplete);
	}
}

function seekComplete() {
	video.removeEventListener("seeked", seekComplete);
	console.log("Seeked: "+ video.currentTime);
	console.log("Time:   "+ (getMillisecondFromHour() / 1000));
}



window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();
