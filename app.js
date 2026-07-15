// ============================================================
// Scroll controller — single rAF-throttled dispatcher. Modules
// that need to react to scroll position call registerScrollUpdate()
// instead of attaching their own 'scroll' listener, so several
// scroll-driven effects share one requestAnimationFrame tick
// instead of each recomputing on every raw scroll event.
// ============================================================
var scrollUpdaters = [];
function registerScrollUpdate(fn) {
  scrollUpdaters.push(fn);
}
(function initScrollController() {
  var ticking = false;
  function runAll() {
    for (var i = 0; i < scrollUpdaters.length; i++) scrollUpdaters[i]();
    ticking = false;
  }
  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(runAll);
    }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
})();

// ============================================================
// BlurText — reactbits.dev fidelity: word-split, blur+opacity+
// translateY entrance, per-word stagger. Toggles both ways: undoes
// when the heading leaves the viewport (either direction) and
// replays when it re-enters, via a CSS-transition class toggle
// driven by a persistent IntersectionObserver (no unobserve).
// ============================================================
function initBlurText() {
  var els = document.querySelectorAll('.blur-h2');
  els.forEach(function (el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    var words = text.split(' ');
    el.innerHTML = words.map(function (w, i) {
      return '<span class="blur-word" style="transition-delay: ' + (i * 0.2) + 's;">' + w + '</span>';
    }).join(' ');

    var wordEls = el.querySelectorAll('.blur-word');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        wordEls.forEach(function (w) { w.classList.toggle('in-view', entry.isIntersecting); });
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
  });
}

