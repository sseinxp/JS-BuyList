let input = document.getElementById("productInput");
let addButton = document.getElementById("addButton");
let productList = document.getElementById("productList");
let neededStats = document.getElementById("neededStats");
let boughtStats = document.getElementById("boughtStats");

let products = [
    { name: "Помідори", quantity: 3, bought: true },
    { name: "Печиво", quantity: 2, bought: false },
    { name: "Сир", quantity: 1, bought: false }
];

let savedProducts = localStorage.getItem("products");

if (savedProducts !== null) {
    products = JSON.parse(savedProducts);
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function addProduct() {
    let name = input.value.trim();
    if (name !== "") {
        products.push({ name: name, quantity: 1, bought: false });
        input.value = "";
        input.focus();
        saveProducts();
        renderProducts();
        renderStats();
    } else {
        input.focus();
    }
}

function changeProductName(index, newName) {
    if (newName.trim() !== "") {
        products[index].name = newName.trim();
        saveProducts();
        renderProducts();
        renderStats();
    } else {
        renderProducts();
    }
}

function startEditName(index) {
    let nameBlock = document.getElementById("nameBlock" + index);
    nameBlock.innerHTML = "";

    let editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit_input";
    editInput.value = products[index].name;

    editInput.onblur = function () {
        changeProductName(index, editInput.value);
    };

    nameBlock.appendChild(editInput);
    editInput.focus();
}

function renderProducts() {
    productList.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        let row = document.createElement("div");
        row.className = "boxes";

        let nameBlock = document.createElement("div");
        nameBlock.className = "product_announ";
        nameBlock.id = "nameBlock" + i;

        let nameElement = document.createElement("p");
        nameElement.className = "product-needed";
        nameElement.textContent = product.name;

        if (product.bought === true) {
            nameElement.className = "product-needed product-n-needed";
        } else {
            nameElement.onclick = function () {
                startEditName(i);
            };
        }

        nameBlock.appendChild(nameElement);

        let counter = document.createElement("div");
        counter.className = "counter";

        if (product.bought === false) {
            let minusButton = document.createElement("button");
            minusButton.type = "button";
            minusButton.textContent = "-";
            minusButton.setAttribute("data-tooltip", "Зменшити кількість");

            if (product.quantity === 1) {
                minusButton.className = "minus_disabled";
                minusButton.disabled = true;
            } else {
                minusButton.className = "minus";
                minusButton.onclick = function () {
                    product.quantity = product.quantity - 1;
                    saveProducts();
                    renderProducts();
                    renderStats();
                };
            }
            counter.appendChild(minusButton);
        }

        let count = document.createElement("div");
        count.className = "count";
        count.textContent = product.quantity;
        counter.appendChild(count);

        if (product.bought === false) {
            let plusButton = document.createElement("button");
            plusButton.type = "button";
            plusButton.className = "plus";
            plusButton.textContent = "+";
            plusButton.setAttribute("data-tooltip", "Збільшити кількість");
            plusButton.onclick = function () {
                product.quantity = product.quantity + 1;
                saveProducts();
                renderProducts();
                renderStats();
            };
            counter.appendChild(plusButton);
        }

        let buttonsBlock = document.createElement("div");
        buttonsBlock.className = "necessisty";

        let statusButton = document.createElement("button");
        statusButton.type = "button";
        statusButton.className = "status";
        statusButton.setAttribute("data-tooltip", "Змінити статус");
        statusButton.textContent = product.bought ? "Не куплено" : "Куплено";
        statusButton.onclick = function () {
            product.bought = !product.bought;
            saveProducts();
            renderProducts();
            renderStats();
        };
        buttonsBlock.appendChild(statusButton);

        if (product.bought === false) {
            let deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete";
            deleteButton.textContent = "×";
            deleteButton.setAttribute("data-tooltip", "Видалити товар");
            deleteButton.onclick = function () {
                products.splice(i, 1);
                saveProducts();
                renderProducts();
                renderStats();
            };
            buttonsBlock.appendChild(deleteButton);
        }

        row.appendChild(nameBlock);
        row.appendChild(counter);
        row.appendChild(buttonsBlock);
        productList.appendChild(row);
    }
}

function renderStats() {
    neededStats.innerHTML = "";
    boughtStats.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let item = document.createElement("div");
        item.className = "result_list";

        let productName = document.createElement("div");
        productName.className = "result_list_product";
        productName.textContent = product.name;

        let productNumber = document.createElement("div");
        productNumber.className = "result_list_num";
        productNumber.textContent = product.quantity;

        if (product.bought === true) {
            productName.className = "result_list_product result_list_product_rest";
            productNumber.className = "result_list_num result_list_num_rest";
        }

        item.appendChild(productName);
        item.appendChild(productNumber);

        if (product.bought === true) {
            boughtStats.appendChild(item);
        } else {
            neededStats.appendChild(item);
        }
    }
}

addButton.onclick = function () {
    addProduct();
};

input.onkeydown = function (event) {
    if (event.key === "Enter") {
        addProduct();
    }
};

renderProducts();
renderStats();
input.focus();
