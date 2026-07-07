/* ============================================
   ENGINE STORE - Modern Clothing E-Commerce
   JavaScript Functionality
   ============================================ */

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {

    // ===== Preloader =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 800);
    }

    // ===== Mobile Menu Toggle =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('show');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('show');
            });
        });
    }

    // ===== Sticky Header Shadow =====
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===== Scroll to Top Button =====
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Active Nav Link =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ===== Product Wishlist Toggle =====
    document.querySelectorAll('.product-wishlist').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('fa-regular', 'fa-heart');
                icon.classList.add('fa-solid', 'fa-heart');
                showToast('Added to wishlist!', 'success');
            } else {
                icon.classList.remove('fa-solid', 'fa-heart');
                icon.classList.add('fa-regular', 'fa-heart');
                showToast('Removed from wishlist!', 'success');
            }
        });
    });

    // ===== Add to Cart Functionality =====
    let cartItems = JSON.parse(localStorage.getItem('engineCart')) || [];
    updateCartCount();

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const product = {
                id: Date.now() + Math.random(),
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.current-price').textContent.replace('$', '')),
                image: productCard.querySelector('.product-image i').className || 'fa-regular fa-shirt',
                quantity: 1
            };

            // Check if already in cart
            const existingItem = cartItems.find(item => item.name === product.name);
            if (existingItem) {
                existingItem.quantity += 1;
                showToast('Quantity updated in cart!', 'success');
            } else {
                cartItems.push(product);
                showToast('Added to cart!', 'success');
            }

            localStorage.setItem('engineCart', JSON.stringify(cartItems));
            updateCartCount();
        });
    });

    // ===== Update Cart Count =====
    function updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCounts.forEach(count => {
            count.textContent = totalItems;
        });
    }

    // ===== Product Details - Size Selector =====
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const parent = this.closest('.options');
            if (parent) {
                parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            }
            this.classList.add('active');
        });
    });

    // ===== Product Details - Color Selector =====
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', function () {
            const parent = this.closest('.color-options');
            if (parent) {
                parent.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            }
            this.classList.add('active');
        });
    });

    // ===== Quantity Selector =====
    document.querySelectorAll('.quantity-selector').forEach(container => {
        const minusBtn = container.querySelector('.qty-minus');
        const plusBtn = container.querySelector('.qty-plus');
        const input = container.querySelector('input');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => {
                let val = parseInt(input.value) || 1;
                if (val > 1) {
                    input.value = val - 1;
                }
            });

            plusBtn.addEventListener('click', () => {
                let val = parseInt(input.value) || 1;
                if (val < 99) {
                    input.value = val + 1;
                }
            });

            input.addEventListener('change', () => {
                let val = parseInt(input.value) || 1;
                if (val < 1) val = 1;
                if (val > 99) val = 99;
                input.value = val;
            });
        }
    });

    // ===== Cart Quantity Update =====
    document.querySelectorAll('.cart-item .quantity').forEach(container => {
        const minusBtn = container.querySelector('.qty-minus');
        const plusBtn = container.querySelector('.qty-plus');
        const input = container.querySelector('input');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', function () {
                let val = parseInt(input.value) || 1;
                if (val > 1) {
                    input.value = val - 1;
                    updateCartItemTotal(this);
                }
            });

            plusBtn.addEventListener('click', function () {
                let val = parseInt(input.value) || 1;
                if (val < 99) {
                    input.value = val + 1;
                    updateCartItemTotal(this);
                }
            });
        }
    });

    // ===== Cart Remove =====
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            if (cartItem) {
                cartItem.style.transition = 'all 0.3s ease';
                cartItem.style.transform = 'translateX(100%)';
                cartItem.style.opacity = '0';
                setTimeout(() => {
                    cartItem.remove();
                    updateCartSummary();
                    showToast('Item removed from cart', 'success');
                }, 300);
            }
        });
    });

    // ===== Update Cart Item Total =====
    function updateCartItemTotal(element) {
        const cartItem = element.closest('.cart-item');
        if (cartItem) {
            const priceText = cartItem.querySelector('.item-price').textContent.replace('$', '');
            const price = parseFloat(priceText) || 0;
            const qty = parseInt(cartItem.querySelector('.quantity input').value) || 1;
            const totalEl = cartItem.querySelector('.item-total');
            if (totalEl) {
                totalEl.textContent = `$${(price * qty).toFixed(2)}`;
            }
            updateCartSummary();
        }
    }

    // ===== Update Cart Summary =====
    function updateCartSummary() {
        const subtotalEl = document.querySelector('.subtotal-amount');
        const totalEl = document.querySelector('.total-amount');
        const discountEl = document.querySelector('.discount-amount');

        if (!subtotalEl || !totalEl) return;

        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const priceText = item.querySelector('.item-price').textContent.replace('$', '');
            const price = parseFloat(priceText) || 0;
            const qty = parseInt(item.querySelector('.quantity input').value) || 1;
            subtotal += price * qty;
        });

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

        // Apply 10% discount for orders over $100
        let discount = 0;
        if (subtotal > 100) {
            discount = subtotal * 0.1;
            if (discountEl) {
                discountEl.textContent = `-$${discount.toFixed(2)}`;
            }
        } else {
            if (discountEl) {
                discountEl.textContent = '$0.00';
            }
        }

        const shipping = subtotal > 50 ? 0 : 5.99;
        const shippingEl = document.querySelector('.shipping-amount');
        if (shippingEl) {
            shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        }

        const total = subtotal - discount + shipping;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // ===== Size Filter =====
    document.querySelectorAll('.size-option').forEach(opt => {
        opt.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });

    // ===== Filter Toggle (Mobile) =====
    const filterToggle = document.querySelector('.filter-toggle');
    const sidebar = document.querySelector('.shop-sidebar');
    if (filterToggle && sidebar) {
        filterToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // ===== Newsletter Form =====
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('input');
            if (input && input.value.trim()) {
                showToast('Successfully subscribed to newsletter!', 'success');
                input.value = '';
            }
        });
    }

    // ===== Contact Form =====
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // ===== Checkout Form =====
    const checkoutForm = document.querySelector('.checkout-form form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showToast('Order placed successfully! Thank you for shopping with Engine Store.', 'success');
            // Clear cart
            localStorage.removeItem('engineCart');
            cartItems = [];
            updateCartCount();
        });
    }

    // ===== Payment Method Selection =====
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function () {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });

    // ===== Toast Notification System =====
    function showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `
      <i class="fas ${icon}"></i>
      <span class="toast-message">${message}</span>
    `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'all 0.3s ease';
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // ===== Initialize Cart Summary on Cart Page =====
    if (document.querySelector('.cart-section')) {
        updateCartSummary();
    }

    // ===== Countdown Timer for Flash Sale =====
    function startCountdown() {
        const timerElements = document.querySelectorAll('.offer-timer');
        if (timerElements.length === 0) return;

        // Set end time to 24 hours from now
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 24);

        function updateTimer() {
            const now = new Date();
            const diff = endTime - now;

            if (diff <= 0) return;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            timerElements.forEach(timer => {
                const hourEl = timer.querySelector('.hours');
                const minuteEl = timer.querySelector('.minutes');
                const secondEl = timer.querySelector('.seconds');

                if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
                if (minuteEl) minuteEl.textContent = String(minutes).padStart(2, '0');
                if (secondEl) secondEl.textContent = String(seconds).padStart(2, '0');
            });
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }
    startCountdown();

    // ===== Price Range Filter =====
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function () {
            priceValue.textContent = `$${this.value}`;
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== Product Image Thumbnail Gallery =====
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function () {
            const parent = this.closest('.thumbnail-list');
            if (parent) {
                parent.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            }
            this.classList.add('active');
        });
    });

    // ===== Shop Sort Select =====
    const sortSelect = document.querySelector('.sort select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            showToast(`Sorted by ${this.options[this.selectedIndex].text}`, 'success');
        });
    }

    // ===== Page Transition Animation =====
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.product-card, .category-card, .feature-card, .policy-card, .coupon-card');
        elements.forEach(el => {
            const position = el.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            if (position < screenHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state
    document.querySelectorAll('.product-card, .category-card, .feature-card, .policy-card, .coupon-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

});

// ===== Product Data (for demo purposes) =====
const productData = {
    products: [
        {
            id: 1,
            name: 'Classic Slim Fit Jeans',
            category: 'Jeans',
            price: 59.99,
            oldPrice: 89.99,
            rating: 4.5,
            reviews: 128,
            badge: 'sale',
            badgeText: '-33%',
            image: 'fa-solid fa-shirt',
            colors: ['#0A2540', '#121212', '#1a3a5c'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
            id: 2,
            name: 'Premium Cotton T-Shirt',
            category: 'T-Shirts',
            price: 29.99,
            oldPrice: 39.99,
            rating: 4.3,
            reviews: 95,
            badge: 'new',
            badgeText: 'New',
            image: 'fa-solid fa-shirt',
            colors: ['#FFFFFF', '#121212', '#FF6B00'],
            sizes: ['S', 'M', 'L', 'XL']
        },
        {
            id: 3,
            name: 'Warm Winter Hoodie',
            category: 'Hoodies',
            price: 79.99,
            oldPrice: 119.99,
            rating: 4.7,
            reviews: 203,
            badge: 'best',
            badgeText: 'Best Seller',
            image: 'fa-solid fa-shirt',
            colors: ['#121212', '#0A2540', '#6C757D'],
            sizes: ['M', 'L', 'XL', 'XXL']
        },
        {
            id: 4,
            name: 'Leather Bomber Jacket',
            category: 'Jackets',
            price: 149.99,
            oldPrice: 199.99,
            rating: 4.8,
            reviews: 156,
            badge: 'sale',
            badgeText: '-25%',
            image: 'fa-solid fa-shirt',
            colors: ['#121212', '#6C757D'],
            sizes: ['S', 'M', 'L', 'XL']
        },
        {
            id: 5,
            name: 'Running Sneakers Pro',
            category: 'Shoes',
            price: 99.99,
            oldPrice: 139.99,
            rating: 4.4,
            reviews: 187,
            badge: 'sale',
            badgeText: '-29%',
            image: 'fa-solid fa-shirt',
            colors: ['#FFFFFF', '#121212', '#FF6B00'],
            sizes: ['7', '8', '9', '10', '11', '12']
        },
        {
            id: 6,
            name: 'Leather Belt Classic',
            category: 'Accessories',
            price: 34.99,
            oldPrice: null,
            rating: 4.2,
            reviews: 64,
            badge: 'new',
            badgeText: 'New',
            image: 'fa-solid fa-shirt',
            colors: ['#121212', '#6C757D'],
            sizes: ['S', 'M', 'L']
        },
        {
            id: 7,
            name: 'Formal Dress Shirt',
            category: 'Shirts',
            price: 49.99,
            oldPrice: 69.99,
            rating: 4.6,
            reviews: 112,
            badge: 'sale',
            badgeText: '-29%',
            image: 'fa-solid fa-shirt',
            colors: ['#FFFFFF', '#0A2540', '#E9ECEF'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
            id: 8,
            name: 'Designer Sunglasses',
            category: 'Accessories',
            price: 89.99,
            oldPrice: 129.99,
            rating: 4.1,
            reviews: 48,
            badge: 'sale',
            badgeText: '-31%',
            image: 'fa-solid fa-shirt',
            colors: ['#121212', '#FF6B00'],
            sizes: ['One Size']
        }
    ]
};

// ===== Dynamic Clothing Product Images =====
// Each image is a CLOTHING ITEM (shirt, t-shirt, jeans, hoodie, jacket, shoe, etc.)
// No models — just the actual product photos
// ===== Product Detail Page Image Pools =====
// Separate pool for product detail gallery images (needs 4 random picks per page load)
const DETAIL_IMAGES = [
    'https://images.unsplash.com/photo-1608236415052-fc00e7f0fc50?w=600&h=600&fit=crop',  // formal shirts hanging
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop',  // folded t-shirts
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop',  // hoodie front
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',     // red sneakers
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=600&fit=crop',  // brown jacket
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=600&fit=crop',     // folded jeans stack
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',  // watch/accessory
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',  // white sneakers
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',  // t-shirt flat lay
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',     // red shoe closeup
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',  // beige hoodie
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&h=600&fit=crop',     // white t-shirt
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=600&fit=crop',  // denim jacket
    'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=600&h=600&fit=crop',  // sneakers
    'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=600&h=600&fit=crop',     // shirt on hanger
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop',  // black t-shirt
    'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600&h=600&fit=crop',  // grey hoodie
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop',  // cap/accessory
    'https://images.unsplash.com/photo-1531746790095-e5cb1582e456?w=600&h=600&fit=crop',  // sunglasses
    'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop',  // leather bag
];

// ===== Assign random images to Product Detail page gallery =====
function assignDetailImages() {
    const mainImg = document.getElementById('detailMainImg');
    const thumbnails = document.querySelectorAll('#detailThumbnails .thumbnail img');
    if (!mainImg && thumbnails.length === 0) return;

    // Pick 4 random unique images from the pool
    const shuffled = [...DETAIL_IMAGES].sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 4);

    // Set main image
    if (mainImg) {
        mainImg.src = picks[0];
        mainImg.alt = 'Product Image';
    }

    // Set thumbnails
    thumbnails.forEach((img, i) => {
        if (i < picks.length) {
            img.src = picks[i];
            img.alt = `Thumbnail ${i + 1}`;
        }
    });
}

// ===== Thumbnail click handler for product detail page =====
function initThumbnailSwapping() {
    const mainImg = document.getElementById('detailMainImg');
    const thumbnails = document.querySelectorAll('#detailThumbnails .thumbnail');
    if (!mainImg || thumbnails.length === 0) return;

    thumbnails.forEach((thumb) => {
        thumb.addEventListener('click', function () {
            const thumbImg = this.querySelector('img');
            if (!thumbImg || !mainImg) return;

            // Swap main image with clicked thumbnail's image
            const currentMainSrc = mainImg.src;
            mainImg.src = thumbImg.src;
            thumbImg.src = currentMainSrc;

            // Update active class
            thumbnails.forEach((t) => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

const CLOTHING_IMAGES = [
    // === HERO BANNER IMAGES (larger, hero-appropriate clothing displays) ===
    [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop',     // t-shirts stack
        'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=600&fit=crop',     // folded jeans
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop',  // hoodie
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',     // shoes
        'https://images.unsplash.com/photo-1608236415052-fc00e7f0fc50?w=600&h=600&fit=crop',  // shirts on hangers
        'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=600&fit=crop',  // jacket
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',  // accessories
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',  // sneakers
    ],
    // === PRODUCT CARD IMAGES (clothing items only - flat lay, hanging, folded) ===
    [
        'https://images.unsplash.com/photo-1608236415052-fc00e7f0fc50?w=400&h=500&fit=crop',  // formal shirts hanging
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop',  // folded t-shirts
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=500&fit=crop',  // hoodie front
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',     // red sneakers
        'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop',  // brown jacket
        'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=500&fit=crop',     // folded jeans stack
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop',  // watch/accessory
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop',  // white sneakers
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop',  // t-shirt flat lay
        'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=500&fit=crop',  // leather bag
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',     // red shoe closeup
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',  // beige hoodie
        'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&h=500&fit=crop',     // white t-shirt
        'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=500&fit=crop',  // denim jacket
        'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400&h=500&fit=crop',  // sneakers
        'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400&h=500&fit=crop',     // shirt on hanger
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',  // black t-shirt
        'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&h=500&fit=crop',  // grey hoodie
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',  // cap/accessory
        'https://images.unsplash.com/photo-1531746790095-e5cb1582e456?w=400&h=500&fit=crop',  // sunglasses
    ]
];

// ===== Assign random clothing images to hero and product cards =====
// Changes every time you open the page (no caching)
function assignRandomClothingImages() {
    const heroPool = CLOTHING_IMAGES[0];
    const productPool = CLOTHING_IMAGES[1];

    // Hero image — pick a random one
    const heroEl = document.getElementById('heroImage');
    if (heroEl) {
        const heroIdx = Math.floor(Math.random() * heroPool.length);
        heroEl.style.backgroundImage = `url('${heroPool[heroIdx]}')`;
    }

    // Product images — pick random unique ones for each
    const productImages = document.querySelectorAll('.dynamic-image');
    const usedIndexes = new Set();

    productImages.forEach((el) => {
        let idx;
        do {
            idx = Math.floor(Math.random() * productPool.length);
        } while (usedIndexes.has(idx) && usedIndexes.size < productPool.length);
        usedIndexes.add(idx);
        el.style.backgroundImage = `url('${productPool[idx]}')`;
    });
}

// ===== Auto-init all image features =====
function initAllImages() {
    // Homepage hero + product cards
    if (document.querySelector('.dynamic-image') || document.getElementById('heroImage')) {
        assignRandomClothingImages();
    }
    // Product detail page gallery
    if (document.getElementById('detailMainImg') || document.querySelector('#detailThumbnails .thumbnail')) {
        assignDetailImages();
        initThumbnailSwapping();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllImages);
} else {
    initAllImages();
}
