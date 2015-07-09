var Video = function (domID, startTime) {
    var dom = document.getElementById(domID);

    var SEEK_TIME = 0.07; // seek takes about 70ms on my system

    dom.addEventListener('loadedmetadata', function () {
        // we have duration... we can start seek/play
        syncVideo();
    });

    function getSecondsFromLoopStart() {
        var time = startTime.split(":");
        // how long since start of the hour?
        var date = new Date();
        var timeNow = date.getTime();
        var timeStart = (new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(time[0], 10), parseInt(time[1], 10))).getTime();
        if (timeNow < timeStart) {
            // we're before the start time - add a day
            timeNow += (24 * 60 * 60 * 1000);
        }
        var secondsFromStart = (timeNow - timeStart) / 1000;
        return secondsFromStart % dom.duration;
    }

    function syncVideo() {
        dom.removeEventListener("seeked", syncVideo);

        var currentTime = getSecondsFromLoopStart();

        console.log("Seeked: "+ dom.currentTime);
        console.log("Time:   "+ currentTime);

        // are we within an acceptable range?
        if ((dom.currentTime > currentTime) && (dom.currentTime < currentTime + .5)) {
            // we're good to go!
            dom.play();
        } else {
            // let's seek ahead again
            dom.currentTime = currentTime + SEEK_TIME;
            // wait for seek
            dom.addEventListener("seeked", syncVideo);
        }
    }

    function isTimeBuffered(time) {
        var i, l = dom.buffered.length;
        for (i=0;i<l;i++) {
            if ((time > dom.buffered.start(i)) && (time <= dom.buffered.end(i))) {
                return true;
            }
        }
        return false;
    }

}