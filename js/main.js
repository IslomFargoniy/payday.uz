/**
 * PayDay Landing Page & panel.payday.uz Interactive Scripts
 * Pure Vanilla JavaScript (Zero Dependencies, Ultra Fast)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initPricingCalculator();
  initFaqAccordion();
  initLiveDashboard();
  initContactForm();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when clicking on any nav link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Smooth Scroll & Active Nav Spy
   ========================================================================== */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id], div[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   4. Pricing Calculator
   ========================================================================== */
function initPricingCalculator() {
  const rangeInput = document.getElementById('employeeRange');
  const countDisplay = document.getElementById('employeeCountDisplay');
  const priceDisplay = document.getElementById('calculatedPriceDisplay');

  if (!rangeInput || !countDisplay || !priceDisplay) return;

  const updatePrice = () => {
    const count = parseInt(rangeInput.value, 10);
    countDisplay.textContent = `${count} nafar xodim`;

    let basePricePerEmp = 9000; // UZS per employee/month
    if (count > 50) basePricePerEmp = 7500;
    if (count > 100) basePricePerEmp = 6000;
    if (count > 250) basePricePerEmp = 5000;

    const total = count * basePricePerEmp;
    priceDisplay.textContent = `${total.toLocaleString('uz-UZ')} so'm / oy`;
  };

  rangeInput.addEventListener('input', updatePrice);
  updatePrice();
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other open items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   6. Live Dashboard Simulation (Real-time Clock & Feed)
   ========================================================================== */
function initLiveDashboard() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  const updateClock = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    clockEl.textContent = timeStr;
  };

  setInterval(updateClock, 1000);
  updateClock();
}

/* ==========================================================================
   7. Demo / Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('demoForm');
  const modal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('closeModalBtn');
  const modalUserName = document.getElementById('modalUserName');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName')?.value || 'Hurmatli mijoz';
    const phone = document.getElementById('formPhone')?.value || '';
    const company = document.getElementById('formCompany')?.value || '';
    const employees = document.getElementById('formEmployees')?.value || '10-30';
    const device = document.getElementById('formDevice')?.value || 'Hikvision Terminal';

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg> Yuborilmoqda...
      `;
    }

    // Simulate async API call / Telegram Bot submission
    setTimeout(() => {
      if (modalUserName) modalUserName.textContent = name;
      modal.classList.add('active');
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          Ariza yuborish
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    }, 900);
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}
