const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Your browser does not support geolocation");
    }
};
const branchAddresses = [
    { name: "Metro Mall department store, 6th khoroo, Улаанбаатар 14201", latitude: 47.9262709, longitude: 106.9149069 },
    { name: "Энх тайвaны өргөн чөлөө 20, Hunsnii, Улаанбаатар 14250", latitude: 47.9160674, longitude: 106.9071169 },
    { name: "Khan Uul Tower, B.Sharav Street, Khan Uul District 3th Khoroo, Chingi, Улаанбаатар 17042", latitude: 47.8987031, longitude: 106.8957168 },
    { name: "Жигжиджавын гудамж 3, Gutliin 22, Juulchin Street, Улаанбаатар 15160", latitude: 47.919707, longitude: 106.9130918 },
    { name: "Prime Minister A.Amar St, Urgoo 2 Cinema, Улаанбаатар 14200", latitude: 47.921721, longitude: 106.9222144 },
    { name: "Sambuu St 19-3, Twincom Tower, Улаанбаатар 15141", latitude: 47.922028, longitude: 106.9032176 },
    { name: "САНСАР цэнтр, Байр - 1, Улаанбаатар 16066", latitude: 47.9230129, longitude: 106.8780685 },
    { name: "Sukhbaatar St 3, Bodi Tower, Улаанбаатар", latitude: 47.9181424, longitude: 106.9155308 },
    { name: "Naadam Center, Улаанбаатар 17011", latitude: 47.9027174, longitude: 106.912281 },
    { name: "Амарын гудамж 8, Улаанбаатар 17012", latitude: 47.9201683, longitude: 106.9223484 },
    { name: "33 Student St 8th khoroo Sukhbaatar District 14191 Ulaanbaatar Mongolia Ulaanbaatar 14191", latitude: 47.9207596, longitude: 106.9273227 },
];

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1); 
    const dLon = deg2rad(lon2 - lon1); 

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function findClosestBranch(userLat, userLon) {
    let closestBranch = null;
    let minDistance = Infinity;

    branchAddresses.forEach(branch => {
        const distance = calculateDistance(userLat, userLon, branch.latitude, branch.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            closestBranch = branch;
        }
    });

    return closestBranch;
}

function addClosestBranchMessage(userLat, userLon) {
    const closestBranch = findClosestBranch(userLat, userLon);
    const closestBranchInfo = `Тантай хамгийн ойр байрлах салбар: ${closestBranch.name}`;
    let message = { name: "Caffe Bene", message: closestBranchInfo };
    chatbox.messages.push(message);
    chatbox.updateChatText(chatbox.args.chatBox);
}
let closestBranchMessageAdded = false;

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