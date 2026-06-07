// ✅ src/animation/mixer.js
import * as THREE from 'three';

// Mixers separados por tipo
export const mixers = { body: null, face: null, mouth: null };
let allAnimations = [];

// ------------------------------------------------------
// 🧩 CONFIGURAR MIXERS
// ------------------------------------------------------
export function setupMixer(gltf) {
  const { animations, scene } = gltf;
  allAnimations = animations;

  // Buscar los objetos clave dentro de la escena
  const head = scene.getObjectByName('mesh-head');
  const mouth = scene.getObjectByName('mesh-mouth');

  // 🦴 Buscar armature principal (usa 'Armature' o 'root')
  const armature = scene.getObjectByName('Armature') || scene.getObjectByName('root');

  if (!armature || !head || !mouth) {
    console.warn('⚠️ No se encontraron algunos objetos esperados:', { armature, head, mouth });
  }

  // ✅ Mixer de cuerpo (usa el armature completo)
  if (armature) {
    mixers.body = new THREE.AnimationMixer(armature);
    console.log('🦴 Mixer de cuerpo asignado a:', armature.name);
  } else {
    console.warn('⚠️ No se encontró el Armature ni root, usando gltf.scene');
    mixers.body = new THREE.AnimationMixer(scene);
  }

  // ✅ Mixers adicionales
  mixers.face = head ? new THREE.AnimationMixer(head) : null;
  mixers.mouth = mouth ? new THREE.AnimationMixer(mouth) : null;

  console.log('🎬 Clips registrados:', animations.map(a => a.name));
  console.log('🧠 Mixers activos:', {
    body: !!mixers.body,
    face: !!mixers.face,
    mouth: !!mixers.mouth,
  });
}

// ------------------------------------------------------
// ▶️ REPRODUCIR ANIMACIÓN (versión estable)
// ------------------------------------------------------
export function playAction(name) {
  let mixer = null;

  if (name.startsWith('body-')) mixer = mixers.body;
  else if (name.startsWith('face-')) mixer = mixers.face;
  else if (name.startsWith('mouth-')) mixer = mixers.mouth;

  if (!mixer) {
    console.warn('⚠️ Mixer no encontrado para', name);
    return;
  }

  const clip = allAnimations.find(a => a.name === name);
  if (!clip) {
    console.warn('⚠️ Clip no encontrado:', name);
    return;
  }

  // ✅ Solo intenta fadeOut si ya existe una acción previa válida
  if (mixer.existingAction && typeof mixer.existingAction.fadeOut === 'function') {
    mixer.existingAction.fadeOut(0.2);
  }

  const action = mixer.clipAction(clip);
  mixer.existingAction = action; // guarda la nueva acción activa

  action.reset();
  action.setLoop(THREE.LoopOnce, 1);
  action.clampWhenFinished = true;
  action.fadeIn(0.15);
  action.play();

  console.log('▶️ Acción reproducida:', name);
}

// ------------------------------------------------------
// 🔍 VERIFICAR EXISTENCIA DE CLIP
// ------------------------------------------------------
export function hasAction(name) {
  return !!allAnimations.find(a => a.name === name);
}

// ------------------------------------------------------
// ⏱️ ACTUALIZAR MIXERS EN EL LOOP PRINCIPAL
// ------------------------------------------------------
export function updateMixers(delta) {
  for (const key in mixers) {
    if (mixers[key]) mixers[key].update(delta);
  }
}
