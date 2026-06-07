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
import { setupMixer, mixers, updateMixers } from './animation/mixer.js'; // ✅ incluye updateMixers
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
// 🐣 LOAD MAIN MODEL (Pollito MVP)
// ------------------------------------------------------
const loader = new GLTFLoader();
const texturePath = '/textures/atlas-pollito.jpg';

loader.load('/models/pollito-mvp-v3.glb', (gltf) => {
  const model = gltf.scene;

  console.log('🔍 Listing all meshes inside GLB...');
  model.traverse((o) => {
    if (o.isMesh) console.log('🧩 Mesh found:', o.name);
  });

  // Hacer invisibles los triggers pero activos para interacción
  model.traverse((child) => {
    if (child.isMesh && child.name.endsWith('-trigger')) {
      child.visible = false;
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });

  // 🎨 APPLY TOON MATERIAL
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

    // ✅ ADD MODEL TO SCENE
    scene.add(model);

    // 👇 Permite inspeccionar la escena desde la consola del navegador
    window.scene = scene;
    window.model = model;

    // 🧠 SETUP MIXERS (body / face / mouth)
    setupMixer(gltf);

    // 🎒 INIT GADGET SYSTEM
    initGadgets(model);

    // 🖱️ INIT RAYCASTER SYSTEM
    initRaycaster(scene, camera, renderer.domElement);

    // 🚀 START LOOP AFTER MODEL LOADS
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

  // ✅ Actualiza todos los mixers desde mixer.js (más limpio)
  updateMixers(delta);

  controls.update();
  renderer.render(scene, camera);
}
