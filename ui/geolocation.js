const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Your browser does not support geolocation");
    }
};

const showPosition = (position) => {
    if (!closestBranchMessageAdded) {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        addClosestBranchMessage(userLat, userLon);
        closestBranchMessageAdded = true;
    }
};

const showError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out");
            break;
        case error.UNKNOWN_ERROR:
            alert("Unknown error occurred");
            break;
        default:
            alert("Unknown error occurred");
    }
};

export { getLocation, showPosition, showError };