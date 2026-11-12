const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Filtros do catálogo
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".product-card").forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

// Sacola demonstrativa: os dados ficam apenas na memória enquanto a página está aberta.
const cart = [];
const overlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const drawerCount = document.getElementById("drawer-count");
const cartTotal = document.getElementById("cart-total");

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  cartTotal.textContent = money(total);
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Sua sacola está vazia por enquanto.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><br><span>${item.quantity} × ${money(item.price)}</span></div>
      <button data-remove="${index}" aria-label="Remover ${item.name}">REMOVER</button>
    </div>`).join("");
  cartItems.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.remove), 1);
      renderCart();
    });
  });
}
document.querySelectorAll(".quick-add").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.product;
    const price = Number(button.dataset.price);
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity++;
    else cart.push({ name, price, quantity: 1 });
    renderCart();
    openCart();
  });
});
function openCart() {
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.getElementById("cart-open").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", event => {
  if (event.target === overlay) closeCart();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});
document.getElementById("checkout").addEventListener("click", () => {
  alert("Esta é uma demonstração. Para receber pedidos reais, será necessário integrar um checkout e um meio de pagamento.");
});

// Formulário visual de newsletter: não envia nem armazena dados ainda.
document.getElementById("newsletter-form").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("newsletter-message").textContent =
    "VALEU! O FORMULÁRIO É DEMONSTRATIVO E AINDA NÃO CADASTRA E-MAILS.";
  event.target.reset();
});
