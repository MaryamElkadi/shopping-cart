// Sample Product Catalog
const PRODUCTS = [
  {
    id: 1,
    name: "Aero Minimalist Jacket",
    category: "Outerwear",
    price: 140,
    rating: 4.8,
    stock: 12,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
    description: "Crafted from weather-resistant technical fabric. Designed with hidden zipped pockets, clean lines, and an ergonomic tailored fit for everyday urban movement."
  },
  {
    id: 2,
    name: "Orbit Precision Watch",
    category: "Accessories",
    price: 195,
    rating: 4.9,
    stock: 7,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    description: "A minimal analog timepiece featuring a matte brushed steel case, sapphire glass, and a soft genuine leather strap."
  },
  {
    id: 3,
    name: "Nova Speed Runner",
    category: "Footwear",
    price: 125,
    rating: 4.7,
    stock: 18,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    description: "Lightweight running sneakers engineered with responsive cushioning soles and breathable knit textile uppers."
  },
  {
    id: 4,
    name: "Signal Heavyweight Hoodie",
    category: "Essentials",
    price: 88,
    rating: 4.6,
    stock: 15,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    description: "450 GSM organic cotton fleece with a double-layered hood and relaxed shoulder drops for effortless everyday layering."
  },
  {
    id: 5,
    name: "Studio Canvas Tote",
    category: "Accessories",
    price: 65,
    rating: 4.5,
    stock: 9,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",
    description: "Heavy-duty 16oz cotton canvas carryall with a padded laptop compartment and reinforced handles."
  },
  {
    id: 6,
    name: "Vector Matte Sunglasses",
    category: "Accessories",
    price: 75,
    rating: 4.8,
    stock: 6,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    description: "Handcrafted acetate frames with polarized UV400 lenses that deliver optical clarity and timeless architectural style."
  }
];

// Application State
let cart = [];
let wishlist = [];
let selectedCategory = 'All';
let searchQuery = '';
let activeTab = 'cart';
let currentModalProductId = null;

// SVG Icon Helper Templates
function createHeartIcon(isWished, className = "w-4 h-4") {
  return `
    <svg class="${className} ${isWished ? 'text-rose-500' : 'text-slate-300'}" fill="${isWished ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  `;
}

function createCartIcon(className = "w-4 h-4") {
  return `
    <svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  `;
}

function createTrashIcon(className = "w-4 h-4") {
  return `
    <svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  `;
}

function createStarIcon() {
  return `
    <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  `;
}

// Data Utility Functions
function getFilteredProducts() {
  return PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}

function getCategories() {
  return ['All', ...new Set(PRODUCTS.map(p => p.category))];
}

// Render Functions
function renderCategoryFilters() {
  const container = document.getElementById('category-filters');
  if (!container) return;

  const categories = getCategories();
  container.innerHTML = categories.map(category => `
    <button
      onclick="filterCategory('${category}')"
      class="rounded-full px-4 py-2 text-xs font-medium transition ${selectedCategory === category
        ? 'bg-violet-600 text-white'
        : 'bg-white/5 text-slate-300 hover:bg-white/10'
      }"
    >
      ${category}
    </button>
  `).join('');
}