// ============================================================
// ScrollFloat — reactbits.dev fidelity: per-character stagger,
// clipped float-up + fade entrance, smooth ease-out with no
// back/bounce overshoot. Toggles both ways: undoes on exit,
// replays on re-entry (persistent IntersectionObserver).
// ============================================================
function initScrollFloat() {
  var els = document.querySelectorAll('.sf');
  els.forEach(function (el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    Array.from(text).forEach(function (ch, i) {
      var wrap = document.createElement('span');
      wrap.className = 'sf-char-wrap';
      var inner = document.createElement('span');
      inner.className = 'sf-char';
      inner.style.transitionDelay = (i * 0.028) + 's';
      inner.textContent = ch;
      wrap.appendChild(inner);
      el.appendChild(wrap);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        el.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
  });
}

// ============================================================
// FadeContent — fade + slight translateY. Also drives the bigger
// .reveal-mockup entrance (dashboard/card mockups) since both are
// just "toggle is-visible on intersect, with an optional stagger" —
// only the CSS transform differs between the two classes. Toggles
// both ways: undoes on exit, replays on re-entry. Cards that carry
// a data-stagger index (grid items) cascade in with a small
// per-card delay instead of popping in all at once.
// ============================================================
function initFadeContent() {
  var els = document.querySelectorAll('.fade-content, .reveal-mockup');
  var timers = new WeakMap();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      var pending = timers.get(el);
      if (pending) clearTimeout(pending);
      if (entry.isIntersecting) {
        var stagger = el.dataset.stagger ? parseInt(el.dataset.stagger, 10) * 90 : 0;
        var t = setTimeout(function () { el.classList.add('is-visible'); }, stagger);
        timers.set(el, t);
      } else {
        el.classList.remove('is-visible');
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  els.forEach(function (el) { io.observe(el); });
}

// ============================================================
// Scroll-scale pinned heading ("foco" section)
// ============================================================
function initScrollScale() {
  var wrap = document.getElementById('foco');
  var heading = document.getElementById('focoHeading');
  if (!wrap || !heading) return;

  function update() {
    var vh = window.innerHeight;
    var rect = wrap.getBoundingClientRect();
    var total = wrap.offsetHeight - vh;
    var p = total > 0 ? -rect.top / total : 0;
    p = Math.max(0, Math.min(1, p));
    var eased = p * p * (3 - 2 * p);
    var scale = 0.35 + eased * 0.65;
    var opacity = 0.15 + eased * 0.85;
    heading.style.transform = 'scale(' + scale.toFixed(3) + ')';
    heading.style.opacity = opacity.toFixed(3);
  }
  registerScrollUpdate(update);
  update();
}

// ============================================================
// Plans scroll-swap (sticky crossfading panels)
// ============================================================
function initPlansSwap() {
  var pw = document.getElementById('planos');
  if (!pw) return;
  var glow = document.getElementById('planGlow');
  var bar = document.getElementById('planBar');
  var panels = [document.getElementById('planPanel0'), document.getElementById('planPanel1'), document.getElementById('planPanel2')];
  var dots = [document.getElementById('planDot0'), document.getElementById('planDot1'), document.getElementById('planDot2')];
  var labels = [document.getElementById('planLabel0'), document.getElementById('planLabel1'), document.getElementById('planLabel2')];
  var accents = ['#8B5CF6', '#00BFA5', '#a78bfa'];
  var glowAccents = ['rgba(139,92,246,0.27)', 'rgba(0,191,165,0.24)', 'rgba(108,43,217,0.27)'];

  function update() {
    var vh = window.innerHeight;
    var rect = pw.getBoundingClientRect();
    var total = pw.offsetHeight - vh;
    var p = total > 0 ? -rect.top / total : 0;
    p = Math.max(0, Math.min(0.9999, p));
    var idx = Math.min(2, Math.floor(p * 3));

    panels.forEach(function (el, i) {
      if (!el) return;
      var active = i === idx;
      el.style.opacity = active ? '1' : '0';
      el.style.transform = active ? 'translateY(0) scale(1)' : 'translateY(' + (i < idx ? -36 : 36) + 'px) scale(0.96)';
      el.style.pointerEvents = active ? 'auto' : 'none';
    });
    dots.forEach(function (el, i) {
      if (!el) return;
      el.style.background = i === idx ? accents[idx] : 'rgba(255,255,255,0.15)';
      el.style.transform = i === idx ? 'scale(1.4)' : 'scale(1)';
    });
    labels.forEach(function (el, i) {
      if (!el) return;
      el.style.color = i === idx ? '#F1F5F9' : '#64748B';
    });
    if (glow) glow.style.background = 'radial-gradient(circle, ' + glowAccents[idx] + ', transparent 70%)';
    if (bar) bar.style.height = (p * 100).toFixed(1) + '%';
  }
  registerScrollUpdate(update);
  update();
}

// ============================================================
// FAQ accordion (single open item at a time)
// ============================================================
function initFaqAccordion() {
  var list = document.getElementById('faqList');
  if (!list) return;

  function closeItem(item) {
    item.classList.remove('faq-open');
    var answer = item.querySelector('.faq-answer');
    var icon = item.querySelector('.faq-icon');
    answer.style.maxHeight = '0px';
    answer.style.opacity = '0';
    icon.style.transform = 'rotate(0deg)';
    icon.style.color = '#64748B';
  }
  function openItem(item) {
    item.classList.add('faq-open');
    var answer = item.querySelector('.faq-answer');
    var icon = item.querySelector('.faq-icon');
    answer.style.maxHeight = '240px';
    answer.style.opacity = '1';
    icon.style.transform = 'rotate(45deg)';
    icon.style.color = '#8B5CF6';
  }

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.faq-toggle');
    if (!btn) return;
    var item = btn.closest('.faq-item');
    var isOpen = item.classList.contains('faq-open');
    list.querySelectorAll('.faq-item.faq-open').forEach(function (openEl) {
      if (openEl !== item) closeItem(openEl);
    });
    if (isOpen) closeItem(item);
    else openItem(item);
  });
}

// ============================================================
// SpotlightCard — radial glow that follows the cursor over the
// generic card grids (Diferenciais / Seguranca), revealed on hover.
// ============================================================
function initSpotlightCard() {
  var cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(function (card) {
    var overlay = document.createElement('div');
    overlay.className = 'spotlight-overlay';
    card.appendChild(overlay);
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      overlay.style.setProperty('--sx', (e.clientX - rect.left) + 'px');
      overlay.style.setProperty('--sy', (e.clientY - rect.top) + 'px');
    });
  });
}

