var Video = function (domID, startTime) {
    var dom = document.getElementById(domID),
        SEEK_AHEAD_TIME = .8, // give it enough time to finish seek
        playTimeout = null,
        firstPlay = true;

    dom.addEventListener('click', syncVideo);

    dom.addEventListener('play', function () {
        // only sync first time we play
        if (firstPlay) {
            firstPlay = false;
            syncVideo();
        }
    });

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
        // let's pause first.
        dom.pause();

        var currentTime = getSecondsFromLoopStart();

        console.log("Seeked at "+ dom.currentTime +"s. Current Time is "+ currentTime +"s.");

        // Do we still have time to start play?
        if ((dom.currentTime > currentTime) && (dom.currentTime < currentTime + SEEK_AHEAD_TIME)) {
            var offset = Math.round((dom.currentTime - currentTime) * 1000);
            console.log("Set timeout to start play: "+ offset);
            playTimeout = window.setTimeout(startPlay, offset);
        } else {
            console.log("Seek ahead...");
            dom.addEventListener("seeked", syncVideo);
            dom.currentTime = currentTime + SEEK_AHEAD_TIME;
        }
    }

    function startPlay() {
        dom.play();

        var currentTime = getSecondsFromLoopStart();
        console.log("Started play about "+ Math.round((currentTime - dom.currentTime) * 1000) +" milliseconds off.");

        // let's make sure we resync at the daily start time if this plays through
        window.setTimeout(syncVideo, ((24 * 60 * 60) - currentTime) * 1000);
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