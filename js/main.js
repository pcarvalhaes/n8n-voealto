/* ==========================================
   VOE ALTO CONSULTORIA — JavaScript Principal
   ========================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================
  // Header Scroll Effect
  // ==========================================
  const header = document.querySelector('.header');

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hide Hero Scroll Indicator
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      scrollIndicator?.classList.add('hidden');
    } else {
      scrollIndicator?.classList.remove('hidden');
    }
  }, { passive: true });

  // ==========================================
  // Mobile Menu
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close-btn');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (menuToggle) {
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (menuToggle) {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================
  // Hero Carousel
  // ==========================================
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');

  let currentSlide = 0;
  let autoplayInterval;
  const autoplayDelay = 6000;

  function goToSlide(index) {
    slides.forEach(slide => {
      slide.classList.remove('active');
      slide.classList.remove('zoomed');
    });
    dots.forEach(dot => {
      dot.classList.remove('active');
      dot.setAttribute('aria-selected', 'false');
    });

    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides[currentSlide].classList.add('active');
    // Pequeno delay para garantir que a transição de zoom inicie após o fade in
    setTimeout(() => {
      if (slides[currentSlide].classList.contains('active')) {
        slides[currentSlide].classList.add('zoomed');
      }
    }, 50);
    dots[currentSlide].classList.add('active');
    dots[currentSlide].setAttribute('aria-selected', 'true');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function startAutoplay() { autoplayInterval = setInterval(nextSlide, autoplayDelay); }
  function stopAutoplay() { clearInterval(autoplayInterval); }

  if (slides.length > 0) {
    goToSlide(0);
    startAutoplay();

    dots.forEach((dot, index) => {
      dot.addEventListener('click', function () {
        stopAutoplay();
        goToSlide(index);
        startAutoplay();
      });
    });

    // Removido stopAutoplay no mouseenter para manter movimento contínuo
    /*
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
    }
    */

    // Touch/swipe support
    let touchStartX = 0;
    const heroEl = document.querySelector('.hero-slides');
    if (heroEl) {
      heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
      heroEl.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          stopAutoplay();
          if (diff > 0) nextSlide(); else goToSlide(currentSlide - 1);
          startAutoplay();
        }
      }, { passive: true });
    }
  }

  // ==========================================
  // Active Navigation Link (Intersection Observer)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === (`#${id}`));
        });
      }
    });
  }, { rootMargin: '-30% 0px -70% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  // ==========================================
  // Scroll Reveal Animation
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // Animated Counters (Metrics Strip)
  // ==========================================
  const counterElements = document.querySelectorAll('.metric-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  // ==========================================
  // Custom Autocomplete (IBGE API)
  // ==========================================
  const estadoInput = document.getElementById('estado');
  const estadoSigla = document.getElementById('estado-sigla');
  const estadoList = document.getElementById('estado-list');
  const cidadeInput = document.getElementById('cidade');
  const cidadesList = document.getElementById('cidades-list');

  function removeAccents(str) {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  let estadosData = [];
  let municipiosData = [];

  if (estadoInput && estadoList && cidadeInput && cidadesList) {
    function buildList(listEl, items, isEstado) {
      listEl.innerHTML = '';
      if (items.length === 0) {
        listEl.classList.remove('active');
        return;
      }
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.nome;
        li.setAttribute('role', 'option');
        li.addEventListener('click', function () {
          if (isEstado) {
            estadoInput.value = item.nome;
            estadoSigla.value = item.sigla;
            estadoList.classList.remove('active');
            cidadeInput.value = '';
            cidadeInput.disabled = true;
            municipiosData = [];
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${item.sigla}/municipios?orderBy=nome`)
              .then(r => r.json())
              .then(municipios => {
                municipiosData = municipios;
                cidadeInput.disabled = false;
              })
              .catch(err => console.error('Erro municípios:', err));
          } else {
            cidadeInput.value = item.nome;
            cidadesList.classList.remove('active');
          }
        });
        listEl.appendChild(li);
      });
      listEl.classList.add('active');
    }

    estadoInput.addEventListener('input', function () {
      const val = removeAccents(this.value);
      if (!this.value) {
        cidadeInput.value = '';
        cidadeInput.disabled = true;
        estadoSigla.value = '';
        municipiosData = [];
        estadoList.classList.remove('active');
        return;
      }
      const filtered = estadosData.filter(e => removeAccents(e.nome).includes(val));
      buildList(estadoList, filtered, true);
    });

    estadoInput.addEventListener('focus', function () {
      if (estadosData.length > 0) buildList(estadoList, estadosData, true);
    });

    cidadeInput.addEventListener('input', function () {
      const val = removeAccents(this.value);
      if (!val) { cidadesList.classList.remove('active'); return; }
      const filtered = municipiosData.filter(m => removeAccents(m.nome).includes(val));
      buildList(cidadesList, filtered, false);
    });

    cidadeInput.addEventListener('focus', function () {
      if (municipiosData.length > 0) buildList(cidadesList, municipiosData, false);
    });

    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(r => r.json())
      .then(estados => { estadosData = estados; })
      .catch(err => console.error('Erro estados:', err));

    document.addEventListener('click', function (e) {
      if (e.target !== estadoInput) estadoList.classList.remove('active');
      if (e.target !== cidadeInput) cidadesList.classList.remove('active');
    });
  }

  // ==========================================
  // Telefone Mask
  // ==========================================
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', function (e) {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      if (!x[2]) {
        e.target.value = x[1] ? '(' + x[1] : '';
      } else {
        e.target.value = '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
      }
    });
  }

  // ==========================================
  // Form Handling — Webhook
  // ==========================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // ── Single source of truth for the endpoint ──────────────────────────
      const WEBHOOK_URL = 'https://n8n-voealto-form.onrender.com/webhook/voealtoconsultoria-lead';

      // ── UI references ────────────────────────────────────────────────────
      const submitBtn    = document.getElementById('form-submit-btn');
      const btnText      = submitBtn.querySelector('.btn-text');
      const originalText = btnText ? btnText.textContent : submitBtn.textContent;

      // Remove any previous inline error
      const oldError = contactForm.querySelector('.form-error-inline');
      if (oldError) oldError.remove();

      // ── Loading state ────────────────────────────────────────────────────
      if (btnText) btnText.textContent = 'Enviando...';
      else submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.8';

      // ── Build JSON payload ───────────────────────────────────────────────
      const rawPhone = (document.getElementById('telefone')?.value ?? '').replace(/\D/g, '');
      const payload = {
        name:         document.getElementById('nome')?.value?.trim()    ?? '',
        phone:        rawPhone,
        email:        document.getElementById('email')?.value?.trim()   ?? '',
        state:        document.getElementById('estado')?.value?.trim()  ?? '',
        city:         document.getElementById('cidade')?.value?.trim()  ?? '',
        service:      document.getElementById('servico')?.value         ?? '',
        message:      document.getElementById('mensagem')?.value?.trim() ?? '',
        source:       'voealtoconsultoria.com.br',
        submitted_at: new Date().toISOString()
      };

      // ── Timeout via AbortController (10 s) ──────────────────────────────
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(WEBHOOK_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
          signal:  controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          // ── Success: show existing modal ─────────────────────────────────
          const successModal = document.getElementById('success-modal');
          if (successModal) successModal.classList.add('active');
          contactForm.reset();
          if (cidadeInput) {
            cidadeInput.disabled = true;
            municipiosData = [];
          }
        } else {
          // ── 4xx / 5xx: show inline error ─────────────────────────────────
          showInlineError();
        }
      } catch (_err) {
        // ── Network error or timeout: show inline error ───────────────────
        clearTimeout(timeoutId);
        showInlineError();
      } finally {
        // ── Always restore button ─────────────────────────────────────────
        if (btnText) btnText.textContent = originalText;
        else submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      }

      // ── Helper: inject inline error message below the submit button ──────
      function showInlineError() {
        const errEl = document.createElement('p');
        errEl.className = 'form-error-inline';
        errEl.style.cssText = [
          'margin-top: 0.75rem',
          'font-size: 0.875rem',
          'color: #e05252',
          'line-height: 1.5'
        ].join('; ');
        errEl.innerHTML =
          'Ops! Algo deu errado. Tente novamente ou nos chame no ' +
          '<a href="https://wa.me/5511976187428" target="_blank" rel="noopener noreferrer" ' +
          'style="color: #25d366; font-weight: 600; text-decoration: underline;">WhatsApp</a>.';
        submitBtn.insertAdjacentElement('afterend', errEl);
      }
    });
  }

  // Modal close
  const modalBtn = document.getElementById('modal-ok-btn');
  if (modalBtn) {
    modalBtn.addEventListener('click', () => {
      const modal = document.getElementById('success-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  // Close modal on overlay click
  const successModal = document.getElementById('success-modal');
  if (successModal) {
    successModal.addEventListener('click', function (e) {
      if (e.target === successModal) successModal.classList.remove('active');
    });
  }

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

});
