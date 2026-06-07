import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFD9C0);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, .8, 2.5);

// 👇 Usa el canvas del HTML
const canvas = document.getElementById('canvas');

const renderer = new THREE.WebGLRenderer({
  canvas,            // <- clave
  antialias: true,
  alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ❌ NO hagas appendChild aquí

// Resize
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

export { scene, camera, renderer };