// ============================================================
// Relatorios pizza chart — progressive per-category draw, scrubbed
// directly to scroll position (not a fixed-duration one-shot): as
// the section scrolls up through the viewport, each category's arc
// grows in turn, and naturally undraws again if the user scrolls
// back up.
// ============================================================
function initPizzaChart() {
  var container = document.getElementById('pizzaChart');
  var section = document.getElementById('relatorios');
  if (!container || !section) return;

  var oldFill = container.querySelector('div');
  if (oldFill) oldFill.remove();

  var categories = [
    { pct: 32, color: '#6C2BD9' },
    { pct: 24, color: '#8B5CF6' },
    { pct: 16, color: '#00BFA5' },
    { pct: 12, color: '#22C55E' },
    { pct: 9,  color: '#a78bfa' },
    { pct: 7,  color: '#64748B' }
  ];

  var strokeW = 72;
  var radius = 150 - strokeW / 2;
  var circumference = 2 * Math.PI * radius;
  var svgNS = 'http://www.w3.org/2000/svg';

  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 300 300');
  svg.style.position = 'absolute';
  svg.style.inset = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.transform = 'rotate(-90deg)';
  svg.style.transformOrigin = '50% 50%';

  var cumulative = 0;
  var arcs = categories.map(function (cat) {
    var len = (cat.pct / 100) * circumference;
    var circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', '150');
    circle.setAttribute('cy', '150');
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', cat.color);
    circle.setAttribute('stroke-width', strokeW);
    circle.setAttribute('stroke-dasharray', '0 ' + circumference.toFixed(2));
    circle.setAttribute('stroke-dashoffset', (-cumulative).toFixed(2));
    svg.appendChild(circle);
    var arc = { el: circle, len: len };
    cumulative += len;
    return arc;
  });

  container.insertBefore(svg, container.firstChild);

  function update() {
    var vh = window.innerHeight;
    var rect = section.getBoundingClientRect();
    var p = (vh - rect.top) / vh;
    p = Math.max(0, Math.min(1, p));
    var n = arcs.length;
    arcs.forEach(function (arc, i) {
      var segStart = i / n, segEnd = (i + 1) / n;
      var local = (p - segStart) / (segEnd - segStart);
      local = Math.max(0, Math.min(1, local));
      var currentLen = local * arc.len;
      arc.el.setAttribute('stroke-dasharray', currentLen.toFixed(2) + ' ' + circumference.toFixed(2));
    });
  }
  registerScrollUpdate(update);
  update();
}

// ============================================================
// Hero load-in — two-stage entrance. Stage 1: the giant "MYBILLS"
// wordmark fades in solid white (0.8s), then drains to its resting
// purple outline (0.7s, starting 0.9s in — timed via CSS transition-
// delay on #heroIntroWord.is-active). Stage 2: once that settles
// (~1.7s total), the rest of the hero (nav, badge, heading, copy,
// CTAs, floating chips) cascades in via the existing .hero-reveal
// stagger. Double rAF so the pre-transition state is guaranteed to
// paint first — otherwise the transition can get skipped entirely.
// rAF is throttled indefinitely on hidden/backgrounded tabs, so a
// setTimeout fallback guarantees both stages still fire rather than
// leaving the hero permanently at opacity:0.
// ============================================================
function initHeroLoadIn() {
  var word = document.getElementById('heroIntroWord');
  var wordStarted = false;
  function startWord() {
    if (wordStarted) return;
    wordStarted = true;
    if (word) word.classList.add('is-active');
  }
  requestAnimationFrame(function () {
    requestAnimationFrame(startWord);
  });
  setTimeout(startWord, 200);

  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    document.body.classList.add('is-loaded');
  }
  setTimeout(reveal, 1700);
}

// ============================================================
// Count-up numbers — the big stat numbers (Wrapped grid, dashboard
// mockup, card limit) tween from 0 to their real value the first
// time they scroll into view, formatted with pt-BR separators via
// toLocaleString. One-shot: unobserves after firing so revisiting
// the section doesn't re-count.
// ============================================================
function formatCountValue(value, decimals) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function animateCount(el) {
  var target = parseFloat(el.dataset.count);
  var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
  var prefix = el.dataset.prefix || '';
  var suffix = el.dataset.suffix || '';
  var duration = el.dataset.duration ? parseInt(el.dataset.duration, 10) : 1400;
  var start = null;

  function step(ts) {
    if (start === null) start = ts;
    var p = Math.min(1, (ts - start) / duration);
    var eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + formatCountValue(target * eased, decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCountUp() {
  var els = document.querySelectorAll('[data-count]');
  els.forEach(function (el) {
    var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    el.textContent = (el.dataset.prefix || '') + formatCountValue(0, decimals) + (el.dataset.suffix || '');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      animateCount(entry.target);
    });
  }, { threshold: 0.4 });
  els.forEach(function (el) { io.observe(el); });
}

// ============================================================
// Magnetic buttons — the two primary CTAs pull gently toward the
// cursor on hover and snap back on leave. Fine-pointer only (no-op
// on touch, where hover doesn't make sense).
// ============================================================
function initMagnetic() {
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
  var strength = 0.35;
  document.querySelectorAll('.magnetic').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = (e.clientX - rect.left - rect.width / 2) * strength;
      var y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transition = 'transform 0.15s ease-out';
      el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform = 'translate(0px,0px)';
    });
  });
}

