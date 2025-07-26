// Mobile Menu Toggle
document.getElementById("menuToggle").onclick = function () {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
};

// Product Search Functionality
function filterProducts(searchValue) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const name = card.getAttribute('data-name').toLowerCase();
    if (name.includes(searchValue.toLowerCase())) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Desktop search
document.getElementById('searchInput').addEventListener('input', function(e) {
  filterProducts(e.target.value);
  // Sync with mobile search
  const mobileInput = document.getElementById('searchInputMobile');
  if (mobileInput) mobileInput.value = e.target.value;
});

// Mobile search
document.getElementById('searchInputMobile').addEventListener('input', function(e) {
  filterProducts(e.target.value);
  // Sync with desktop search
  const desktopInput = document.getElementById('searchInput');
  if (desktopInput) desktopInput.value = e.target.value;
});

// Banner Slider Functionality
(function() {
  const slides = document.querySelectorAll('.banner-slide');
  const dots = document.querySelectorAll('.banner-dot');
  let current = 0;
  let timer = null;
  const showSlide = idx => {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === idx ? '1' : '0';
      slide.style.zIndex = i === idx ? '1' : '0';
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-blue-400', i === idx);
      dot.classList.toggle('bg-white', i !== idx);
    });
    current = idx;
  };
  const nextSlide = () => showSlide((current + 1) % slides.length);
  const prevSlide = () => showSlide((current - 1 + slides.length) % slides.length);
  const startAutoplay = () => {
    timer = setInterval(nextSlide, 5000);
  };
  const stopAutoplay = () => {
    clearInterval(timer);
  };
  // Init
  showSlide(0);
  startAutoplay();
  document.getElementById('nextBanner').onclick = () => { stopAutoplay(); nextSlide(); startAutoplay(); };
  document.getElementById('prevBanner').onclick = () => { stopAutoplay(); prevSlide(); startAutoplay(); };
  dots.forEach((dot, i) => {
    dot.onclick = () => { stopAutoplay(); showSlide(i); startAutoplay(); };
  });
  // Pause on hover
  const slider = document.getElementById('bannerSlider');
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
})();

// --- Customer Reviews Section ---
const demoReviews = [
  { name: "Jane Doe", rating: 5, text: "Amazing product! Highly recommend to everyone." },
  { name: "John Smith", rating: 4, text: "Very good quality, fast shipping." },
  { name: "Emily R.", rating: 5, text: "Exceeded my expectations. Will buy again." },
  { name: "Michael B.", rating: 3, text: "It's okay, but could be improved." },
  { name: "Sarah K.", rating: 4, text: "Great value for the price." },
  { name: "Chris L.", rating: 5, text: "Absolutely love it!" },
  { name: "Alex P.", rating: 2, text: "Not what I expected." },
  { name: "Linda W.", rating: 4, text: "Works as described." }
];

let reviews = [...demoReviews];
let reviewsPerPage = 3;
let currentPage = 1;

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<svg class="inline w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>`;
  }
  return stars;
}

function renderReviews() {
  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';
  const start = 0;
  const end = currentPage * reviewsPerPage;
  const visibleReviews = reviews.slice(0, end);
  visibleReviews.forEach(r => {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = "bg-white rounded-lg shadow p-4";
    reviewDiv.innerHTML = `
      <div class="flex items-center mb-2">
        <div class="flex">${renderStars(r.rating)}</div>
        <span class="ml-3 font-semibold text-gray-800">${r.name}</span>
      </div>
      <p class="text-gray-700">${r.text}</p>
    `;
    reviewList.appendChild(reviewDiv);
  });
  // Show/hide Load More button
  const loadMoreBtn = document.getElementById('loadMoreReviews');
  if (reviews.length > end) {
    loadMoreBtn.classList.remove('hidden');
  } else {
    loadMoreBtn.classList.add('hidden');
  }
}

