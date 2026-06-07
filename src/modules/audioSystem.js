// ✅ src/modules/audioSystem.js
import * as THREE from 'three';

let listener;
const audioLoader = new THREE.AudioLoader();
const sounds = {};

// ------------------------------------------------------
// 🎧 INICIALIZAR AUDIO (se llama desde main.js)
// ------------------------------------------------------
export function initAudio(camera) {
  listener = new THREE.AudioListener();
  camera.add(listener);
  console.log('🔊 Audio system initialized');
}

// ------------------------------------------------------
// ▶️ REPRODUCIR SONIDO
// ------------------------------------------------------
export function playSound(fileName) {
  // 🚫 Evitar sonidos "idle"
  if (fileName.includes('idle')) {
    console.log('🎧 Idle animation — no sound loaded.');
    return;
  }

  const path = `/sounds/${fileName}`;
  const existing = sounds[path];

  // ✅ Si ya está cargado, reproducir de nuevo
  if (existing) {
    existing.play();
    return;
  }

  // 🔄 Cargar nuevo sonido
  const sound = new THREE.Audio(listener);

  audioLoader.load(
    path,
    (buffer) => {
      sound.setBuffer(buffer);
      sound.setVolume(0.8);
      sound.play();
      sounds[path] = sound;
    },
    undefined,
    (err) => {
      console.warn('⚠️ No se pudo cargar el sonido:', path);
    }
  );
}
