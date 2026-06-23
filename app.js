document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 0. Dynamic Today Opening Hours Status
  // ==========================================
  const hoursTextEl = document.querySelector('#todayHours .hours-text');
  if (hoursTextEl) {
    const now = new Date();
    const day = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isWeekend = (day === 0 || day === 6);
    
    const startHour = isWeekend ? 8 : 7;
    const endHour = isWeekend ? 23 : 22;
    const hoursStr = isWeekend ? '08:00 - 23:00' : '07:00 - 22:00';
    
    let isOpen = false;
    // Simple check: between startHour (inclusive) and endHour (exclusive)
    if (currentHour > startHour && currentHour < endHour) {
      isOpen = true;
    } else if (currentHour === startHour) {
      isOpen = (currentMinute >= 0);
    }
    
    const statusText = isOpen ? 'Open' : 'Closed';
    const statusColor = isOpen ? '#2ecc71' : '#e74c3c';
    hoursTextEl.innerHTML = `Today: ${hoursStr} <span style="color: ${statusColor}; font-weight: 700; margin-left: 4px; font-size: 0.75rem; text-transform: uppercase; border: 1px solid ${statusColor}; padding: 1px 5px; border-radius: 3px; display: inline-block; line-height: 1;">${statusText}</span>`;
  }

  // ==========================================
  // 1. Navigation Header Scroll Effect
  // ==========================================
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page starts scrolled

  // ==========================================
  // 2. Mobile Menu Navigation Toggler
  // ==========================================
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. Scroll Reveal Animations (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll(
    '.about-content-left, .about-content-right, .gallery-item, .contact-info, .contact-form-container, .feature-card, .menu-card, .review-card, .reservation-form-container'
  );

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Give cards transition delay based on their index
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    // Initial styles for animations if not already present
    if (!el.classList.contains('gallery-item') && !el.classList.contains('about-content-left') && !el.classList.contains('about-content-right') && !el.classList.contains('contact-info') && !el.classList.contains('contact-form-container')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'var(--transition-slow)';
    }
    revealObserver.observe(el);
  });

  // ==========================================
  // 4. Navigation Active Link Tracking
  // ==========================================
  const sections = document.querySelectorAll('section, header.hero');
  const navActiveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(sec => {
    if (sec.getAttribute('id')) {
      navActiveObserver.observe(sec);
    }
  });

  // ==========================================
  // 5. Interactive Gallery Filter
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active classes
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        // Show/hide animations
        if (filterValue === 'all' || filterValue === category) {
          item.style.display = 'block';
          // Trigger slight reflow to restart transition
          void item.offsetWidth;
          item.classList.add('visible');
        } else {
          item.classList.remove('visible');
          // Wait for fade out animation before hiding display
          setTimeout(() => {
            if (!item.classList.contains('visible')) {
              item.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });

  // ==========================================
  // 6. Gallery Lightbox Modal Viewer
  // ==========================================
  const zoomButtons = document.querySelectorAll('.gallery-item-zoom');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg && lightboxClose) {
    zoomButtons.forEach(zoomBtn => {
      zoomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the parent gallery item image src and caption
        const galleryItem = zoomBtn.closest('.gallery-item');
        const img = galleryItem.querySelector('.gallery-item-img');
        const title = galleryItem.querySelector('.gallery-item-title').textContent;
        const category = galleryItem.querySelector('.gallery-item-category').textContent;

        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${category} - ${title}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('container')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ==========================================
  // 7. Interactive Pickup Shopping Cart Logic
  // ==========================================
  let cart = [];
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerCloseBtn = document.getElementById('cartDrawerCloseBtn');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawerItems = document.getElementById('cartDrawerItems');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Toggle Cart Drawer
  const openCart = () => {
    cartDrawer.classList.add('active');
    cartDrawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartDrawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartDrawerCloseBtn) cartDrawerCloseBtn.addEventListener('click', closeCart);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCart);

  // Render Cart Contents
  const renderCart = () => {
    if (!cartDrawerItems) return;
    
    if (cart.length === 0) {
      cartDrawerItems.innerHTML = `
        <div class="cart-empty-message" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          Your pickup cart is empty.
        </div>
      `;
      cartBadgeCount.textContent = '0';
      cartSubtotal.textContent = '₹0';
      checkoutBtn.disabled = true;
      return;
    }

    let itemsHTML = '';
    let total = 0;
    let badgeCount = 0;

    cart.forEach(item => {
      const itemSubtotal = item.price * item.qty;
      total += itemSubtotal;
      badgeCount += item.qty;

      itemsHTML += `
        <div class="cart-item-row" data-id="${item.id}">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <span class="cart-item-price">₹${item.price} x ${item.qty} = ₹${itemSubtotal}</span>
          </div>
          <div class="cart-item-controls">
            <button class="cart-qty-btn qty-minus" aria-label="Decrease Quantity">-</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button class="cart-qty-btn qty-plus" aria-label="Increase Quantity">+</button>
            <span class="cart-item-remove" aria-label="Remove Item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </span>
          </div>
        </div>
      `;
    });

    cartDrawerItems.innerHTML = itemsHTML;
    cartBadgeCount.textContent = badgeCount;
    cartSubtotal.textContent = `₹${total}`;
    checkoutBtn.disabled = false;
  };

  // Add Item to Cart
  const addToCart = (id, name, price) => {
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ id, name, price: parseInt(price), qty: 1 });
    }
    renderCart();
    openCart(); // Show drawer
  };

  // Event listener for menu "Add to Cart" buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const btn = e.target;
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      addToCart(id, name, price);
    }
  });

  // Handle Cart Increments/Decrements inside Drawer (Event Delegation)
  if (cartDrawerItems) {
    cartDrawerItems.addEventListener('click', (e) => {
      const target = e.target;
      const row = target.closest('.cart-item-row');
      if (!row) return;

      const itemId = row.getAttribute('data-id');
      const cartItemIndex = cart.findIndex(item => item.id === itemId);

      if (cartItemIndex === -1) return;

      // Quantity Plus Click
      if (target.classList.contains('qty-plus')) {
        cart[cartItemIndex].qty += 1;
        renderCart();
      }
      
      // Quantity Minus Click
      else if (target.classList.contains('qty-minus')) {
        if (cart[cartItemIndex].qty > 1) {
          cart[cartItemIndex].qty -= 1;
        } else {
          // Remove if it drops to 0
          cart.splice(cartItemIndex, 1);
        }
        renderCart();
      }
      
      // Remove Row Click
      else if (target.closest('.cart-item-remove')) {
        cart.splice(cartItemIndex, 1);
        renderCart();
      }
    });
  }

  // Simulated Cart Checkout Order placement
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const pickupSelect = document.getElementById('cartPickupTime');
      const pickupMins = pickupSelect ? pickupSelect.value : '15';
      const checkoutOriginalText = checkoutBtn.textContent;
      
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Processing order...';

      setTimeout(() => {
        alert(`Order Placed Successfully!\nYour Indian fusion treats will be prepared and ready for hot counter pickup in Koregaon Park in ${pickupMins} minutes.\n\nOrder Code: #CRU-${Math.floor(1000 + Math.random() * 9000)}`);
        
        // Reset Cart
        cart = [];
        renderCart();
        closeCart();
        
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = checkoutOriginalText;
      }, 1500);
    });
  }

  // ==========================================
  // 8. Scroll to Top Circular Progress Widget
  // ==========================================
  const scrollProgressWrap = document.getElementById('scrollProgressWrap');
  const progressPath = document.querySelector('.scroll-progress-circle path');

  if (scrollProgressWrap && progressPath) {
    const pathLength = progressPath.getTotalLength();
    
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateScrollProgress = () => {
      const scroll = window.scrollY || window.pageYOffset;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;

      if (scroll > 300) {
        scrollProgressWrap.classList.add('active-progress');
      } else {
        scrollProgressWrap.classList.remove('active-progress');
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial check

    // Smooth scroll back to top on click
    scrollProgressWrap.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 9. Table Reservation Form Handler
  // ==========================================
  const reservationForm = document.getElementById('reservationForm');
  const reserveFormMessage = document.getElementById('reserveFormMessage');

  if (reservationForm && reserveFormMessage) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reserveName').value.trim();
      const email = document.getElementById('reserveEmail').value.trim();
      const mobile = document.getElementById('reserveMobile').value.trim();
      const guests = document.getElementById('reserveGuests').value;
      const dateTime = document.getElementById('reserveDateTime').value;
      const occasion = document.getElementById('reserveOccasion').value;
      const message = document.getElementById('reserveMessageText').value.trim();

      reserveFormMessage.style.display = 'none';
      reserveFormMessage.className = 'form-message';

      // Validation
      if (!name || !email || !mobile || !guests || !dateTime) {
        reserveFormMessage.textContent = 'Please fill out all required fields marked in the form.';
        reserveFormMessage.classList.add('error');
        return;
      }

      // Email regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        reserveFormMessage.textContent = 'Please enter a valid email address.';
        reserveFormMessage.classList.add('error');
        return;
      }

      // Mobile regex check (Simple 10 digit check for Indian Mobiles)
      const mobilePattern = /^[6-9]\d{9}$/;
      // Strip spaces or dashes for clean matching
      const cleanedMobile = mobile.replace(/[\s-]/g, '').replace(/^\+91/, '');
      if (!mobilePattern.test(cleanedMobile)) {
        reserveFormMessage.textContent = 'Please enter a valid 10-digit Indian mobile number.';
        reserveFormMessage.classList.add('error');
        return;
      }

      // Simulate API Reservation
      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Requesting Booking...';

      setTimeout(() => {
        // Format DateTime for readability
        const formattedDate = new Date(dateTime).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });

        reserveFormMessage.textContent = `Success! A table for ${guests} has been reserved under "${name}" on ${formattedDate} (${occasion}). We have sent a confirmation SMS to ${mobile}.`;
        reserveFormMessage.classList.add('success');
        
        reservationForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }

  // ==========================================
  // 10. General Enquiry Form Handler
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value;
      const message = document.getElementById('formMessageText').value.trim();

      // Reset feedback messages
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';

      // Validation check
      if (!name || !email || !subject || !message) {
        formMessage.textContent = 'Please fill out all the fields in the form.';
        formMessage.classList.add('error');
        return;
      }

      // Simple email validation regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.classList.add('error');
        return;
      }

      // Successful simulated submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      // Simulate network latency
      setTimeout(() => {
        formMessage.textContent = `Thank you, ${name}! Your inquiry regarding "${subject}" has been received. Our team will email you at ${email} within 24 hours.`;
        formMessage.classList.add('success');
        
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }

  // ==========================================
  // 11. Cross-Browser Smooth Scrolling Fallback with Header Offset
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Dynamically compute header offset height (default to 80px)
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 12. Customer Login Modal Handler
  // ==========================================
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const loginModalClose = document.getElementById('loginModalClose');

  if (loginBtn && loginModal && loginModalClose) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeLoginModal = () => {
      loginModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    loginModalClose.addEventListener('click', closeLoginModal);
    
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        closeLoginModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginModal.classList.contains('active')) {
        closeLoginModal();
      }
    });
  }

});