function renderProducts() {
  const container = document.getElementById('product-grid');
  if (!container) return;

  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-violet-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="font-display text-lg font-semibold text-white">No products found</h3>
        <p class="mt-1 text-sm text-slate-400">Try adjusting your search or category filter to find what you are looking for.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const isWished = wishlist.includes(product.id);
    return `
      <article class="product-card glass-card relative flex flex-col overflow-hidden rounded-2xl">
        <!-- Wishlist Button -->
        <button
          onclick="toggleWishlist(${product.id})"
          aria-label="Save to Wishlist"
          class="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/40 p-2.5 text-slate-300 backdrop-blur-md transition hover:scale-110 hover:text-white"
        >
          ${createHeartIcon(isWished, "w-4 h-4")}
        </button>

        <!-- Image & Category -->
        <div
          onclick="openModal(${product.id})"
          class="relative aspect-square cursor-pointer overflow-hidden bg-slate-900"
        >
          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-image h-full w-full object-cover"
            loading="lazy"
          />
          <span class="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-md">
            ${product.category}
          </span>
        </div>

        <!-- Product Details -->
        <div class="flex flex-1 flex-col justify-between p-5">
          <div>
            <div class="flex items-center justify-between gap-2">
              <h3
                onclick="openModal(${product.id})"
                class="cursor-pointer font-display text-lg font-semibold tracking-tight text-white hover:text-violet-400 transition"
              >
                ${product.name}
              </h3>
              <span class="font-display text-lg font-bold text-violet-400">
                $${product.price}
              </span>
            </div>

            <div class="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              ${createStarIcon()}
              <span class="font-semibold text-slate-200">${product.rating}</span>
              <span>·</span>
              <span>${product.stock} in stock</span>
            </div>
          </div>

          <!-- Action Button -->
          <button
            onclick="addToCart(${product.id})"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-violet-500 active:scale-[0.98]"
          >
            ${createCartIcon()}
            Add to Cart
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function renderCart() {
  const container = document.getElementById('cart-view');
  const cartNavBadge = document.getElementById('cart-count');
  const cartTabBadge = document.getElementById('tab-cart-count');

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => {
    const p = PRODUCTS.find(prod => prod.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  // Update Badges
  if (cartNavBadge) {
    cartNavBadge.textContent = totalItemCount;
    if (totalItemCount > 0) {
      cartNavBadge.classList.remove('hidden');
    } else {
      cartNavBadge.classList.add('hidden');
    }
  }

  if (cartTabBadge) {
    cartTabBadge.textContent = totalItemCount;
  }

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-violet-400">
          ${createCartIcon("w-6 h-6")}
        </div>
        <h3 class="font-display text-lg font-semibold text-white">Your cart is empty</h3>
        <p class="mt-1 text-sm text-slate-400">Explore our store catalog to add items to your shopping cart.</p>
      </div>
    `;
    return;
  }

  const itemsHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';

    return `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
        <div class="flex items-center gap-4">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="h-16 w-16 rounded-lg object-cover"
          />
          <div>
            <h3 class="font-semibold text-white">${product.name}</h3>
            <p class="text-xs text-slate-400">$${product.price} each</p>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-6">
          <!-- Quantity Adjuster -->
          <div class="flex items-center rounded-lg border border-white/10 bg-white/5">
            <button
              onclick="updateQuantity(${product.id}, -1)"
              class="px-3 py-1.5 text-sm text-slate-400 hover:text-white"
            >
              -
            </button>
            <span class="px-3 py-1 text-sm font-semibold text-white">
              ${item.quantity}
            </span>
            <button
              onclick="updateQuantity(${product.id}, 1)"
              class="px-3 py-1.5 text-sm text-slate-400 hover:text-white"
            >
              +
            </button>
          </div>

          <span class="font-display font-semibold text-violet-400">
            $${product.price * item.quantity}
          </span>

          <button
            onclick="removeFromCart(${product.id})"
            class="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10 transition"
            aria-label="Remove item"
          >
            ${createTrashIcon()}
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="space-y-4">
      ${itemsHTML}
      <div class="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 gap-4">
        <div>
          <span class="text-sm text-slate-400">Total Order Amount</span>
          <p class="font-display text-3xl font-bold text-white">$${totalAmount}</p>
        </div>
        <button class="w-full sm:w-auto rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-500">
          Proceed to Checkout
        </button>
      </div>
    </div>
  `;
}

