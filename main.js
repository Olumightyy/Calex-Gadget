// ===================================
// CALEX ELECTRONICS - ENHANCED JS
// ===================================

// Mobile Menu Toggle
document.getElementById("menuToggle").addEventListener("click", function () {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (e) {
  const menu = document.getElementById("mobileMenu");
  const toggle = document.getElementById("menuToggle");
  
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// ===================================
// TOAST NOTIFICATION SYSTEM
// ===================================

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  
  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", function () {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ===================================
// PRODUCT SEARCH & FILTER
// ===================================

function filterProducts(searchValue) {
  const cards = document.querySelectorAll(".product-card");
  let visibleCount = 0;
  
  cards.forEach(card => {
    const name = card.getAttribute("data-name").toLowerCase();
    if (name.includes(searchValue.toLowerCase())) {
      card.style.display = "";
      card.style.animation = "fadeInUp 0.5s ease";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });
  
  // Show message if no products found
  const productGrid = document.getElementById("productGrid");
  let noResultsMsg = document.getElementById("noResultsMessage");
  
  if (visibleCount === 0 && searchValue) {
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.id = "noResultsMessage";
      noResultsMsg.className = "col-span-full text-center py-12";
      noResultsMsg.innerHTML = `
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-xl text-gray-500 font-semibold">No products found</p>
        <p class="text-gray-400 mt-2">Try searching for something else</p>
      `;
      productGrid.appendChild(noResultsMsg);
    }
  } else if (noResultsMsg) {
    noResultsMsg.remove();
  }
}

// Desktop search
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function (e) {
  filterProducts(e.target.value);
  const mobileInput = document.getElementById("searchInputMobile");
  if (mobileInput) mobileInput.value = e.target.value;
});

// Mobile search
const searchInputMobile = document.getElementById("searchInputMobile");
searchInputMobile.addEventListener("input", function (e) {
  filterProducts(e.target.value);
  const desktopInput = document.getElementById("searchInput");
  if (desktopInput) desktopInput.value = e.target.value;
});

// ===================================
// BANNER SLIDER
// ===================================

(function () {
  const slides = document.querySelectorAll(".banner-slide");
  const dots = document.querySelectorAll(".banner-dot");
  let current = 0;
  let timer = null;

  const showSlide = idx => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === idx);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === idx);
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

  // Initialize
  showSlide(0);
  startAutoplay();

  // Navigation controls
  document.getElementById("nextBanner").addEventListener("click", () => {
    stopAutoplay();
    nextSlide();
    startAutoplay();
  });

  document.getElementById("prevBanner").addEventListener("click", () => {
    stopAutoplay();
    prevSlide();
    startAutoplay();
  });

  // Dots navigation
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopAutoplay();
      showSlide(i);
      startAutoplay();
    });
  });

  // Pause on hover
  const slider = document.getElementById("bannerSlider");
  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      stopAutoplay();
      prevSlide();
      startAutoplay();
    } else if (e.key === "ArrowRight") {
      stopAutoplay();
      nextSlide();
      startAutoplay();
    }
  });
})();

// ===================================
// CUSTOMER REVIEWS
// ===================================

const demoReviews = [
  { name: "Jane Doe", rating: 5, text: "Amazing product! Highly recommend to everyone. The quality exceeded my expectations." },
  { name: "John Smith", rating: 4, text: "Very good quality, fast shipping. Customer service was excellent!" },
  { name: "Emily Roberts", rating: 5, text: "Exceeded my expectations. Will definitely buy again. Best purchase this year!" },
  { name: "Michael Brown", rating: 3, text: "It's okay, but could be improved. Decent for the price." },
  { name: "Sarah Kim", rating: 4, text: "Great value for the price. Works exactly as described." },
  { name: "Chris Lopez", rating: 5, text: "Absolutely love it! Premium quality and fast delivery." },
  { name: "Alex Parker", rating: 2, text: "Not what I expected. Product description could be more accurate." },
  { name: "Linda Wilson", rating: 4, text: "Works as described. Good customer support experience." }
];

let reviews = [...demoReviews];
let reviewsPerPage = 3;
let currentPage = 1;

function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `
      <svg class="inline w-5 h-5 ${i <= rating ? "text-yellow-400" : "text-gray-300"}" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/>
      </svg>
    `;
  }
  return stars;
}

