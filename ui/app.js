function textTypingEffect(element, text, i = 0) {
    if (i === 0) {
        element.textContent = "";
    }

    element.textContent += text[i];

    if (i === text.length - 1) {
        return;
    }

    setTimeout(() => textTypingEffect(element, text, i + 1), 10);
}

class Chatbox {
    constructor() {
        this.args = {
            logoutButton: document.querySelector('.logout--button'),
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { logoutButton, openButton, chatBox, sendButton } = this.args;

        if (this.messages.length === 0) {
            const description = document.createElement('p');
            description.textContent = "Өнөөдөр танд юугаар туслах вэ?";
            description.classList.add('description');
            const welcomeHeader = document.createElement('h3');
            welcomeHeader.textContent = "CaffeBene-д тавтай морилно уу!";
            welcomeHeader.classList.add('welcome-header');

            const gifContainer = document.createElement('div');
            gifContainer.classList.add('gif-container');
            const gif = document.createElement('img');
            gif.src = "/ui/images/main.gif";
            gif.alt = "Welcome GIF";
            gifContainer.appendChild(gif);

            chatBox.querySelector('.chatbox__messages').appendChild(description);
            chatBox.querySelector('.chatbox__messages').appendChild(welcomeHeader);
            chatBox.querySelector('.chatbox__messages').appendChild(gifContainer);
        }

        logoutButton.addEventListener('click', () => {
            if (chatBox.classList.contains('chatbox--active')) {
                this.toggleState(chatBox);
                openButton.style.opacity = 1;
            }
        });

        openButton.addEventListener('click', () => {
            if (!chatBox.classList.contains('chatbox--active')) {
                this.toggleState(chatBox);
                openButton.style.opacity = 0;
            }
        });

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        this.updateChatText(chatbox, true);

        setTimeout(() => {
            fetch($SCRIPT_ROOT + '/predict', {
                method: 'POST',
                body: JSON.stringify({ message: text1 }),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(r => r.json())
                .then(r => {
                    let msg2 = { name: "Caffe Bene", message: r.answer };
                    this.messages.push(msg2);
                    this.updateChatText(chatbox);
                    textField.value = '';
                })
                .catch((error) => {
                    console.error('Error:', error);
                    this.updateChatText(chatbox);
                    textField.value = '';
                });
        }, 40);
    }


    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            let cssClass = item.name === "Caffe Bene" ? "messages__item--visitor" : "messages__item--operator";
            let sender = item.name === "Caffe Bene" ? "CaffeBene" : "Та";
            let profilePicture = item.name === "Caffe Bene" ? "/ui/images/logo.png" : "/ui/images/user.svg";

            let messageContent = item.name === "Caffe Bene" ? `<div class="message message-typing" id="typingEffect">${item.message}</div>` : `<div class="message">${item.message}</div>`;

            if (item.name === "Caffe Bene" && item.message === "Тантай ойрхон хаяг:") {
                getLocation();
            } else {
                html += '<div class="messages__item ' + cssClass + '">' +
                '<img src="' + profilePicture + '" class="profile-picture">' +
                '<div class="message-content">' +
                '<div class="sender">' + sender + '</div>' +
                messageContent +
                '</div>' +
                '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;

        const typingElement = chatmessage.querySelector('#typingEffect');
        if (typingElement) {
            textTypingEffect(typingElement, typingElement.textContent);
        }

        const textContainer = document.querySelector('.text-container');
        textContainer.scrollTop = textContainer.scrollHeight;
    }
}

const chatbox = new Chatbox();
chatbox.display();

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

const showPosition = (position) => {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    const closestBranch = findClosestBranch(userLat, userLon);

    if (closestBranch) {
        const closestBranchInfo = `Тантай хамгийн ойр салбар: ${closestBranch.name}`;

        const cssClass = "messages__item--visitor";
        const profilePicture = "/ui/images/logo.png"; 
        const sender = "CaffeBene"; 

        const html =
            `<div class="messages__item ${cssClass}">
                <img src="${profilePicture}" class="profile-picture">
                <div class="message-content">
                    <div class="sender">${sender}</div>
                    <div class="message">${closestBranchInfo}</div>
                </div>
            </div>`;

        const chatmessage = document.querySelector('.chatbox__messages');
        chatmessage.insertAdjacentHTML('afterbegin', html);

        const textContainer = document.querySelector('.text-container');
        textContainer.scrollTop = textContainer.scrollHeight;

        
    } else {
        console.error("No branches found.");
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