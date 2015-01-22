var Clock = function (domID) {
    var dom = document.getElementById("time");

    function updateClock() {
        var date = new Date();
        dom.innerHTML = date.toLocaleTimeString();
		requestAnimFrame(updateClock);
    }

    // Start clock
	updateClock();
}