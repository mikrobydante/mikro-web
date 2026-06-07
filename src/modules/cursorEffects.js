// ✅ src/modules/cursorEffects.js
import { gsap } from 'gsap';

let bandEl = null;
let active = false;

export function initCursorBand() {
  if (bandEl) return;

  bandEl = document.createElement('div');
  bandEl.id = 'cursor-band';
  bandEl.innerHTML = `<span>HIT</span>`;
  Object.assign(bandEl.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '140px',
    height: '42px',
    borderRadius: '24px',
    background: 'rgba(255, 190, 150, 0.12)',
    border: '1px solid rgba(255, 190, 150, 0.45)',
    color: '#000', // ⚫ texto negro
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    letterSpacing: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    opacity: '0',
    mixBlendMode: 'normal', // ⚙️ texto legible sobre cualquier fondo
    zIndex: '9999',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 0 12px rgba(255,190,150,0.25)',
    willChange: 'transform, opacity'
  });

  document.body.appendChild(bandEl);
  gsap.set(bandEl, { scale: 0.9 });

  // Movimiento del cursor
  window.addEventListener('mousemove', (e) => {
    if (!active) return;
    gsap.to(bandEl, {
      x: e.clientX - bandEl.offsetWidth / 2,
      y: e.clientY - bandEl.offsetHeight / 2,
      duration: 0.35,
      ease: 'expo.out'
    });
  });
}

export function showCursorBand() {
  if (!bandEl) initCursorBand();
  active = true;
  const span = bandEl.querySelector('span');
  gsap.killTweensOf([bandEl, span]);
  gsap.to(bandEl, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)' });
  gsap.fromTo(span, { scale: 0.85, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' });
}

export function hideCursorBand() {
  active = false;
  gsap.to(bandEl, { opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.out' });
}

export function flashCursorBand(text = 'HA!') {
  if (!bandEl) return;
  const span = bandEl.querySelector('span');
  const original = span.textContent;
  span.textContent = text;

  gsap.timeline()
    .to(bandEl, { backgroundColor: 'rgba(255, 190, 150, 0.25)', duration: 0.08 })
    .to(bandEl, { backgroundColor: 'rgba(255, 190, 150, 0.12)', duration: 0.25 })
    .fromTo(span, { scale: 1 }, { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' })
    .add(() => { span.textContent = original; });
}
