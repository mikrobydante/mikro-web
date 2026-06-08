// ✅ src/modules/raycasterSystem.js
import * as THREE from 'three';
import { playAction, hasAction } from '../animation/mixer.js';
import { mixers } from '../animation/mixer.js';
import { playSound } from './audioSystem.js';
import {
  initCursorBand,
  showCursorBand,
  hideCursorBand,
  flashCursorBand,
} from './cursorEffects.js';

let scene, camera, domEl;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let hovered = false;
let lastClientX = 0;
let lastClientY = 0;

const triggers = {};

export function initRaycaster(_scene, _camera, _domEl) {
  scene = _scene;
  camera = _camera;
  domEl = _domEl;

  scene.traverse((o) => {
    if (o.isMesh && o.name.toLowerCase().includes('-trigger')) {
      triggers[o.name.toLowerCase()] = o;
      console.log('✅ Trigger found:', o.name);
    }
  });

  initCursorBand();

  domEl.addEventListener('pointermove', onPointerMove);
  domEl.addEventListener('pointerdown', onPointerDown);
  domEl.addEventListener('click', onClick);

  domEl.addEventListener('pointerleave', resetHover);
  domEl.addEventListener('pointerup', resetHover);
  domEl.addEventListener('touchend', resetHover);

  console.log('🧩 Raycaster initialized with triggers:', Object.keys(triggers));
}

function updatePointerFromEvent(event) {
  const rect = domEl.getBoundingClientRect();

  lastClientX = event.clientX;
  lastClientY = event.clientY;

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function getHitName() {
  raycaster.setFromCamera(pointer, camera);

  for (const key in triggers) {
    const hits = raycaster.intersectObject(triggers[key], true);

    if (hits.length) {
      return key;
    }
  }

  return null;
}

function onPointerDown(event) {
  updatePointerFromEvent(event);
  updateHover();
}

function onPointerMove(event) {
  updatePointerFromEvent(event);
  updateHover();
}

function onClick(event) {
  updatePointerFromEvent(event);

  const hitName = getHitName();

  if (!hitName) {
    resetHover();
    return;
  }

  switch (hitName) {
    case 'mesh-belly-trigger':
      playAnimationSet('laugh');
      flashCursorBand('HA!', lastClientX, lastClientY);
      break;

    case 'mesh-nose-trigger':
      playAnimationSet('sneeze');
      flashCursorBand('ACHÚ!', lastClientX, lastClientY);
      break;

    default:
      console.log('⚪ Trigger sin acción asignada:', hitName);
  }

  resetHover();
}

function updateHover() {
  const hitName = getHitName();

  if (hitName && !hovered) {
    hovered = true;
    showCursorBand(lastClientX, lastClientY);
  } else if (!hitName && hovered) {
    resetHover();
  }
}

function resetHover() {
  hovered = false;
  hideCursorBand();
}

function playAnimationSet(type) {
  const base = `body-${type}-main`;
  const face = `face-${type}-main-keyshape`;
  const mouth = `mouth-${type}-main-keyshape`;

  if (mixers.body && hasAction(base)) playAction(base);
  if (mixers.face && hasAction(face)) playAction(face);

  if (mixers.mouth && hasAction(mouth)) {
    playAction(mouth);
  } else {
    console.log(`ℹ️ No mouth clip found for: ${mouth}`);
  }

  if (type !== 'idle') {
    playSound(`${base}.mp3`);
  } else {
    console.log('🎧 Idle animation — no sound played.');
  }
}