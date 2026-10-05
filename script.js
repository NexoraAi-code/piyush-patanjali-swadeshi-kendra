// ===== EDIT THIS PART =====
const CONFIG = {
  whatsapp: "91XXXXXXXXXX", // country code + number, no + or spaces
  address: "Piyush Patanjali Swadeshi Kendra, Karanji",
  timing: "Roj sakali 9 te ratri 8"
};
// Products: add, remove or change prices here. Save, commit, done.
const PRODUCTS = [
  { id: 1, name: "Aloe Vera Gel", price: 95, icon: "🌿", cat: "Skin care" },
  { id: 2, name: "Dant Kanti Toothpaste", price: 90, icon: "🪥", cat: "Daily care" },
  { id: 3, name: "Cow Ghee 500ml", price: 360, icon: "🧈", cat: "Food" },
  { id: 4, name: "Atta 5kg", price: 230, icon: "🌾", cat: "Food" },
  { id: 5, name: "Honey 250g", price: 140, icon: "🍯", cat: "Food" },
  { id: 6, name: "Kesh Kanti Shampoo", price: 120, icon: "🧴", cat: "Daily care" }
];
// ==========================

let cart = {};
let filter = "All";
try { cart = JSON.parse(localStorage.getItem("cart") || "{}"); } catch (e) { cart = {}; }

const $ = (id) => document.getElementById(id);
const save = () => { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} };
const find = (id) => PRODUCTS.find((p) => p.id === Number(id));

function renderChips() {
  const cats = ["All", ...new Set(PRODUCTS.map((p) => p.cat))];
  $("chips").innerHTML = cats
    .map((c) => `<button class="chip ${c === filter ? "on" : ""}" onclick="setFilter('${c}')">${c}</button>`)
    .join("");
}
function setFilter(c) { filter = c; renderChips(); renderGrid(); }

function renderGrid() {
  $("grid").innerHTML = PRODUCTS.filter((p) => filter === "All" || p.cat === filter)
    .map((p) => `<div class="card"><div class="ico">${p.icon}</div><div class="nm">${p.name}</div><div class="pr">₹${p.price}</div><button onclick="add(${p.id})">Add to cart</button></div>`)
    .join("");
}

function add(id) { cart[id] = (cart[id] || 0) + 1; update(); }
function change(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; update(); }
function clearCart() { cart = {}; update(); }

function update() {
  save();
  const ids = Object.keys(cart).filter(find);
  let total = 0, count = 0;
  $("cart-items").innerHTML = ids.length ? ids.map((id) => {
    const p = find(id), q = cart[id];
    total += p.price * q; count += q;
    return `<div class="row"><span>${p.name}<br>₹${p.price}</span><span class="qty"><button onclick="change(${id},-1)">-</button> ${q} <button onclick="change(${id},1)">+</button></span></div>`;
  }).join("") : "<p>Cart rikama ahe. Product add kara.</p>";
  $("total").textContent = "₹" + total;
  $("cart-count").textContent = count;
}

function toggleCart(show) { $("cart").hidden = !show; }

function checkout() {
  const ids = Object.keys(cart).filter(find);
  if (!ids.length) return alert("Pahile product add kara.");
  const name = $("cust-name").value.trim(), addr = $("cust-addr").value.trim();
  if (!name || !addr) return alert("Naav ani address bhara.");
  let total = 0;
  const lines = ids.map((id) => { const p = find(id), q = cart[id]; total += p.price * q; return `${p.name} x ${q} = ₹${p.price * q}`; });
  const msg = `Navin order\nNaav: ${name}\nAddress: ${addr}\n\n${lines.join("\n")}\n\nTotal: ₹${total}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
}

$("f-addr").textContent = "📍 " + CONFIG.address;
$("f-time").textContent = "🕘 " + CONFIG.timing;
renderChips(); renderGrid(); update();
