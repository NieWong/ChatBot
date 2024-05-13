const menuItems = [
    { name: "Американо", price: 5000, image: "ui/images/Americano.png" },
    { name: "Эспрессо", price: 4000, image: "ui/images/Espresso.png" },
    { name: "Кремтэй Эспрессо", price: 7000, image: "ui/images/EspressoConPanna.png" },
    { name: "Хөөстэй Эспрессо", price: 6000, image: "ui/images/EspressoMacciato.png" },
    { name: "Желато Эспрессо", price: 6500, image: "ui/images/Affogato.png"},
    { name: "Сүүтэй Кофе", price: 5000, image: "ui/images/CaffeLatte.png"},
    { name: "Каппучино", price: 7500, image: "ui/images/Cappuccino.png"},
    { name: "Карамель Маккиато", price: 8000, image: "ui/images/CaramelMacchiato.png" },
    { name: "Шоколадтай Кофе", price: 7500, image: "ui/images/CaffeMocha.png" },
    { name: "Ваниль Латте", price: 7500, image: "ui/images/VanillaLatte.png" }
];

const categories = [...new Set(menuItems.map((item) => item))];
let i = 0;

document.getElementById('root').innerHTML = categories.map((item) => {
    var { name, price, image } = item;
    return (
        `<div class='box'>
            <div class='img-box'>
                <img class='images' src=${image}></img>
            </div>
            <div class='bottom'>
                <p style='color: white; font-weight: bold; font-size: 22px;'>${name}</p> 
                <h2>₮ ${price}.00</h2>
                <button onclick='addtocart(${i++})' style='font-family: "Leckerli One", cursive;'>Сагсанд нэмэх</button>
            </div>
        </div>`
    );
}).join('');

var cart = [];

function addtocart(a) {
    cart.push({ ...categories[a] });
    displaycart();
}

function delElement(a) {
    cart.splice(a, 1);
    displaycart();
}

function displaycart() {
    let j = 0, total = 0;
    document.getElementById("count").innerHTML = cart.length;
    if (cart.length == 0) {
        document.getElementById('cartItem').innerHTML = "Таны сагс хоосон байна!";
        document.getElementById("total").innerHTML = "₮ " + 0 + ".00";
    } else {
        document.getElementById("cartItem").innerHTML = cart.map((items) => {
            var { name, price, image } = items;
            total = total + price;
            document.getElementById("total").innerHTML = "₮ " + total + ".00";
            return (
                `<div class='cart-item'>
                    <div class='row-img'>
                        <img class='rowimg' src=${image}>
                    </div>
                    <p style='font-size:15px; font-weight:bold;'>${name}</p>
                    <h2 style='font-size: 15px;'>₮ ${price}.00</h2>
                    <i class='fa-solid fa-trash' onclick='delElement(${j++})'></i>
                </div>`
            );
        }).join('');
    }
}

function purchaseItems() {
    if (cart.length === 0) {
        showToast("Таны сагс хоосон байна!", "rgba(255, 0, 0, 1)");
    } else {
        let total = cart.reduce((acc, item) => acc + item.price, 0);
        let itemNames = cart.map(item => item.name).join(", ");
        showToast(`Амжилттай баталгаажлаа: ${itemNames}. Нийт дүн: ₮${total}.00`, "rgba(0, 255, 0, 1)");
    }
}

function showToast(message, color) {
    let toast = document.createElement("div"); 
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = color;
    toast.style.color = "white";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const buyButton = document.querySelector('.buy-all-button');
    if (buyButton) {
        buyButton.addEventListener('click', purchaseItems);
    }
});
