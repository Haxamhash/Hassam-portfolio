// Hassam × Pear-style scroll experience
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 500);
});

// Smooth scroll (Lenis) + GSAP sync
let lenis = null;
if (window.Lenis) {
  lenis = new Lenis({ duration: 1.25, smoothWheel: true });
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}
gsap.registerPlugin(ScrollTrigger);
if (lenis) lenis.on('scroll', ScrollTrigger.update);

// Progress bar
ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: self => { document.getElementById('progress').style.width = (self.progress * 100) + '%'; }
});

// Cursor dot
const dot = document.getElementById('cursorDot');
window.addEventListener('mousemove', e => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; });
document.querySelectorAll('a,button,summary').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.style.width = '34px'; dot.style.height = '34px'; });
  el.addEventListener('mouseleave', () => { dot.style.width = '14px'; dot.style.height = '14px'; });
});

// Hero: curtain reveal on load (Pear opening)
gsap.to('.curtain-l', { xPercent: -102, duration: 1.4, ease: 'power3.inOut', delay: 0.6 });
gsap.to('.curtain-r', { xPercent: 102, duration: 1.4, ease: 'power3.inOut', delay: 0.6 });
gsap.from('.hero-title .line', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 1.1 });
gsap.to('.hero .reveal', { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power2.out', delay: 1.5 });

// Hero bg parallax + zoom on scroll (pinned feel)
gsap.to('.hero-bg img', {
  yPercent: 12, scale: 1.08, ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('.hero-inner', {
  y: -60, opacity: 0.25, ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});

// Generic reveals
document.querySelectorAll('.reveal').forEach(el => {
  if (el.closest('.hero')) return;
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

// Word-by-word serif headings (Contiant-style fill feel)
document.querySelectorAll('.reveal-words').forEach(h => {
  const words = h.textContent.trim().split(/\s+/);
  h.innerHTML = words.map(w => `<span class="w" style="display:inline-block;opacity:.15">${w}</span>`).join(' ');
  gsap.to(h.querySelectorAll('.w'), {
    opacity: 1, stagger: 0.06, ease: 'none',
    scrollTrigger: { trigger: h, start: 'top 82%', end: 'top 38%', scrub: true }
  });
});

// Parallax images
document.querySelectorAll('.parallax-wrap').forEach(wrap => {
  const img = wrap.querySelector('.parallax-img');
  if (!img) return;
  gsap.fromTo(img, { yPercent: -8 }, {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true }
  });
});

// Tree + FAQ bg slow zoom
gsap.fromTo('.tree-bg img', { scale: 1.12 }, {
  scale: 1, ease: 'none',
  scrollTrigger: { trigger: '.tree-sec', start: 'top bottom', end: 'bottom top', scrub: true }
});
gsap.fromTo('.faq-bg img', { yPercent: -8 }, {
  yPercent: 8, ease: 'none',
  scrollTrigger: { trigger: '.faq-sec', start: 'top bottom', end: 'bottom top', scrub: true }
});

// Clouds drift
gsap.to('.c1', { x: -120, ease: 'none', scrollTrigger: { trigger: '.blue-sec', start: 'top bottom', end: 'bottom top', scrub: true } });
gsap.to('.c2', { x: 120, ease: 'none', scrollTrigger: { trigger: '.blue-sec', start: 'top bottom', end: 'bottom top', scrub: true } });

// Floating experience card: gentle tilt + float + halo pulse on scroll
gsap.to('#bigPear', {
  rotation: 2, y: -24, ease: 'none',
  scrollTrigger: { trigger: '.pear-float', start: 'top bottom', end: 'bottom top', scrub: true }
});
gsap.to('#bigPear', { y: '+=16', duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
gsap.to('.halo', { scale: 1.12, opacity: 0.7, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });

// Section pin for pear float (cinematic hold)
ScrollTrigger.create({
  trigger: '.pear-float', start: 'top top', end: '+=60%', pin: true, pinSpacing: true
});

// Constellation stars canvas
(function stars(){
  const c = document.getElementById('stars'); if (!c) return;
  const ctx = c.getContext('2d'); let W, H, pts = [];
  function resize(){ W = c.width = c.offsetWidth; H = c.height = c.offsetHeight;
    pts = Array.from({length: 90}, () => ({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.8+0.4, s: Math.random()*0.3+0.05 }));
  }
  resize(); window.addEventListener('resize', resize);
  (function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => { p.y -= p.s; if (p.y < 0) p.y = H;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
    });
    // constellation lines between near points
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) for (let j = i+1; j < pts.length; j++) {
      const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
      if (dx*dx+dy*dy < 120*120) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
    }
    requestAnimationFrame(draw);
  })();
})();

// Apply form -> mailto (no backend, opens visitor email app)
document.getElementById('applyForm').addEventListener('submit', function(e){
  e.preventDefault();
  const d = new FormData(this);
  const subject = encodeURIComponent('Project inquiry — ' + d.get('need') + ' (via Hassam portfolio)');
  const body = encodeURIComponent('Name: ' + d.get('name') + '\nEmail: ' + d.get('email') + '\nNeed: ' + d.get('need') + '\n\nDetails:\n' + (d.get('details') || ''));
  document.getElementById('formNote').textContent = 'Opening your email app… If nothing opens, please message Hassam directly on Upwork.';
  window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
});

// Anchor smooth via Lenis
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const target = document.querySelector(id); if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -10 }); else target.scrollIntoView({ behavior: 'smooth' });
  });
});