function renderWishlist() {
  const container = document.getElementById('wishlist-view');
  const wishlistNavBadge = document.getElementById('wishlist-count');
  const wishlistTabBadge = document.getElementById('tab-wishlist-count');

  const count = wishlist.length;

  if (wishlistNavBadge) {
    wishlistNavBadge.textContent = count;
    if (count > 0) {
      wishlistNavBadge.classList.remove('hidden');
    } else {
      wishlistNavBadge.classList.add('hidden');
    }
  }

  if (wishlistTabBadge) {
    wishlistTabBadge.textContent = count;
  }

  if (!container) return;

  if (count === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-violet-400">
          ${createHeartIcon(false, "w-6 h-6")}
        </div>
        <h3 class="font-display text-lg font-semibold text-white">No items in wishlist</h3>
        <p class="mt-1 text-sm text-slate-400">Click the heart icon on any product to save it to your wishlist for later.</p>
      </div>
    `;
    return;
  }

  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  container.innerHTML = `
    <div class="grid gap-4 sm:grid-cols-2">
      ${wishlistedProducts.map(product => `
        <div class="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
          <div class="flex items-center gap-4">
            <img
              src="${product.image}"
              alt="${product.name}"
              class="h-16 w-16 rounded-lg object-cover"
            />
            <div>
              <h3 class="font-semibold text-white">${product.name}</h3>
              <p class="text-xs font-semibold text-violet-400">$${product.price}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              onclick="addToCart(${product.id})"
              class="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition"
            >
              Add to Cart
            </button>
            <button
              onclick="toggleWishlist(${product.id})"
              class="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10 transition"
            >
              ${createTrashIcon()}
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// User Actions & Handlers
function filterCategory(category) {
  selectedCategory = category;
  renderCategoryFilters();
  renderProducts();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function updateQuantity(productId, delta) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += delta;
    if (existing.quantity <= 0) {
      removeFromCart(productId);
    } else {
      renderCart();
    }
  }
}

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }

  renderProducts();
  renderWishlist();

  // If modal is open for this product, update modal wishlist button icon
  if (currentModalProductId === productId) {
    updateModalWishlistBtn();
  }
}

function switchTab(tabName) {
  activeTab = tabName;
  const cartView = document.getElementById('cart-view');
  const wishlistView = document.getElementById('wishlist-view');
  const sectionTitle = document.getElementById('section-title');
  const tabCartBtn = document.getElementById('tab-cart-btn');
  const tabWishlistBtn = document.getElementById('tab-wishlist-btn');

  if (tabName === 'cart') {
    if (cartView) cartView.classList.remove('hidden');
    if (wishlistView) wishlistView.classList.add('hidden');
    if (sectionTitle) sectionTitle.textContent = 'Your Cart';

    if (tabCartBtn) {
      tabCartBtn.className = 'rounded-lg px-4 py-2 font-medium bg-violet-600 text-white transition';
    }
    if (tabWishlistBtn) {
      tabWishlistBtn.className = 'rounded-lg px-4 py-2 font-medium text-slate-400 hover:text-white transition';
    }
  } else {
    if (cartView) cartView.classList.add('hidden');
    if (wishlistView) wishlistView.classList.remove('hidden');
    if (sectionTitle) sectionTitle.textContent = 'Your Wishlist';

    if (tabCartBtn) {
      tabCartBtn.className = 'rounded-lg px-4 py-2 font-medium text-slate-400 hover:text-white transition';
    }
    if (tabWishlistBtn) {
      tabWishlistBtn.className = 'rounded-lg px-4 py-2 font-medium bg-violet-600 text-white transition';
    }
  }
}

// Modal Handlers
function openModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentModalProductId = productId;

  document.getElementById('modal-image').src = product.image;
  document.getElementById('modal-image').alt = product.name;
  document.getElementById('modal-category').textContent = product.category;
  document.getElementById('modal-name').textContent = product.name;
  document.getElementById('modal-price').textContent = `$${product.price}`;
  document.getElementById('modal-rating').textContent = product.rating;
  document.getElementById('modal-description').textContent = product.description;

  updateModalWishlistBtn();

  const addCartBtn = document.getElementById('modal-add-cart-btn');
  if (addCartBtn) {
    addCartBtn.onclick = () => {
      addToCart(product.id);
      closeModal();
    };
  }

  const wishlistBtn = document.getElementById('modal-wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.onclick = () => {
      toggleWishlist(product.id);
    };
  }

  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function updateModalWishlistBtn() {
  if (!currentModalProductId) return;
  const isWished = wishlist.includes(currentModalProductId);
  const btn = document.getElementById('modal-wishlist-btn');
  const icon = document.getElementById('modal-wishlist-icon');

  if (btn) {
    if (isWished) {
      btn.className = 'flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/50 bg-rose-500/10 text-rose-500 transition';
    } else {
      btn.className = 'flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition';
    }
  }

  if (icon) {
    icon.setAttribute('fill', isWished ? 'currentColor' : 'none');
    icon.setAttribute('class', `w-5 h-5 ${isWished ? 'text-rose-500' : 'text-slate-300'}`);
  }
}

function closeModal() {
  currentModalProductId = null;
  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Initialization & Event Listeners setup
function init() {
  // Set Current Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Search Input Listener
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Navigation Button Listeners
  const wishlistNavBtn = document.getElementById('wishlist-nav-btn');
  if (wishlistNavBtn) {
    wishlistNavBtn.addEventListener('click', () => {
      switchTab('wishlist');
      document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const cartNavBtn = document.getElementById('cart-nav-btn');
  if (cartNavBtn) {
    cartNavBtn.addEventListener('click', () => {
      switchTab('cart');
      document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Tab Buttons
  const tabCartBtn = document.getElementById('tab-cart-btn');
  if (tabCartBtn) {
    tabCartBtn.addEventListener('click', () => switchTab('cart'));
  }

  const tabWishlistBtn = document.getElementById('tab-wishlist-btn');
  if (tabWishlistBtn) {
    tabWishlistBtn.addEventListener('click', () => switchTab('wishlist'));
  }

  // Modal Close Listeners
  const modalCloseBtn = document.getElementById('modal-close-btn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  const modalBackdrop = document.getElementById('detail-modal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Initial Renders
  renderCategoryFilters();
  renderProducts();
  renderCart();
  renderWishlist();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

