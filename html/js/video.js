var Video = function (domID, startTime, loopLength) {
    var dom = document.getElementById(domID),
        SEEK_AHEAD_TIME = 1, // give it enough time to finish seek
        playOffset = .08;  // time it takes to start play in seconds
        playTimeout = null,
        startTimeTimeout = null,
        isFirstPlay = true,
        syncCheckInterval = null,
        ACCEPTABLE_OFFSET = .05; // in seconds


    dom.addEventListener('click', syncVideo);

    // call first play (and make sure we call it if we're already playing)
    dom.paused ? dom.addEventListener('play', firstPlay) : firstPlay();

    function firstPlay() {
        if (isFirstPlay) {
            isFirstPlay = false;
            syncVideo();
        }
    }

    syncCheckInterval = setInterval(syncCheck, 2000);

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
        return getSecondsFromStart() % loopLength;
        // return getSecondsFromStart() % dom.duration;
    }

    function syncVideo() {        
        dom.removeEventListener("seeked", syncVideo);

        // let's pause first.
        dom.pause();

        // where are we supposed to be?
        var currentTime = getSecondsFromLoopStart();
        console.log("Seeked at "+ dom.currentTime +"s. Current Time is "+ currentTime +"s.");

        // Do we still have time to start play?
        if ((dom.currentTime > currentTime) && (dom.currentTime < currentTime + SEEK_AHEAD_TIME)) {
            var offset = Math.round((dom.currentTime - currentTime) * 1000) - (playOffset * 1000);
            if (playTimeout) {
                window.clearTimeout(playTimeout);
            }
            console.log("Set timeout to start play: "+ offset);
            playTimeout = window.setTimeout(startPlay, offset);
        } else {
            console.log("Seek ahead...");
            dom.addEventListener("seeked", syncVideo);
            dom.currentTime = currentTime + SEEK_AHEAD_TIME;
        }
    }

    function startPlay() {
        if (playTimeout) {
            window.clearTimeout(playTimeout);
            playTimeout = null;
        }

        dom.play();

        var currentTime = getSecondsFromLoopStart();
        console.log("Started play about "+ (Math.round((currentTime - dom.currentTime) * 1000) + (playOffset * 1000)) +" milliseconds off.");

        if (!startTimeTimeout) {
            var loopTime = (loopLength - currentTime) * 1000;
            if (loopTime > 0) {
                // let's make sure we resync once we're past the end of the loop
                startTimeTimeout = window.setTimeout(restartTimeout, loopTime);
            }
        }
    }

    function restartTimeout() {
        console.log("Past the loop - resyncing...");
        // this happens once a day to make sure we start again at the right time
        startTimeTimeout = null;
        syncVideo();
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

    function syncCheck() {
        var offset = getSecondsFromLoopStart() - dom.currentTime;

        console.log("Sync check: "+ Math.round(offset * 1000));

        if ((Math.abs(offset) > ACCEPTABLE_OFFSET) && !playTimeout) {
            console.log("Resyncing...");
            syncVideo();
        }
    }

    return {
        dom: dom,
        syncVideo: syncVideo
    }
}