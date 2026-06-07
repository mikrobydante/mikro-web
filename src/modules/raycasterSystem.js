// ✅ src/modules/raycasterSystem.js
import { gsap } from 'gsap';
import * as THREE from 'three';
import { playAction, hasAction } from '../animation/mixer.js';
import { mixers } from '../animation/mixer.js';
import { playSound } from './audioSystem.js';
import { initCursorBand, showCursorBand, hideCursorBand, flashCursorBand } from './cursorEffects.js';

let scene, camera, domEl;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let hovered = false;
const triggers = {}; // almacena varios triggers

// ------------------------------------------------------
// 🧩 INICIALIZAR RAYCASTER
// ------------------------------------------------------
export function initRaycaster(_scene, _camera, _domEl) {
  scene = _scene;
  camera = _camera;
  domEl = _domEl;

  // Buscar todos los meshes que incluyan “-trigger”
  scene.traverse((o) => {
    if (o.isMesh && o.name.toLowerCase().includes('-trigger')) {
      triggers[o.name.toLowerCase()] = o;
      console.log('✅ Trigger found:', o.name);
    }
  });

  initCursorBand();

  domEl.addEventListener('pointermove', onPointerMove);
  domEl.addEventListener('click', onClick);

  console.log('🧩 Raycaster initialized with triggers:', Object.keys(triggers));
}

// ------------------------------------------------------
// 🖱️ CLICK EN UN TRIGGER
// ------------------------------------------------------
function onClick() {
  raycaster.setFromCamera(pointer, camera);

  let hitName = null;
  for (const key in triggers) {
    const hits = raycaster.intersectObject(triggers[key], true);
    if (hits.length) {
      hitName = key;
      break;
    }
  }

  if (!hitName) return;

  // 👇 Comportamientos según el trigger detectado
  switch (hitName) {
    case 'mesh-belly-trigger':
      playAnimationSet('laugh');
      flashCursorBand('HA!');
      break;

    case 'mesh-nose-trigger':
      playAnimationSet('sneeze');
      flashCursorBand('ACHÚ!');
      break;

    default:
      console.log('⚪ Trigger sin acción asignada:', hitName);
  }
}

// ------------------------------------------------------
// 🟡 EFECTO HOVER (cursor reactivo)
// ------------------------------------------------------
function onPointerMove(event) {
  const rect = domEl.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  updateHover();
}

function updateHover() {
  raycaster.setFromCamera(pointer, camera);

  let hitName = null;
  for (const key in triggers) {
    const hits = raycaster.intersectObject(triggers[key], true);
    if (hits.length) {
      hitName = key;
      break;
    }
  }

  if (hitName && !hovered) {
    hovered = true;
    showCursorBand(); // muestra el halo interactivo
  } else if (!hitName && hovered) {
    hovered = false;
    hideCursorBand(); // oculta el halo
  }
}

// ------------------------------------------------------
// 🎬 REPRODUCIR SET DE ANIMACIÓN
// ------------------------------------------------------
function playAnimationSet(type) {
  const base = `body-${type}-main`;
  const face = `face-${type}-main-keyshape`;
  const mouth = `mouth-${type}-main-keyshape`;

  // ✅ Reproduce solo los clips que existan
  if (mixers.body && hasAction(base)) playAction(base);
  if (mixers.face && hasAction(face)) playAction(face);

  if (mixers.mouth && hasAction(mouth)) {
    playAction(mouth);
  } else {
    console.log(`ℹ️ No mouth clip found for: ${mouth}`);
  }

  // 🔊 Reproduce sonido solo si no es "idle"
  if (type !== 'idle') {
    playSound(`${base}.mp3`);
  } else {
    console.log('🎧 Idle animation — no sound played.');
  }
}