// ============================================================
// Tilt cards — subtle perspective rotation following the cursor on
// feature/security cards, layered on top of the existing hover
// lift (inline transform wins over the CSS :hover rule while
// active). Fine-pointer only.
// ============================================================
function initTilt() {
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.tilt').forEach(function (el) {
    var max = parseFloat(el.dataset.tiltMax) || 7;
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rx = (0.5 - py) * max * 2;
      var ry = (px - 0.5) * max * 2;
      el.style.transition = 'transform 0.1s ease-out';
      el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// ============================================================
// Nav progress bar — thin gradient fill under the nav tracking
// scroll position through the whole document.
// ============================================================
function initNavProgress() {
  var bar = document.getElementById('navProgress');
  if (!bar) return;
  function update() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct.toFixed(2) + '%';
  }
  registerScrollUpdate(update);
  update();
}

// ============================================================
// Active nav link — highlights whichever nav item's section
// currently sits in a band near the top of the viewport.
// ============================================================
function initActiveNav() {
  var links = document.querySelectorAll('.nav-link');
  if (!links.length) return;
  var map = {};
  links.forEach(function (link) {
    var id = (link.getAttribute('href') || '').replace('#', '');
    if (document.getElementById(id)) map[id] = link;
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = map[entry.target.id];
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
  Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
}

// ============================================================
// Parallax blobs — background glow shapes drift slightly against
// scroll for depth. Each element's own base transform (e.g. the
// translateX/Y used to center it) is preserved via data-base-
// transform so the parallax offset composes with it instead of
// replacing it.
// ============================================================
function initParallaxBlobs() {
  var els = document.querySelectorAll('.parallax-blob');
  if (!els.length) return;
  var items = Array.prototype.map.call(els, function (el) {
    return { el: el, speed: parseFloat(el.dataset.parallax) || 0.1, base: el.dataset.baseTransform || '' };
  });
  function update() {
    var vh = window.innerHeight;
    items.forEach(function (item) {
      var rect = item.el.getBoundingClientRect();
      var offset = (rect.top + rect.height / 2 - vh / 2) * item.speed;
      item.el.style.transform = item.base + ' translateY(' + offset.toFixed(1) + 'px)';
    });
  }
  registerScrollUpdate(update);
  update();
}

// ============================================================
// Mobile nav toggle — hamburger button shows/hides the stacked
// link dropdown below the 768px breakpoint; picking any link
// closes it again so it doesn't stay open after navigating.
// ============================================================
function initNavToggle() {
  var nav = document.getElementById('siteNav');
  var btn = document.getElementById('navToggle');
  if (!nav || !btn) return;
  btn.addEventListener('click', function () {
    nav.classList.toggle('nav-open');
  });
  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('nav-open'); });
  });
}

// ============================================================
// App tour — auto-advancing crossfade between real product
// screenshots, with an Instagram-story-style progress bar per
// tab. Clicking a tab jumps straight to it and restarts the
// timer; the running tab's bar animates via a width transition
// timed to match the auto-advance duration.
// ============================================================
function initTour() {
  var frame = document.getElementById('tourFrame');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tour-tab'));
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.tour-img'));
  if (!frame || !tabs.length || !imgs.length) return;

  var duration = 4500;
  var idx = 0;
  var timer = null;

  function show(i) {
    idx = i;
    tabs.forEach(function (t, ti) { t.classList.toggle('is-active', ti === i); });
    imgs.forEach(function (im, ii) { im.classList.toggle('is-active', ii === i); });
  }

  function playBar() {
    tabs.forEach(function (t) {
      var span = t.querySelector('.tour-tab-bar span');
      span.style.transition = 'none';
      span.style.width = '0%';
    });
    var activeSpan = tabs[idx].querySelector('.tour-tab-bar span');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        activeSpan.style.transition = 'width ' + duration + 'ms linear';
        activeSpan.style.width = '100%';
      });
    });
  }

  function restart() {
    clearTimeout(timer);
    playBar();
    timer = setTimeout(function () {
      show((idx + 1) % tabs.length);
      restart();
    }, duration);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      show(i);
      restart();
    });
  });

  show(0);
  restart();
}

document.addEventListener('DOMContentLoaded', function () {
  initBlurText();
  initScrollFloat();
  initFadeContent();
  initScrollScale();
  initPlansSwap();
  initFaqAccordion();
  initSpotlightCard();
  initPizzaChart();
  initHeroLoadIn();
  initCountUp();
  initMagnetic();
  initTilt();
  initNavProgress();
  initActiveNav();
  initParallaxBlobs();
  initNavToggle();
  initTour();
});
