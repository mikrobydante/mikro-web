// src/core/lights.js
import * as THREE from 'three';

export function createLights(scene) {
  // Hemisférica (ambiente cálido)
  const hemi = new THREE.HemisphereLight(0xf5f8ff, 0xf1efe7, 0.25);
  hemi.position.set(0, 2.5, 0);
  scene.add(hemi);

  // Direccional (sombra en el piso)
  const dir = new THREE.DirectionalLight(0xffffff, 3.0);
  dir.position.set(-2, 8, 9);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  dir.shadow.camera.near = 0.1;
  dir.shadow.camera.far = 30;
  dir.shadow.camera.left = -8;
  dir.shadow.camera.right = 8;
  dir.shadow.camera.top = 8;
  dir.shadow.camera.bottom = -8;
  dir.shadow.bias = -0.0005;
  dir.shadow.normalBias = 0.02;
  scene.add(dir);

  // Piso receptor de sombras
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.28 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // 🌤️ Luz de rebote cálido (¡esto es lo que faltaba!)
  const bounce = new THREE.PointLight(0xffc8a0, 0.18, 0); // 0 = alcance infinito
  bounce.position.set(0, 0.3, 0);
  scene.add(bounce);
}