function renderReviews() {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";
  
  const start = 0;
  const end = currentPage * reviewsPerPage;
  const visibleReviews = reviews.slice(0, end);

  visibleReviews.forEach((r, index) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review-card";
    reviewDiv.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
    reviewDiv.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-3">
            ${r.name.charAt(0)}
          </div>
          <div>
            <div class="font-semibold text-gray-800">${r.name}</div>
            <div class="flex mt-1">${renderStars(r.rating)}</div>
          </div>
        </div>
        <div class="text-sm text-gray-400">Just now</div>
      </div>
      <p class="text-gray-700 leading-relaxed">${r.text}</p>
    `;
    reviewList.appendChild(reviewDiv);
  });

  // Show/hide Load More button
  const loadMoreBtn = document.getElementById("loadMoreReviews");
  if (reviews.length > end) {
    loadMoreBtn.classList.remove("hidden");
  } else {
    loadMoreBtn.classList.add("hidden");
  }
}

// Star input for review form
let selectedRating = 0;

function renderStarInput(selected = 0) {
  const starInput = document.getElementById("starInput");
  starInput.innerHTML = "";
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("button");
    star.type = "button";
    star.className = "focus:outline-none transition transform hover:scale-125";
    star.innerHTML = `
      <svg class="w-8 h-8 ${i <= selected ? "text-yellow-400" : "text-gray-300"}" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/>
      </svg>
    `;
    
    star.addEventListener("click", () => {
      selectedRating = i;
      renderStarInput(i);
    });
    
    star.addEventListener("mouseenter", () => {
      renderStarInput(i);
    });
    
    starInput.addEventListener("mouseleave", () => {
      renderStarInput(selectedRating);
    });
    
    starInput.appendChild(star);
  }
}

// Initialize reviews on page load
document.addEventListener("DOMContentLoaded", function () {
  renderReviews();
  renderStarInput(0);

  // Handle review form submission
  document.getElementById("reviewForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const name = document.getElementById("reviewerName").value.trim();
    const text = document.getElementById("reviewText").value.trim();
    const rating = selectedRating;

    if (!name || !text || !rating) {
      showToast("Please fill in all fields and select a rating.", "error");
      return;
    }

    // Add new review
    reviews.unshift({ name, rating, text });
    
    // Reset form
    document.getElementById("reviewerName").value = "";
    document.getElementById("reviewText").value = "";
    selectedRating = 0;
    renderStarInput(0);
    
    // Refresh reviews
    currentPage = 1;
    renderReviews();
    
    // Show success message
    showToast("Thank you for your review!", "success");
    
    // Scroll to reviews
    document.getElementById("reviewList").scrollIntoView({ behavior: "smooth" });
  });

  // Load more reviews
  document.getElementById("loadMoreReviews").addEventListener("click", function () {
    currentPage++;
    renderReviews();
  });
});

// ===================================
// AUTOCOMPLETE SEARCH
// ===================================

const searchData = [
  // Products
  { type: "product", name: "Wireless Headphones", url: "#products" },
  { type: "product", name: "Macbook 13 Air", url: "#products" },
  { type: "product", name: "Dell Desktop Computer", url: "#products" },
  { type: "product", name: "Gaming Laptop", url: "#products" },
  { type: "product", name: "iPhone Pro Max", url: "#products" },
  { type: "product", name: "Nikon Professional Camera", url: "#products" },
  { type: "product", name: "Power Bank", url: "#products" },
  { type: "product", name: "Camera Tripod", url: "#products" },
  
  // Categories
  { type: "category", name: "Mobile Phones", url: "#products" },
  { type: "category", name: "Laptops & Computers", url: "#products" },
  { type: "category", name: "Cameras & Photography", url: "#products" },
  { type: "category", name: "Accessories", url: "#products" },
  { type: "category", name: "Audio & Headphones", url: "#products" },
];

function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener("input", function () {
    const value = this.value.trim().toLowerCase();
    list.innerHTML = "";
    
    if (!value) {
      list.classList.add("hidden");
      return;
    }

    const suggestions = searchData
      .filter(item => item.name.toLowerCase().includes(value))
      .slice(0, 6);

    if (suggestions.length === 0) {
      list.classList.add("hidden");
      return;
    }

    suggestions.forEach(item => {
      const div = document.createElement("div");
      div.className = "px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center transition border-b border-gray-100 last:border-0";
      
      const icon = item.type === "product" ? "🔍" : "📂";
      const badge = item.type === "product" ? "Product" : "Category";
      const badgeColor = item.type === "product" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700";
      
      div.innerHTML = `
        <span class="text-2xl mr-3">${icon}</span>
        <div class="flex-1">
          <div class="font-medium text-gray-800">${item.name}</div>
        </div>
        <span class="text-xs px-2 py-1 rounded-full ${badgeColor} font-semibold">${badge}</span>
      `;
      
      div.addEventListener("click", () => {
        input.value = item.name;
        list.classList.add("hidden");
        filterProducts(item.name);
        
        // Scroll to products
        document.getElementById("products").scrollIntoView({ behavior: "smooth" });
      });
      
      list.appendChild(div);
    });
    
    list.classList.remove("hidden");
  });

  // Hide on blur
  input.addEventListener("blur", function () {
    setTimeout(() => list.classList.add("hidden"), 200);
  });

  // Show on focus if has value
  input.addEventListener("focus", function () {
    if (this.value.trim()) {
      this.dispatchEvent(new Event("input"));
    }
  });
}

// Initialize autocomplete
setupAutocomplete("searchInput", "autocompleteList");
setupAutocomplete("searchInputMobile", "autocompleteListMobile");

// ===================================
// ADD TO CART FUNCTIONALITY
// ===================================

let cartCount = 0;

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-add-cart")) {
    const productCard = e.target.closest(".product-card");
    const productName = productCard.querySelector(".product-name").textContent;
    
    cartCount++;
    document.querySelector(".cart-badge").textContent = cartCount;
    
    showToast(`${productName} added to cart!`, "success");
    
    // Animate cart icon
    const cartBtn = document.querySelector(".cart-btn");
    cartBtn.style.transform = "scale(1.2)";
    setTimeout(() => {
      cartBtn.style.transform = "scale(1)";
    }, 200);
  }
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    
    if (href !== "#" && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      
      // Close mobile menu if open
      document.getElementById("mobileMenu").classList.add("hidden");
    }
  });
});

// ===================================
// NEWSLETTER SUBSCRIPTION
// ===================================

document.querySelector(".newsletter-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = this.querySelector("input[type='email']").value;
  
  showToast(`Thank you for subscribing with ${email}!`, "success");
  this.reset();
});

// ===================================
// PERFORMANCE: Lazy Loading Images
// ===================================

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img").forEach(img => imageObserver.observe(img));
}

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================

window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  
  let current = "";
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

console.log("🎉 Calex Electronics Hub loaded successfully!");
