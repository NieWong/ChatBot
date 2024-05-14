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
document.addEventListener("DOMContentLoaded", function() {
    const openButton = document.querySelector(".openButton");
    openButton.addEventListener("click", function() {
        window.location.href = "{{ url_for('index_get') }}";
    });
});

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
    let existingIndex = cart.findIndex(item => item.name === categories[a].name);
    if (existingIndex !== -1) {
        cart[existingIndex].count += 1; // Increment count if item exists
    } else {
        cart.push({ ...categories[a], count: 1 }); // Add new item with count 1
    }
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
            var { name, price, image, count } = items;
            total = total + (price * count); 
            document.getElementById("total").innerHTML = "₮ " + total + ".00";
            return (
                `<div class='cart-item'>
                    <div class='row-img'>
                        <img class='rowimg' src=${image}>
                    </div>
                    <p style='font-size:15px; font-weight:bold;'>${name} ${count}ш</p>
                    <h2 style='font-size: 15px;'>₮ ${price}.00</h2>
                    <i class='fa-solid fa-trash' onclick='delElement(${j++})'></i>
                </div>`
            );
        }).join('');
    }
}

function purchaseItems() {
    if (cart.length === 0) {
        showToast("Таны сагс хоосон байна!", "rgb(199, 54, 89)");
    } else {
        let total = cart.reduce((acc, item) => acc + item.price, 0);
        let itemNames = cart.map(item => item.name).join(", ");
        showToast(`Амжилттай баталгаажлаа: ${itemNames}. Нийт дүн: ₮${total}.00`, "rgb(21, 21, 21)");
        cart = [];
        displaycart();
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


document.addEventListener('DOMContentLoaded', function() {
    const buyButton = document.querySelector('.buy-all-button');
    if (buyButton) {
        buyButton.addEventListener('click', purchaseItems);
    }
});
