var Video = function (domID, startTime, loopLength) {
    var dom = document.getElementById(domID),
        SEEK_AHEAD_TIME = 1, // give it enough time to finish seek
        playOffset = .08;  // time it takes to start play in seconds
        playTimeout = null,
        loopTimeout = null,
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

        // stop checking sync
        clearSyncCheck();

        // where are we supposed to be?
        var currentTime = getSecondsFromLoopStart();
        console.log("Seeked at "+ dom.currentTime +"s. Current Time is "+ currentTime +"s.");

        // Do we still have time to start play?
        if ((dom.currentTime > currentTime) && (dom.currentTime < currentTime + SEEK_AHEAD_TIME)) {
            // we're good.  Let's wait for the right time and play
            setPlayTimeout(Math.round((dom.currentTime - currentTime) * 1000) - (playOffset * 1000));
        } else {
            // seek was too slow (latency/bandwidth?)... seek again a few seconds ahead
            console.log("Seek ahead...");
            dom.addEventListener("seeked", syncVideo);
            dom.currentTime = currentTime + SEEK_AHEAD_TIME;
        }
    }

    function setPlayTimeout(time) {
        clearPlayTimeout();
        console.log("Set timeout to start play: "+ time);
        playTimeout = window.setTimeout(startPlay, time);
    }

    function clearPlayTimeout() {
        if (playTimeout) {
            window.clearTimeout(playTimeout);
            playTimeout = null;
        }
    }

    function startPlay() {
        clearPlayTimeout();

        dom.play();

        var currentTime = getSecondsFromLoopStart();
        console.log("Started play about "+ (Math.round((currentTime - dom.currentTime) * 1000) + (playOffset * 1000)) +" milliseconds off.");

        setLoopTimeout(currentTime);
        startSyncCheck();
    }



    function setLoopTimeout(currentTime) {
        // set a timeout for the end of the loop (because the video file is likely longer than the actual loop because of aac/mp3 audio padding)
        if (loopTimeout) {
            window.clearTimeout(loopTimeout);
            loopTimeout = null;
        }

        var loopTime = (loopLength - currentTime) * 1000;

        if (loopTime > 0) {
            // let's make sure we resync once we're past the end of the loop
            loopTimeout = window.setTimeout(loopTimeout, loopTime);
        }
    }

    function loopTimeout() {
        console.log("Past the loop - resyncing...");
        // this happens once a day to make sure we start again at the right time
        loopTimeout = null;
        syncVideo();
    }



    function startSyncCheck() {
        clearSyncCheck();
        syncCheckInterval = window.setInterval(syncCheck, 2000);
    }

    function clearSyncCheck() {
        if (syncCheckInterval) {
            window.clearInterval(syncCheckInterval);
            syncCheckInterval = null;
        }
    }

    // called every few seconds to see if we're in sync
    function syncCheck() {
        var offset = getSecondsFromLoopStart() - dom.currentTime;

        console.log("Sync check: "+ Math.round(offset * 1000));

        if ((Math.abs(offset) > ACCEPTABLE_OFFSET) && !playTimeout) {
            // adjust play offset
            playOffset += offset;
            // to be safe, let's control this...
            if (playOffset < 0) {
                playOffset = 0;
            } else if (playOffset > .2) {
                playOffset = .2;
            }

            console.log("Adjusted play offset to: "+ playOffset +" - Resyncing...");
            syncVideo();
        }
    }

    return {
        dom: dom,
        syncVideo: syncVideo
    }
}