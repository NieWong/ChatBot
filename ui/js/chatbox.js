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
                openButton.querySelector('img').style.cursor = 'pointer';
            }
        });

        openButton.addEventListener('click', () => {
            if (!chatBox.classList.contains('chatbox--active')) {
                this.toggleState(chatBox);
                openButton.style.opacity = 0;
                const imgElement = openButton.querySelector('img');
                if (imgElement) {
                    imgElement.style.cursor = 'auto';
                }
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
        var userOrder = ''; // Variable to store the user's order
        const menuItems = [
            { name: "Американо", price: 5000, image: "Americano.png" },
            { name: "Эспрессо", price: 4000, image: "Espresso.png" },
            { name: "Кремтэй Эспрессо", price: 7000, image: "EspressoConPanna.png" },
            { name: "Хөөстэй Эспрессо", price: 6000, image: "EspressoMacciato.png" },
            { name: "Желато Эспрессо", price: 6500, image: "Affogato.png"},
            { name: "Сүүтэй Кофе", price: 5000, image: "CaffeLatte.png"},
            { name: "Каппучино", price: 7500, image: "Cappuccino.png"},
            { name: "Карамель Маккиато", price: 8000, image: "CaramelMacchiato.png" },
            { name: "Шоколадтай Кофе", price: 7500, image: "CaffeMocha.png" },
            { name: "Ваниль Латте", price: 7500, image: "VanillaLatte.png" }
        ];

        this.messages.slice().reverse().forEach(function (item, index) {
            let cssClass = item.name === "Caffe Bene" ? "messages__item--visitor" : "messages__item--operator";
            let sender = item.name === "Caffe Bene" ? "CaffeBene" : "Та";
            let profilePicture = item.name === "Caffe Bene" ? "/ui/images/logo.png" : "/ui/images/user.svg";

            let messageContent = item.name === "Caffe Bene" ? `<div class="message message-typing" id="typingEffect">${item.message}</div>` : `<div class="message">${item.message}</div>`;

            if (item.name === "Caffe Bene" && item.message === "Тантай ойрхон хаяг:") {
                getLocation();
            } else if (item.name === "Caffe Bene" && item.message === "menu") {
                const basePath = "/ui/images/";
                let menuHTML = "<div class='menu'><h4>CaffeBene: Бүтээгдэхүүнүүд</h4><div class='menu-grid'>";
                
                menuItems.forEach(item => {
                    const imagePath = basePath + item.image;
                    menuHTML += `<div class='menu-item'>
                                    <img src="${imagePath}" alt="${item.name}" class="coffee-image">
                                    <div class="item-info">
                                        <span class="centered-text">${item.price}₮</span>
                                    </div>
                                </div>`;
                });

                menuHTML += "</div></div>";

                html += '<div class="messages__item ' + cssClass + '">' +
                    '<img src="' + profilePicture + '" class="profile-picture">' +
                    '<div class="message-content">' +
                    '<div class="sender">' + sender + '</div>' +
                    menuHTML +
                    '</div>' +
                    '</div>';
            } else {
                html += '<div class="messages__item ' + cssClass + '">' +
                    '<img src="' + profilePicture + '" class="profile-picture">' +
                    '<div class="message-content">' +
                    '<div class="sender">' + sender + '</div>' +
                    messageContent +
                    '</div>' +
                    '</div>';
            }

            if (item.message.includes("авъя") && item.name !== "Caffe Bene") {
                userOrder = item.message;
                console.log(userOrder);
            }

            // Check for order confirmation message and show toast
            if (item.message === "Та Сагс товч дээр дарж худалдан авалтаа хийнэ үү!" && item.name === "Caffe Bene") {
                // Search for the ordered item in the menuItems list
                let orderedItem = menuItems.find(menuItem => userOrder.includes(menuItem.name));

                if (orderedItem) {
                    showToast(`Та ${orderedItem.name} (${orderedItem.price}₮) сонголоо.`, "#4CAF50");
                } else {
                    showToast("Захиалга олдсонгүй.", "#f44336");
                }
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

function showToast(message, color) {
    let toast = document.createElement("div");
    toast.textContent = message;
    toast.classList.add("toast");
    toast.style.backgroundColor = color;
    document.body.appendChild(toast);

    toast.offsetWidth;

    toast.classList.add("show");

    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

const chatbox = new Chatbox();
chatbox.display();
