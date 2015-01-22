var Video = function (domID) {
    var dom;

   	dom = document.getElementById("video");

    function getMillisecondFromHour() {
        // how long since start of the hour?
        var date = new Date();
        var dateHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
        return date - dateHour;
    }

    function syncVideo() {
        // seek to position we want
        dom.currentTime = getMillisecondFromHour() / 1000;
        // check the buffer to see when we have enough to play
        intervalSyncVideo = setInterval(checkVideoSync, 100);
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

    function checkVideoSync() {
        // How many ms from hour?
        var currentTime = getMillisecondFromHour() / 1000;
        dom.currentTime = currentTime + 0.07; // seek takes about 70ms on my system

        // have we buffered far enough ahead to start playing?
        if (isTimeBuffered(currentTime + .5)) {
            // we're good to go!
            dom.play();
            // stop checking
            clearInterval(intervalSyncVideo);
            dom.addEventListener("seeked", seekComplete);
        }
    }

    function seekComplete() {
        dom.removeEventListener("seeked", seekComplete);
        console.log("Seeked: "+ dom.currentTime);
        console.log("Time:   "+ (getMillisecondFromHour() / 1000));
    }

	syncVideo();
}