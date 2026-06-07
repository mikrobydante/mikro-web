// ✅ src/modules/buttonsMode.js
import { playAction, hasAction } from '../animation/mixer.js';
import { playSound } from './audioSystem.js';
import { mixers } from '../animation/mixer.js';

export function handleButton(id) {
  // 🧠 Genera los nombres de clips en base al ID del botón
  const base = id.replace('btn-', 'body-') + '-main';
  const face = base.replace('body-', 'face-') + '-keyshape';
  const mouth = base.replace('body-', 'mouth-') + '-keyshape';
  const sound = `${base}.mp3`;

  console.log('🎬 Acción solicitada:', { base, face, mouth });

  // ✅ Reproduce clips solo si existen (sin romper si faltan)
  if (mixers.body && hasAction(base)) playAction(base);
  if (mixers.face && hasAction(face)) playAction(face);

  // 🗑️ Verifica si existe animación de boca antes de intentar reproducirla
  if (mixers.mouth && hasAction(mouth)) {
    playAction(mouth);
  } else {
    console.log(`ℹ️ No mouth clip found for: ${mouth}`);
  }

  // 🔊 Ejecuta el sonido correspondiente
  playSound(sound);
}
