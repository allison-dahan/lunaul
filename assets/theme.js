/* ICYTO Theme JS v4 */

// LOADER
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('hidden'), 400));

// HEADER: transparent → white on scroll, hide on scroll-down
const hdr = document.getElementById('siteHeader');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  hdr.classList.toggle('scrolled', y > 10);
  hdr.classList.toggle('hidden', y > 120 && y > lastY);
  lastY = y;
}, { passive: true });

// SEARCH
document.getElementById('searchBtn').addEventListener('click', () => document.getElementById('searchOverlay').classList.add('open'));
document.getElementById('closeSearch').addEventListener('click', () => document.getElementById('searchOverlay').classList.remove('open'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.getElementById('searchOverlay').classList.remove('open'); closeMobNav(); closeCart(); } });

// MOBILE NAV
document.getElementById('hamburger').addEventListener('click', () => document.getElementById('mobNav').classList.add('open'));
document.getElementById('mobNavClose').addEventListener('click', closeMobNav);
function closeMobNav() { document.getElementById('mobNav').classList.remove('open'); }

// CART DRAWER
function openCart() { document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartVeil').classList.add('open'); document.body.style.overflow='hidden'; renderCart(); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartVeil').classList.remove('open'); document.body.style.overflow=''; }
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartVeil').addEventListener('click', closeCart);
document.getElementById('mobCartBtn')?.addEventListener('click', () => { closeMobNav(); openCart(); });

// CART AJAX
async function updateCount() {
  try {
    const r = await fetch('/cart.js'); const c = await r.json();
    const el = document.getElementById('cartCount');
    if (el) el.textContent = c.item_count > 0 ? '(' + c.item_count + ')' : '';
    return c;
  } catch(e) {}
}
async function renderCart() {
  try {
    const c = await updateCount(); if (!c) return;
    const body = document.getElementById('cartBody');
    const tot  = document.getElementById('cartTotal');
    if (!c.item_count) { body.innerHTML = '<p class="cart-empty">YOUR CART IS EMPTY.</p>'; return; }
    body.innerHTML = c.items.map(i => `<div class="cart-line"><img class="cart-line__img" src="${i.image}" alt="${i.title}"><div><div class="cart-line__name">${i.product_title}</div>${i.variant_title && i.variant_title !== 'Default Title' ? '<div class="cart-line__variant">' + i.variant_title + '</div>' : ''}<div class="cart-line__price">${money(i.final_line_price)}</div><div class="cart-line__qty"><button class="qty-btn" onclick="changeQty('${i.key}',-1)">−</button><span>${i.quantity}</span><button class="qty-btn" onclick="changeQty('${i.key}',1)">+</button></div></div></div>`).join('');
    if (tot) tot.textContent = money(c.total_price);
  } catch(e) {}
}
async function changeQty(key, delta) {
  const r = await fetch('/cart.js'); const c = await r.json();
  const item = c.items.find(i => i.key === key); if (!item) return;
  await fetch('/cart/change.js', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: key, quantity: Math.max(0, item.quantity + delta) }) });
  renderCart();
}
function money(cents) { return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100); }

// ATC
document.addEventListener('submit', async e => {
  const form = e.target.closest('[data-atc-form]'); if (!form) return;
  e.preventDefault();
  const btn = form.querySelector('.btn-atc'); const orig = btn?.textContent;
  if (btn) { btn.disabled=true; btn.textContent='ADDING...'; }
  try { await fetch('/cart/add.js',{method:'POST',body:new FormData(form)}); openCart(); }
  catch(err){}
  finally { if(btn){btn.disabled=false;btn.textContent=orig;} }
});

// ACCORDIONS
document.querySelectorAll('.acc-trigger').forEach(t => t.addEventListener('click', () => {
  const item = t.closest('.acc-item'); const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}));

// GALLERY THUMBS
document.querySelectorAll('.pgallery__thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const main = document.querySelector('.pgallery__main img'); if (!main) return;
    main.src = thumb.dataset.src; main.srcset = thumb.dataset.srcset || '';
    document.querySelectorAll('.pgallery__thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

// VARIANT BTNS
document.querySelectorAll('.vbtn').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.vbtn[data-group="'+b.dataset.group+'"]').forEach(x => x.classList.remove('sel'));
  b.classList.add('sel');
}));

// SCROLL FADE ANIMATIONS
const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);} }), {threshold:0.08});
document.querySelectorAll('[data-fade]').forEach(el => obs.observe(el));

updateCount();

