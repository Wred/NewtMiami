var Video = function (domID, startTime) {
    var dom = document.getElementById(domID),
        SEEK_TIME = 0.07, // seek takes about 70ms on my system
        ACCEPTABLE_THRESHOLD = 1; // can be up to 1 second off before we play

    if (isNaN(dom.duration)) {
        // we haven't received the metadata yet
        dom.addEventListener('loadedmetadata', function () {
            console.log("Got metadata.  Duration: "+ dom.duration);
            // we have duration... we can start seek/play
            syncVideo();
        });
    } else {
        syncVideo();
    }

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
        console.log("Seek completed: "+ dom.currentTime +" Current Time: "+ currentTime);

        // are we within an acceptable range?
        if ((dom.currentTime >= currentTime) && (dom.currentTime < currentTime + ACCEPTABLE_THRESHOLD)) {
            console.log("We're good to go.  Start play at: "+ dom.currentTime);
            dom.play();
        } else {
            console.log("Not close enough.  Let's seek again.");
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