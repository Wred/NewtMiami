var clockSpan, media, msSinceHour;

onload = function () {
	media = document.getElementById("video");
	clockSpan = document.getElementById("time");

	// Start clock
	updateClock();

	//media.addEventListener("progress", monitorLoad);

	monitorLoad();

	syncVideo();
}


function updateClock() {
	var date = new Date();
	clockSpan.innerHTML = date.toLocaleTimeString();

	requestAnimFrame(updateClock);
}

function monitorLoad(e) {
	console.log(e);
	//syncVideo();
}

function syncVideo() {
        // how long since start of the hour?
        var date = new Date();
        var dateHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
        msSinceHour = date - dateHour;

        video.currentTime = msSinceHour / 1000;
	video.addEventListener("seeked", seekComplete);
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

