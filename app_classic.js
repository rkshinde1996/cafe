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
  handleScroll();

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

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. Scroll Reveal Animations
  // ==========================================
  const revealElements = document.querySelectorAll(
    '.about-classic-images, .about-classic-text, .gallery-item, .contact-classic-sidebar, .contact-classic-form-panel, .bistro-menu-board, .bistro-accordion-wrapper, .bistro-reviews-slider-box, .quick-booking-bar'
  );

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    if (!el.classList.contains('gallery-item') && !el.classList.contains('about-classic-images') && !el.classList.contains('about-classic-text') && !el.classList.contains('contact-classic-sidebar') && !el.classList.contains('contact-classic-form-panel')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'var(--transition-slow)';
    }
    revealObserver.observe(el);
  });

  // ==========================================
  // 4. Navigation Active Link Tracking
  // ==========================================
  const sections = document.querySelectorAll('section, section.hero-slider-container');
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
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || filterValue === category) {
          item.style.display = 'block';
          void item.offsetWidth;
          item.classList.add('visible');
        } else {
          item.classList.remove('visible');
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
        
        const galleryItem = zoomBtn.closest('.gallery-item');
        const img = galleryItem.querySelector('.gallery-item-img');
        const title = galleryItem.querySelector('.gallery-item-title').textContent;
        const category = galleryItem.querySelector('.gallery-item-category').textContent;

        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${category} - ${title}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
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

  const addToCart = (id, name, price) => {
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ id, name, price: parseInt(price), qty: 1 });
    }
    renderCart();
    openCart();
  };

  if (cartDrawerItems) {
    cartDrawerItems.addEventListener('click', (e) => {
      const target = e.target;
      const row = target.closest('.cart-item-row');
      if (!row) return;

      const itemId = row.getAttribute('data-id');
      const cartItemIndex = cart.findIndex(item => item.id === itemId);

      if (cartItemIndex === -1) return;

      if (target.classList.contains('qty-plus')) {
        cart[cartItemIndex].qty += 1;
        renderCart();
      }
      else if (target.classList.contains('qty-minus')) {
        if (cart[cartItemIndex].qty > 1) {
          cart[cartItemIndex].qty -= 1;
        } else {
          cart.splice(cartItemIndex, 1);
        }
        renderCart();
      }
      else if (target.closest('.cart-item-remove')) {
        cart.splice(cartItemIndex, 1);
        renderCart();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const pickupSelect = document.getElementById('cartPickupTime');
      const pickupMins = pickupSelect ? pickupSelect.value : '15';
      const checkoutOriginalText = checkoutBtn.textContent;
      
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Processing order...';

      setTimeout(() => {
        alert(`Order Placed Successfully!\nYour customized Indian fusion treats will be prepared and ready for pickup at our Koregaon Park counter in ${pickupMins} minutes.\n\nOrder Code: #CRU-${Math.floor(1000 + Math.random() * 9000)}`);
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
    updateScrollProgress();

    scrollProgressWrap.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 9. General Enquiry Form Handler
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

      formMessage.style.display = 'none';
      formMessage.className = 'form-message';

      if (!name || !email || !subject || !message) {
        formMessage.textContent = 'Please fill out all the fields in the form.';
        formMessage.classList.add('error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.classList.add('error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

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
  // 10. Cross-Browser Smooth Scrolling Fallback with Header Offset
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
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
  // 11. Customer Login Modal Handler
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

  // ==========================================
  // 12. Classic Cross-Fading Hero Slider
  // ==========================================
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-arrow-prev');
  const nextBtn = document.querySelector('.slider-arrow-next');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const startSlideShow = () => {
    slideInterval = setInterval(nextSlide, 6000);
  };

  const stopSlideShow = () => {
    clearInterval(slideInterval);
  };

  if (slides.length > 0) {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopSlideShow();
        showSlide(currentSlide - 1);
        startSlideShow();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopSlideShow();
        showSlide(currentSlide + 1);
        startSlideShow();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        stopSlideShow();
        showSlide(idx);
        startSlideShow();
      });
    });

    startSlideShow();
  }

  // ==========================================
  // 13. Interactive Why Choose Us Accordions
  // ==========================================
  const accordionItems = document.querySelectorAll('.bistro-accordion-item');
  const showcaseTitle = document.getElementById('accordionShowcaseTitle');
  const showcaseDesc = document.getElementById('accordionShowcaseDesc');
  const showcaseBg = document.querySelector('.accordion-showcase-bg');
  const showcaseNum = document.querySelector('.showcase-big-num');

  accordionItems.forEach(item => {
    item.querySelector('.accordion-header').addEventListener('click', () => {
      if (item.classList.contains('active')) return; // Already active

      accordionItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Get values
      const title = item.getAttribute('data-title');
      const desc = item.getAttribute('data-desc');
      const img = item.getAttribute('data-img');
      const num = item.getAttribute('data-num');

      // Update showcase elements with smooth transitions
      if (showcaseTitle) showcaseTitle.textContent = title;
      if (showcaseDesc) showcaseDesc.textContent = desc;
      if (showcaseNum) showcaseNum.textContent = num;
      
      if (showcaseBg) {
        showcaseBg.style.transform = 'scale(1.1)';
        showcaseBg.style.opacity = '0.3';
        
        setTimeout(() => {
          showcaseBg.style.backgroundImage = `url('${img}')`;
          showcaseBg.style.transform = 'scale(1.0)';
          showcaseBg.style.opacity = '1';
        }, 300);
      }
    });
  });

  // ==========================================
  // 14. Interactive Reviews Quote Slider
  // ==========================================
  const reviewSlides = document.querySelectorAll('.review-slide-item');
  const reviewPrev = document.querySelector('.review-prev');
  const reviewNext = document.querySelector('.review-next');
  const reviewCounter = document.querySelector('.review-slider-counter');
  let currentReview = 0;

  const showReview = (index) => {
    if (reviewSlides.length === 0) return;
    
    reviewSlides.forEach(slide => slide.classList.remove('active'));
    currentReview = (index + reviewSlides.length) % reviewSlides.length;
    reviewSlides[currentReview].classList.add('active');
    
    if (reviewCounter) {
      reviewCounter.textContent = `${currentReview + 1} / ${reviewSlides.length}`;
    }
  };

  if (reviewSlides.length > 0) {
    if (reviewPrev) {
      reviewPrev.addEventListener('click', () => showReview(currentReview - 1));
    }
    if (reviewNext) {
      reviewNext.addEventListener('click', () => showReview(currentReview + 1));
    }
    showReview(0);
  }

  // ==========================================
  // 15. Interactive Seating Booking Wizard
  // ==========================================
  const openWizardBtn = document.getElementById('openBookingWizardBtn');
  const bookingModal = document.getElementById('bookingModal');
  const bookingModalCloseBtn = document.getElementById('bookingModalCloseBtn');
  
  const step1 = document.getElementById('wizardStep1');
  const step2 = document.getElementById('wizardStep2');
  const step3 = document.getElementById('wizardStep3');
  
  const wizardNextBtn = document.getElementById('wizardNextBtn');
  const wizardBackBtn = document.getElementById('wizardBackBtn');
  const wizardCloseSuccessBtn = document.getElementById('wizardCloseSuccessBtn');
  const wizardContactForm = document.getElementById('wizardContactForm');
  const wizardFormMessage = document.getElementById('wizardFormMessage');
  
  const mapZones = document.querySelectorAll('.map-zone.available');
  const selectedZoneLabel = document.getElementById('selectedZoneLabel');
  const selectedZoneFee = document.getElementById('selectedZoneFee');
  
  let selectedZoneData = null;
  
  // Set default reservation date to tomorrow
  const quickDateInput = document.getElementById('quickDate');
  if (quickDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    quickDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Open Modal
  if (openWizardBtn && bookingModal) {
    openWizardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      step1.classList.add('active');
      step2.classList.remove('active');
      step3.classList.remove('active');
      
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close Modal
  const closeBookingModal = () => {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
      
      selectedZoneData = null;
      if (selectedZoneLabel) selectedZoneLabel.textContent = 'None (Click map to select)';
      if (selectedZoneFee) selectedZoneFee.textContent = '--';
      if (wizardNextBtn) wizardNextBtn.disabled = true;
      mapZones.forEach(z => z.classList.remove('selected'));
      if (wizardContactForm) wizardContactForm.reset();
      if (wizardFormMessage) {
        wizardFormMessage.style.display = 'none';
        wizardFormMessage.className = 'form-message';
      }
    }
  };

  if (bookingModalCloseBtn) bookingModalCloseBtn.addEventListener('click', closeBookingModal);
  if (wizardCloseSuccessBtn) wizardCloseSuccessBtn.addEventListener('click', closeBookingModal);
  
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
        closeBookingModal();
      }
    });
  }

  // Map zone clicking
  mapZones.forEach(zone => {
    zone.addEventListener('click', () => {
      mapZones.forEach(z => z.classList.remove('selected'));
      zone.classList.add('selected');
      
      const zoneName = zone.getAttribute('data-zone-name');
      const zoneFee = zone.getAttribute('data-zone-fee');
      
      selectedZoneData = { id: zone.id, name: zoneName, fee: zoneFee };
      
      if (selectedZoneLabel) selectedZoneLabel.textContent = zoneName;
      if (selectedZoneFee) selectedZoneFee.textContent = zoneFee;
      
      if (wizardNextBtn) wizardNextBtn.disabled = false;
    });
  });

  if (wizardNextBtn) {
    wizardNextBtn.addEventListener('click', () => {
      step1.classList.remove('active');
      step2.classList.add('active');
    });
  }

  if (wizardBackBtn) {
    wizardBackBtn.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
    });
  }

  if (wizardContactForm) {
    wizardContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('wizardName').value.trim();
      const email = document.getElementById('wizardEmail').value.trim();
      const mobile = document.getElementById('wizardMobile').value.trim();
      const occasion = document.getElementById('wizardOccasion').value;
      const message = document.getElementById('wizardMessage').value.trim();
      
      if (wizardFormMessage) {
        wizardFormMessage.style.display = 'none';
        wizardFormMessage.className = 'form-message';
      }

      if (!name || !email || !mobile) {
        wizardFormMessage.textContent = 'Please complete all required fields.';
        wizardFormMessage.classList.add('error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        wizardFormMessage.textContent = 'Please enter a valid email address.';
        wizardFormMessage.classList.add('error');
        return;
      }

      const mobilePattern = /^[6-9]\d{9}$/;
      const cleanedMobile = mobile.replace(/[\s-]/g, '').replace(/^\+91/, '');
      if (!mobilePattern.test(cleanedMobile)) {
        wizardFormMessage.textContent = 'Please enter a valid 10-digit Indian mobile number.';
        wizardFormMessage.classList.add('error');
        return;
      }

      const addons = [];
      if (document.getElementById('addonCoffee').checked) addons.push('Pre-order Coffee');
      if (document.getElementById('addonFries').checked) addons.push('Pre-order Fries');
      if (document.getElementById('addonQuiet').checked) addons.push('Quiet Spot');
      if (document.getElementById('addonDecor').checked) addons.push('Decor Setup');

      const dateVal = document.getElementById('quickDate').value;
      const timeVal = document.getElementById('quickTime').value;
      const guestsCountVal = document.getElementById('quickGuests').value;

      const submitBtn = wizardContactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Confirming Reservation...';

      setTimeout(() => {
        const formattedDate = new Date(`${dateVal}T${timeVal}`).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });

        document.getElementById('summaryZone').textContent = selectedZoneData ? selectedZoneData.name : 'Selected Zone';
        document.getElementById('summaryDateTime').textContent = formattedDate;
        document.getElementById('summaryName').textContent = name;
        document.getElementById('summaryGuests').textContent = `${guestsCountVal} ${guestsCountVal === '9+' ? '' : (guestsCountVal === '1' ? 'Person' : 'People')}`;
        document.getElementById('summaryAddons').textContent = addons.length > 0 ? addons.join(', ') : 'None';
        
        const codeNum = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('summaryCode').textContent = `#CRU-WIZ-${codeNum}`;

        step2.classList.remove('active');
        step3.classList.add('active');

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }

  // ==========================================
  // 16. Gourmet Customization Modal state database
  // ==========================================
  const customDb = {
    "peri-peri-fries": {
      name: "Peri Peri French Fries",
      basePrice: 150,
      hasSize: true,
      hasCrust: false,
      sizes: [
        { name: "Regular Porton", priceAdd: 0 },
        { name: "Large Share Basket", priceAdd: 40 }
      ],
      addons: [
        { name: "Extra Creamy Garlic Mayonnaise", priceAdd: 20 },
        { name: "Add Melting Cheddar Cheese Sauce", priceAdd: 40 }
      ]
    },
    "chicken-burger": {
      name: "Cru Chicken Burger",
      basePrice: 240,
      hasSize: true,
      hasCrust: false,
      sizes: [
        { name: "Single Chicken Patty", priceAdd: 0 },
        { name: "Double Chicken Patty Feast", priceAdd: 60 }
      ],
      addons: [
        { name: "Extra Slice Cheddar Cheese", priceAdd: 20 },
        { name: "Spicy Peri-Peri Sauce Glaze", priceAdd: 10 },
        { name: "Soft Artisanal Wheat Bun", priceAdd: 15 }
      ]
    },
    "paneer-pizza": {
      name: "Paneer Tikka Pizza",
      basePrice: 320,
      hasSize: true,
      hasCrust: true,
      sizes: [
        { name: "Personal 8\"", priceAdd: 0 },
        { name: "Medium 10\"", priceAdd: 80 },
        { name: "Large 12\"", priceAdd: 150 }
      ],
      crusts: [
        { name: "Classic Italian Thin Crust", priceAdd: 0 },
        { name: "Pan Thick Crust", priceAdd: 30 },
        { name: "Gourmet Cheese Burst Crust", priceAdd: 60 }
      ],
      addons: [
        { name: "Extra Mozzarella Cheese", priceAdd: 40 },
        { name: "Extra Smoky Paneer Cubes", priceAdd: 50 },
        { name: "Fresh Sauteed Mushrooms", priceAdd: 30 }
      ]
    },
    "cold-coffee": {
      name: "Classic Cold Coffee",
      basePrice: 170,
      hasSize: true,
      hasCrust: false,
      sizes: [
        { name: "Regular Tumbler (300ml)", priceAdd: 0 },
        { name: "Tall Glass (450ml)", priceAdd: 40 }
      ],
      addons: [
        { name: "Substitute Oats Milk", priceAdd: 30 },
        { name: "Add Double Espresso Shot", priceAdd: 40 },
        { name: "Extra Scoop Vanilla Gelato", priceAdd: 30 }
      ]
    },
    "artisan-cappuccino": {
      name: "Artisan Cappuccino",
      basePrice: 140,
      hasSize: true,
      hasCrust: false,
      sizes: [
        { name: "Regular Mug", priceAdd: 0 },
        { name: "Grandé Mug", priceAdd: 30 }
      ],
      addons: [
        { name: "Substitute Almond Milk", priceAdd: 30 },
        { name: "Add Premium Organic Honey", priceAdd: 15 },
        { name: "Drizzle Hot Caramel", priceAdd: 20 }
      ]
    }
  };

  const customizationModal = document.getElementById('customizationModal');
  const customModalCloseBtn = document.getElementById('customModalCloseBtn');
  const customizationForm = document.getElementById('customizationForm');
  const customItemName = document.getElementById('customItemName');
  const customItemBaseInfo = document.getElementById('customItemBaseInfo');
  
  const sizeOptionsBlock = document.getElementById('sizeOptionsBlock');
  const crustOptionsBlock = document.getElementById('crustOptionsBlock');
  const addonsOptionsBlock = document.getElementById('addonsOptionsBlock');
  
  const customSelectionSummary = document.getElementById('customSelectionSummary');
  const addCustomizedToCartBtn = document.getElementById('addCustomizedToCartBtn');

  let activeCustomProductId = null;
  let activeCustomProductData = null;

  // Open Customization Modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-custom-trigger')) {
      e.preventDefault();
      
      const itemRow = e.target.closest('.bistro-menu-item');
      if (!itemRow) return;

      const productId = itemRow.getAttribute('data-item-id');
      const dbProduct = customDb[productId];
      
      if (!dbProduct) {
        // Fallback to standard checkout if not in customization DB
        const pName = itemRow.getAttribute('data-item-name');
        const pPrice = itemRow.getAttribute('data-item-price');
        addToCart(productId, pName, pPrice);
        return;
      }

      activeCustomProductId = productId;
      activeCustomProductData = dbProduct;

      // Populate Modal details
      customItemName.textContent = `Customize ${dbProduct.name}`;
      customItemBaseInfo.textContent = `Base Price: ₹${dbProduct.basePrice}`;

      // Clear blocks
      sizeOptionsBlock.style.display = 'none';
      crustOptionsBlock.style.display = 'none';
      addonsOptionsBlock.style.display = 'none';

      const sizeGroup = sizeOptionsBlock.querySelector('.custom-radio-group');
      const crustGroup = crustOptionsBlock.querySelector('.custom-radio-group');
      const addonsGroup = addonsOptionsBlock.querySelector('.custom-checkbox-group');

      sizeGroup.innerHTML = '';
      crustGroup.innerHTML = '';
      addonsGroup.innerHTML = '';

      // Populate Sizes
      if (dbProduct.hasSize && dbProduct.sizes) {
        sizeOptionsBlock.style.display = 'block';
        dbProduct.sizes.forEach((s, idx) => {
          const isSelected = idx === 0;
          sizeGroup.innerHTML += `
            <label class="custom-btn-option ${isSelected ? 'selected' : ''}">
              <input type="radio" name="customSize" value="${s.name}" data-price="${s.priceAdd}" ${isSelected ? 'checked' : ''}>
              ${s.name} ${s.priceAdd > 0 ? `(+₹${s.priceAdd})` : ''}
            </label>
          `;
        });
      }

      // Populate Crusts
      if (dbProduct.hasCrust && dbProduct.crusts) {
        crustOptionsBlock.style.display = 'block';
        dbProduct.crusts.forEach((c, idx) => {
          const isSelected = idx === 0;
          crustGroup.innerHTML += `
            <label class="custom-btn-option ${isSelected ? 'selected' : ''}">
              <input type="radio" name="customCrust" value="${c.name}" data-price="${c.priceAdd}" ${isSelected ? 'checked' : ''}>
              ${c.name} ${c.priceAdd > 0 ? `(+₹${c.priceAdd})` : ''}
            </label>
          `;
        });
      }

      // Populate Addons
      if (dbProduct.addons && dbProduct.addons.length > 0) {
        addonsOptionsBlock.style.display = 'block';
        dbProduct.addons.forEach(a => {
          addonsGroup.innerHTML += `
            <label class="custom-btn-option">
              <input type="checkbox" name="customAddons" value="${a.name}" data-price="${a.priceAdd}">
              ${a.name} ${a.priceAdd > 0 ? `(+₹${a.priceAdd})` : ''}
            </label>
          `;
        });
      }

      calculateCustomPrice();
      customizationModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Calculate customized item price dynamically
  const calculateCustomPrice = () => {
    if (!activeCustomProductData) return;

    let totalPrice = activeCustomProductData.basePrice;
    let descParts = [];

    // Checked size
    const checkedSizeInput = customizationForm.querySelector('input[name="customSize"]:checked');
    if (checkedSizeInput) {
      totalPrice += parseInt(checkedSizeInput.getAttribute('data-price')) || 0;
      descParts.push(checkedSizeInput.value);
    }

    // Checked crust
    const checkedCrustInput = customizationForm.querySelector('input[name="customCrust"]:checked');
    if (checkedCrustInput) {
      totalPrice += parseInt(checkedCrustInput.getAttribute('data-price')) || 0;
      descParts.push(checkedCrustInput.value);
    }

    // Checked addons
    const checkedAddons = customizationForm.querySelectorAll('input[name="customAddons"]:checked');
    checkedAddons.forEach(a => {
      totalPrice += parseInt(a.getAttribute('data-price')) || 0;
      descParts.push(a.value);
    });

    // Update displays
    const summaryText = descParts.length > 0 ? descParts.join(', ') : 'Standard';
    customSelectionSummary.textContent = summaryText;
    addCustomizedToCartBtn.textContent = `Add Custom to Cart (₹${totalPrice})`;
    addCustomizedToCartBtn.setAttribute('data-calculated-price', totalPrice);
    addCustomizedToCartBtn.setAttribute('data-calculated-summary', summaryText);
  };

  // Option select trigger highlighting
  if (customizationForm) {
    customizationForm.addEventListener('change', (e) => {
      const target = e.target;
      const label = target.closest('.custom-btn-option');
      
      if (target.type === 'radio') {
        const siblingLabels = target.closest('.custom-radio-group').querySelectorAll('.custom-btn-option');
        siblingLabels.forEach(l => l.classList.remove('selected'));
        if (label) label.classList.add('selected');
      } else if (target.type === 'checkbox') {
        if (label) label.classList.toggle('selected', target.checked);
      }

      calculateCustomPrice();
    });

    // Submit Customization to Cart
    customizationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const totalPrice = parseInt(addCustomizedToCartBtn.getAttribute('data-calculated-price')) || activeCustomProductData.basePrice;
      const customSummary = addCustomizedToCartBtn.getAttribute('data-calculated-summary') || 'Standard';

      const finalName = `${activeCustomProductData.name} (${customSummary})`;
      const finalId = `${activeCustomProductId}-${customSummary.replace(/[^a-zA-Z0-9]/g, '')}`;

      addToCart(finalId, finalName, totalPrice);
      closeCustomModal();
    });
  }

  const closeCustomModal = () => {
    if (customizationModal) {
      customizationModal.classList.remove('active');
      document.body.style.overflow = '';
      activeCustomProductId = null;
      activeCustomProductData = null;
      if (customizationForm) customizationForm.reset();
    }
  };

  if (customModalCloseBtn) customModalCloseBtn.addEventListener('click', closeCustomModal);
  if (customizationModal) {
    customizationModal.addEventListener('click', (e) => {
      if (e.target === customizationModal) {
        closeCustomModal();
      }
    });
  }

});
