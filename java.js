let cart = {};

// FUNCION AGREGAR
document.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        addToCart(id);
    });
});

function addToCart(id) {
    const card = document.querySelector(`.card[data-id="${id}"]`);
    const name = card.querySelector("h3").textContent;

    // Usamos data-real-price para obtener precio numérico
    const price = parseFloat(card.querySelector(".price").dataset.realPrice);
    const qty = parseInt(document.getElementById(`qty_${id}`).value);

    if (qty <= 0 || isNaN(price)) return;

    if (!cart[id]) {
        cart[id] = {
            name,
            qty,
            unit: "pz",
            priceUnit: price,
            total: qty * price
        };
    } else {
        cart[id].qty += qty;
        cart[id].total = cart[id].qty * price;
    }

    renderCart();
}

// FUNCION ELIMINAR
document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        delete cart[id];
        renderCart();
    });
});

// FUNCION EDITAR
document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;

        if (!cart[id]) {
            alert("Este producto aún no está en la lista.");
            return;
        }

        const newQty = prompt(`Editar cantidad para ${cart[id].name}:`, cart[id].qty);

        if (newQty !== null && !isNaN(newQty) && newQty > 0) {
            cart[id].qty = parseInt(newQty);

            const card = document.querySelector(`.card[data-id="${id}"]`);
            const price = parseFloat(card.querySelector(".price").dataset.realPrice);

            cart[id].total = cart[id].qty * price;

            renderCart();
        }
    });
});

// FUNCION RENDERIZAR CARRITO
function renderCart() {
    const cartList = document.getElementById("cartList");
    const subtotalEl = document.getElementById("subtotal");
    const shippingEl = document.getElementById("shipping");
    const totalEl = document.getElementById("total");

    cartList.innerHTML = "";

    let subtotal = 0;
    let shipping = 0;

    for (const id in cart) {
        const item = cart[id];
        subtotal += item.total;

        // Obtener símbolo de moneda del producto
        const card = document.querySelector(`.card[data-id="${id}"]`);
        let priceText = card.querySelector(".price").textContent.trim();
        const symbolMatch = priceText.match(/[^0-9.,\s]/);
        const currencySymbol = symbolMatch ? symbolMatch[0] : "€";

        shipping += 0; // Puedes poner envío fijo aquí si quieres

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <div>Cantidad: ${item.qty} pz</div>
            <div>${currencySymbol}${item.total.toFixed(2)}</div>
        `;
        cartList.appendChild(div);
    }

    // Obtener símbolo para totales (del primer producto o € si vacío)
    let firstId = Object.keys(cart)[0];
    let currencySymbolTotal = "€";
    if (firstId) {
        const firstCard = document.querySelector(`.card[data-id="${firstId}"]`);
        let priceText = firstCard.querySelector(".price").textContent.trim();
        const symbolMatch = priceText.match(/[^0-9.,\s]/);
        currencySymbolTotal = symbolMatch ? symbolMatch[0] : "€";
    }

    subtotalEl.textContent = `${currencySymbolTotal}${subtotal.toFixed(2)}`;
    shippingEl.textContent = `${currencySymbolTotal}${shipping.toFixed(2)}`;
    totalEl.textContent = `${currencySymbolTotal}${(subtotal + shipping).toFixed(2)}`;
}

// FUNCION CHECKOUT
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    document.getElementById("paymentModal").style.display = "block";
    cart = {};
    renderCart();
});

// CERRAR MODAL DE PAGO
document.getElementById("closePayment").addEventListener("click", () => {
    document.getElementById("paymentModal").style.display = "none";
});