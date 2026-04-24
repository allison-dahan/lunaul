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
document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.getElementById('searchOverlay').classList.remove('open'); closeMobNav(); } });

// MOBILE NAV
document.getElementById('hamburger').addEventListener('click', () => document.getElementById('mobNav').classList.add('open'));
document.getElementById('mobNavClose').addEventListener('click', closeMobNav);
function closeMobNav() { document.getElementById('mobNav').classList.remove('open'); }

// CART COUNT
async function updateCount() {
  try {
    const r = await fetch('/cart.js'); const c = await r.json();
    const el = document.getElementById('cartCount');
    if (el) el.textContent = c.item_count > 0 ? '(' + c.item_count + ')' : '';
  } catch(e) {}
}

// ATC: redirect to cart page after adding
function openCart() { window.location.href = '/cart'; }

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