// Star input for review form
function renderStarInput(selected = 0) {
  const starInput = document.getElementById('starInput');
  starInput.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('button');
    star.type = 'button';
    star.className = `focus:outline-none`;
    star.innerHTML = `<svg class="w-7 h-7 ${i <= selected ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>`;
    star.addEventListener('click', () => {
      renderStarInput(i);
      document.getElementById('reviewForm').dataset.rating = i;
    });
    starInput.appendChild(star);
  }
}

// Handle review form submission
document.addEventListener('DOMContentLoaded', function() {
  renderReviews();
  renderStarInput(0);
  document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('reviewerName').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const rating = parseInt(this.dataset.rating || '0', 10);
    if (!name || !text || !rating) {
      alert('Please fill in all fields and select a rating.');
      return;
    }
    reviews.unshift({ name, rating, text });
    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewText').value = '';
    renderStarInput(0);
    this.dataset.rating = 0;
    currentPage = 1;
    renderReviews();
  });
  document.getElementById('loadMoreReviews').addEventListener('click', function() {
    currentPage++;
    renderReviews();
  });
});

// --- Autocomplete Search Data ---
const searchData = [
  // Products
  { type: 'product', name: 'Wireless Headphones', url: '#wireless-headphones' },
  { type: 'product', name: 'Smartphone X', url: '#smartphone-x' },
  { type: 'product', name: '4K Action Camera', url: '#4k-action-camera' },
  { type: 'product', name: 'Gaming Laptop', url: '#gaming-laptop' },
  { type: 'product', name: 'Bluetooth Speaker', url: '#bluetooth-speaker' },
  { type: 'product', name: 'Smart Watch', url: '#smart-watch' },
  { type: 'product', name: 'Drone Pro', url: '#drone-pro' },
  { type: 'product', name: 'VR Headset', url: '#vr-headset' },
  // Categories
  { type: 'category', name: 'Headphones', url: '#category-headphones' },
  { type: 'category', name: 'Smartphones', url: '#category-smartphones' },
  { type: 'category', name: 'Cameras', url: '#category-cameras' },
  { type: 'category', name: 'Laptops', url: '#category-laptops' },
  { type: 'category', name: 'Speakers', url: '#category-speakers' },
  { type: 'category', name: 'Wearables', url: '#category-wearables' },
  { type: 'category', name: 'Drones', url: '#category-drones' },
  { type: 'category', name: 'VR Devices', url: '#category-vr' }
];

function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener('input', function () {
    const value = this.value.trim().toLowerCase();
    list.innerHTML = '';
    if (!value) {
      list.classList.add('hidden');
      return;
    }
    const suggestions = searchData.filter(item =>
      item.name.toLowerCase().includes(value)
    ).slice(0, 8);

    if (suggestions.length === 0) {
      list.classList.add('hidden');
      return;
    }

    suggestions.forEach(item => {
      const div = document.createElement('div');
      div.className = 'px-4 py-2 cursor-pointer hover:bg-blue-100 flex items-center';
      div.innerHTML = `
        <span class="mr-2 text-blue-500">${item.type === 'product' ? '🔍' : '📂'}</span>
        <span>${item.name}</span>
        <span class="ml-auto text-xs text-gray-400">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
      `;
      div.onclick = () => {
        window.location.hash = item.url;
        list.classList.add('hidden');
        input.value = item.name;
      };
      list.appendChild(div);
    });
    list.classList.remove('hidden');
  });

  // Hide suggestions on blur (with delay for click)
  input.addEventListener('blur', function () {
    setTimeout(() => list.classList.add('hidden'), 100);
  });

  // Show suggestions on focus if input has value
  input.addEventListener('focus', function () {
    if (this.value.trim()) {
      list.classList.remove('hidden');
    }
  });
}

// Desktop
setupAutocomplete('searchInput', 'autocompleteList');
// Mobile
setupAutocomplete('searchInputMobile', 'autocompleteListMobile');
