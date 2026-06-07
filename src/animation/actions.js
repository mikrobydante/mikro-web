// ✅ src/animation/actions.js
import * as THREE from 'three';
import { mixers } from './mixer.js';

const actions = {}; // cache de acciones

// 🎬 Crea una acción de animación asociada al mixer correcto
export function playAction(name, mixer) {
  if (!mixer) {
    console.warn(`[actions.js] Mixer no encontrado para la acción: ${name}`);
    return;
  }

  // Busca si ya existe esa acción, si no la crea
  let action = actions[name];
  if (!action) {
    const clip = mixer._root?.animations?.find(c => c.name === name);
    if (!clip) {
      console.warn(`[actions.js] Clip no encontrado: ${name}`);
      return;
    }
    action = mixer.clipAction(clip);
    actions[name] = action;
  }

  // Resetea y ejecuta
  action.reset();
  action.setLoop(THREE.LoopOnce);
  action.clampWhenFinished = true;
  action.play();

  console.log(`▶️ Acción reproducida: ${name}`);
}

// 🔍 Verifica si una acción existe en cualquier mixer
export function hasAction(name) {
  return Object.values(mixers).some(m => {
    const clip = m._root?.animations?.find(c => c.name === name);
    return !!clip;
  });
}
