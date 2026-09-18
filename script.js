// Sarfzo Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-links a, .drawer-cta');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    }

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Image Gallery Switches
  const setupGallery = (galleryId, mainImgId) => {
    const thumbs = document.querySelectorAll(`#${galleryId} .thumb-btn`);
    const mainImg = document.getElementById(mainImgId);
    if (!mainImg || thumbs.length === 0) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const newSrc = thumb.getAttribute('data-src');
        if (!newSrc || !mainImg) return;

        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 150);
      });
    });
  };

  setupGallery('motion-light-gallery', 'motion-light-main');
  setupGallery('mirror-clock-gallery', 'mirror-clock-main');

  // Fade-up Scroll Reveal Animations
  const fadeUpElements = document.querySelectorAll('.fade-up');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeUpElements.forEach(el => scrollObserver.observe(el));

  // ========================================================
  // MONOCHROME TOP-DOWN HOUSE MODEL CURSOR SIMULATOR LOGIC
  // ========================================================
  const wrapper = document.getElementById('floorplan-wrapper');
  const tracker = document.getElementById('cursor-person-tracker');
  const statusMsg = document.getElementById('sim-status-msg');

  // Initial 3 pre-placed lights on the floorplan (SVG viewBox coordinates 1000x600)
  let lights = [
    { id: 1, name: 'Closet & Wardrobe', x: 200, y: 150, radius: 160 },
    { id: 2, name: 'Main Hallway', x: 500, y: 300, radius: 170 },
    { id: 3, name: 'Master Bedroom', x: 820, y: 170, radius: 160 }
  ];

  const lightElements = {
    1: {
      glow: document.getElementById('light-glow-1'),
      sensor: document.getElementById('light-sensor-1'),
      ring: document.getElementById('light-ring-1'),
      statusDot: document.getElementById('dot-status-1'),
      label: document.getElementById('status-txt-1')
    },
    2: {
      glow: document.getElementById('light-glow-2'),
      sensor: document.getElementById('light-sensor-2'),
      ring: document.getElementById('light-ring-2'),
      statusDot: document.getElementById('dot-status-2'),
      label: document.getElementById('status-txt-2')
    },
    3: {
      glow: document.getElementById('light-glow-3'),
      sensor: document.getElementById('light-sensor-3'),
      ring: document.getElementById('light-ring-3'),
      statusDot: document.getElementById('dot-status-3'),
      label: document.getElementById('status-txt-3')
    }
  };

  // Convert client cursor mouse event to SVG viewBox (1000 x 600) coordinates
  const getSVGCoordinates = (e) => {
    if (!wrapper) return { x: -1000, y: -1000, pxX: 0, pxY: 0 };
    const rect = wrapper.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const pxX = clientX - rect.left;
    const pxY = clientY - rect.top;

    const svgX = (pxX / rect.width) * 1000;
    const svgY = (pxY / rect.height) * 600;

    return { x: svgX, y: svgY, pxX, pxY };
  };

  const updateProximity = (e) => {
    if (!wrapper) return;
    const coords = getSVGCoordinates(e);
    
    // Position the visual cursor tracker element
    if (tracker) {
      tracker.style.opacity = '1';
      tracker.style.transform = `translate(${coords.pxX}px, ${coords.pxY}px)`;
    }

    let activeCount = 0;

    lights.forEach(light => {
      const el = lightElements[light.id];
      if (!el || !el.glow) return;

      const dist = Math.hypot(coords.x - light.x, coords.y - light.y);

      if (dist < light.radius) {
        activeCount++;
        // Proximity calculation: 1.0 when right at the center, down to 0.0 at the boundary
        const prox = 1 - (dist / light.radius);
        const opacity = 0.2 + (prox * 0.8); // High-contrast brightness boost
        
        // Bright monochrome warm/white illumination
        el.glow.style.opacity = opacity.toFixed(2);
        el.glow.setAttribute('r', 120 + (prox * 40));

        if (el.sensor) {
          el.sensor.setAttribute('fill', '#FFFFFF');
          el.sensor.setAttribute('stroke', '#FFFFFF');
          el.sensor.setAttribute('stroke-width', '4');
        }

        if (el.ring) {
          el.ring.style.opacity = '0.9';
          el.ring.setAttribute('stroke', '#FFFFFF');
        }

        if (el.statusDot) el.statusDot.classList.add('active');
        if (el.label) el.label.textContent = `${light.name}: ACTIVE (${Math.round(prox * 100)}%)`;
      } else {
        // Outside range -> Dim down smoothly
        el.glow.style.opacity = '0.04';
        el.glow.setAttribute('r', '110');

        if (el.sensor) {
          el.sensor.setAttribute('fill', '#A1A1AA');
          el.sensor.setAttribute('stroke', '#444444');
          el.sensor.setAttribute('stroke-width', '2');
        }

        if (el.ring) {
          el.ring.style.opacity = '0.2';
          el.ring.setAttribute('stroke', 'rgba(255,255,255,0.2)');
        }

        if (el.statusDot) el.statusDot.classList.remove('active');
        if (el.label) el.label.textContent = `${light.name}: Standby`;
      }
    });

    if (statusMsg) {
      if (activeCount > 0) {
        statusMsg.textContent = `🚶‍♂️ Motion detected! ${activeCount} ZO'LIGHT sensor(s) glowing bright.`;
      } else {
        statusMsg.textContent = `🌙 Walking through dark areas. Move cursor close to any ZO'LIGHT to trigger brightness!`;
      }
    }
  };

  if (wrapper) {
    wrapper.addEventListener('mousemove', updateProximity);
    wrapper.addEventListener('touchmove', updateProximity);

    wrapper.addEventListener('mouseleave', () => {
      if (tracker) tracker.style.opacity = '0';
      // Dim all lights on leave
      lights.forEach(light => {
        const el = lightElements[light.id];
        if (el && el.glow) el.glow.style.opacity = '0.04';
        if (el && el.statusDot) el.statusDot.classList.remove('active');
        if (el && el.label) el.label.textContent = `${light.name}: Standby`;
      });
      if (statusMsg) statusMsg.textContent = `Move your cursor over the home layout to simulate walking.`;
    });
  }

  // ========================================================
  // PACKAGE SELECTOR & DYNAMIC WHATSAPP ORDER LINK LOGIC
  // ========================================================
  const initPackSelector = (sectionSelector, orderBtnId, productName) => {
    const section = document.querySelector(sectionSelector);
    const orderBtn = document.getElementById(orderBtnId);
    if (!orderBtn) return;

    const packCards = section ? section.querySelectorAll('.pack-card') : document.querySelectorAll('.pack-card');
    if (packCards.length === 0) return;

    const updateWhatsAppLink = (selectedCard) => {
      const packPrice = selectedCard.getAttribute('data-price') || '549';
      const packLabel = selectedCard.getAttribute('data-label') || '1 Pc';
      const currency = '₹';

      const messageText = `Hi Sarfzo! I'd like to order ${packLabel} ${productName} (${currency}${packPrice} Doorstep Delivery Included) (Delivery to India).`;
      const encodedMsg = encodeURIComponent(messageText);

      orderBtn.setAttribute('href', `https://wa.me/971509667935?text=${encodedMsg}`);
      orderBtn.innerHTML = `<i data-lucide="shopping-bag"></i> Order ${packLabel} via WhatsApp (${currency}${packPrice})`;

      if (window.lucide) {
        lucide.createIcons();
      }
    };

    // Initialize with active card
    const activePack = (section ? section.querySelector('.pack-card.active') : document.querySelector('.pack-card.active')) || packCards[0];
    if (activePack) {
      updateWhatsAppLink(activePack);
    }

    packCards.forEach(card => {
      card.addEventListener('click', () => {
        packCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        updateWhatsAppLink(card);
      });
    });
  };

  initPackSelector('#motion-light', 'order-motion-light-btn', 'Motion Sensor Light');
  initPackSelector('#mirror-clock', 'order-mirror-clock-btn', 'LED Mirror Clock');
});
