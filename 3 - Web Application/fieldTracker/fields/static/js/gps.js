let watchID;
let wakeLock;
let lastLat = 0;
let lastLon = 0;
let path = [];
let sensitivity = .00003
let currentLocationElement = "lastPosition"

async function startTracking(markerCallback, map = null) {
    //markerCallback is the method used to place a marker when the GPS coords returned from the watchPosition
    const options = {
        enableHighAccuracy: true, // Request the most accurate position
        timeout: 10000,           // Maximum time (ms) to wait for a position
        maximumAge: 0             // Don't use a cached position, always get a fresh one
    };

    if ("wakeLock" in navigator) {
        wakeLock = await navigator.wakeLock.request();
        console.log("wakelock acquired")

    } else {
        console.log("Wakelock is not supported.")
    }
    watchID = navigator.geolocation.watchPosition((position) => {trackGPS(position, markerCallback, map)}, errorTrackGPS, options);
}

function stopTracking() {
    //stop all tracking and then return the path of coords that was collected.
    navigator.geolocation.clearWatch(watchID)
    wakeLock.release().then(() => {
        console.log("Wakelock released.")
        wakeLock = null;
    })
    return path
}

function trackGPS(position, markerCallback, map) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Watching: Latitude: ${latitude}, Longitude: ${longitude}`);

    let differenceLat = Math.abs(lastLat - latitude);
    let differenceLon = Math.abs(lastLon - longitude);
    lastLat = latitude;
    lastLon = longitude;
    console.log("Differences: ", differenceLon, differenceLat)
    if (differenceLat > sensitivity || differenceLon > sensitivity) {
        console.log("Change is enough, saving.")
        document.getElementById(currentLocationElement).textContent = latitude + " - " + longitude
        let newLocation = {lat: latitude, lng: longitude}
        path.push(newLocation);
        markerCallback(newLocation);
        if (map) {
            map.setCenter(newLocation);
        }


    }

}

function errorTrackGPS(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function moveToCurrentLocation(map) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            getCurrentLocationSuccess(position, map)
        },
        errorTrackGPS)
}

function getCurrentLocationSuccess(position, map) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    map.setCenter({lat: latitude, lng: longitude});
}


export {
    startTracking,
    stopTracking,
    moveToCurrentLocation
}