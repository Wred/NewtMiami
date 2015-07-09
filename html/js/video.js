var Video = function (domID, startTime) {
    var dom = document.getElementById(domID),
        SEEK_TIME = 0.07, // seek takes about 70ms on my system
        ACCEPTABLE_THRESHOLD = .05; // can be off plus or minus this value before we play

    if (isNaN(dom.duration)) {
        // we haven't received the metadata yet
        dom.addEventListener('loadedmetadata', function () {
            console.log("Got metadata.  Duration: "+ dom.duration +" seconds.");
            // we have duration... we can start seek/play
            syncVideo();
        });
    } else {
        syncVideo();
    }

    function getSecondsFromStart() {
        var time = startTime.split(":");
        // how long since start of the hour?
        var date = new Date();
        var timeNow = date.getTime();
        var timeStart = (new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(time[0], 10), parseInt(time[1], 10))).getTime();
        if (timeNow < timeStart) {
            // we're before the start time - add a day
            timeNow += (24 * 60 * 60 * 1000);
        }
        return (timeNow - timeStart) / 1000;
    }

    function getSecondsFromLoopStart() {
        return getSecondsFromStart() % dom.duration;
    }

    function syncVideo() {
        dom.removeEventListener("seeked", syncVideo);
        var currentTime = getSecondsFromLoopStart();
        console.log("Seek completed at "+ dom.currentTime +"s. Current Time is "+ currentTime +"s.");

        // are we within an acceptable range?
        if ((dom.currentTime >= currentTime - ACCEPTABLE_THRESHOLD) && (dom.currentTime < currentTime + ACCEPTABLE_THRESHOLD)) {
            console.log("We're good to go.  Start play at "+ dom.currentTime +"s. We're about "+ Math.round((currentTime - dom.currentTime) * 1000) +" milliseconds off.");
            dom.play();
            // let's make sure we resync at the daily start time if this plays through
            window.setTimeout((24 * 60 * 60) - getSecondsFromStart(), syncVideo);
        } else {
            console.log("Not close enough - seek again.");
            dom.currentTime = currentTime + SEEK_TIME;
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