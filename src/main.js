// ✅ src/main.js
import * as THREE from 'three';
import { scene, camera, renderer } from './core/scene.js';
import { createLights } from './core/lights.js';
import { createToonMaterial } from './shaders/toonShader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { setupButtons } from './ui/buttons.js';
import { handleButton } from './modules/buttonsMode.js';
import { initAudio } from './modules/audioSystem.js';
import { setupMixer, updateMixers } from './animation/mixer.js';
import { initGadgets } from './modules/gadgetsSystem.js';
import { initRaycaster } from './modules/raycasterSystem.js';
import './style.css';

// ------------------------------------------------------
// 🎛️ CAMERA & CONTROLS
// ------------------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = true;
controls.panSpeed = 0.4;
controls.minDistance = 1.5;
controls.maxDistance = 4.0;
controls.target.set(0, 0.49, 0);
controls.maxPolarAngle = Math.PI / 2;
controls.update();

// ------------------------------------------------------
// 💡 LIGHTS
// ------------------------------------------------------
createLights(scene);

// ------------------------------------------------------
// 🔊 AUDIO
// ------------------------------------------------------
initAudio(camera);

// ------------------------------------------------------
// 🧩 INTERACTIVE BUTTONS
// ------------------------------------------------------
setupButtons(handleButton);

// ------------------------------------------------------
// 👁️ HIDE CONTROLS WHEN LEAVING CHARACTER SECTION
// ------------------------------------------------------
function updateControlsVisibility() {
  const controlsUI = document.querySelector('#controls-ui');
  if (!controlsUI) return;

  if (window.scrollY > window.innerHeight * 0.35) {
    controlsUI.style.opacity = '0';
    controlsUI.style.pointerEvents = 'none';
    controlsUI.style.transform = 'translateX(-50%) translateY(24px)';
  } else {
    controlsUI.style.opacity = '1';
    controlsUI.style.pointerEvents = 'auto';
    controlsUI.style.transform = 'translateX(-50%) translateY(0)';
  }
}

window.addEventListener('scroll', updateControlsVisibility);
window.addEventListener('hashchange', updateControlsVisibility);
window.addEventListener('load', updateControlsVisibility);
setTimeout(updateControlsVisibility, 300);

// ------------------------------------------------------
// 🌫️ SHADOW RECEIVER FLOOR
// ------------------------------------------------------
const shadowGround = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.ShadowMaterial({ opacity: 0.3 })
);

shadowGround.rotation.x = -Math.PI / 2;
shadowGround.position.y = 0;
shadowGround.receiveShadow = true;
scene.add(shadowGround);

// ------------------------------------------------------
// 🐣 LOAD MAIN MODEL
// ------------------------------------------------------
const loader = new GLTFLoader();
const texturePath = '/textures/atlas-pollito.jpg';

loader.load('/models/pollito-mvp-v3.glb', (gltf) => {
  const model = gltf.scene;

  console.log('🔍 Listing all meshes inside GLB...');
  model.traverse((o) => {
    if (o.isMesh) console.log('🧩 Mesh found:', o.name);
  });

  model.traverse((child) => {
    if (child.isMesh && child.name.endsWith('-trigger')) {
      child.visible = false;
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });

  new THREE.TextureLoader().load(texturePath, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.flipY = false;

    const toonMaterial = createToonMaterial(texture);

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;
        child.material = toonMaterial;
      }
    });

    scene.add(model);

    window.scene = scene;
    window.model = model;

    setupMixer(gltf);
    initGadgets(model);
    initRaycaster(scene, camera, renderer.domElement);

    animate();
  });
});

// ------------------------------------------------------
// 🔁 MAIN RENDER LOOP
// ------------------------------------------------------
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  updateMixers(delta);

  controls.update();
  renderer.render(scene, camera);
}