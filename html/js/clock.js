var Clock = function (domID) {
    var dom = document.getElementById("time");

    function pad2(num) {
    	var str = num.toString();
    	while (str.length < 2) {
    		str = "0"+ str;
    	}
    	return str;
    }

    function updateClock() {
        var date = new Date();
//         dom.innerHTML = date.toLocaleTimeString();
        dom.innerHTML = "00:"+ pad2(date.getMinutes()) +":"+ pad2(date.getSeconds()) +":"+ pad2(Math.floor((date.getMilliseconds() / 1000) * 30));
		requestAnimFrame(updateClock);
    }

    // Start clock
	updateClock();
}