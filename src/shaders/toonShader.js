import * as THREE from 'three';

/**
 * 🟡 makeSoftRamp()
 * Genera una textura de gradiente (rampa) 1D para simular el sombreado suave tipo "feather".
 * Esta textura se usa como gradientMap en el material toon.
 *
 * Parámetros:
 *  - width: resolución de la textura (256 px por defecto)
 *  - threshold: punto de transición entre luz y sombra
 *  - feather: ancho de la zona difusa de transición
 *  - dark / light: niveles de brillo para sombra y luz
 */
function makeSoftRamp({ width = 256, threshold = 0.62, feather = 0.12, dark = 0.75, light = 1.0 } = {}) {

  // Crear un canvas temporal de 256x1 px (solo una fila de píxeles)
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  // Calcular límites del feather (transición suave)
  const t0 = Math.max(0, Math.min(1, threshold - feather * 0.5)); // inicio de la transición
  const t1 = Math.max(0, Math.min(1, threshold + feather * 0.5)); // fin de la transición

  // Convertir valores de 0–1 a 0–255
  const d = Math.round(dark * 255), l = Math.round(light * 255);

  // Crear un degradado lineal horizontal
  const grad = ctx.createLinearGradient(0, 0, width, 0);

  // 🔹 Estructura del gradiente:
  //    [zona sombra] --feather--> [zona luz]
  grad.addColorStop(0, `rgb(${d},${d},${d})`);  // inicio oscuro
  grad.addColorStop(t0, `rgb(${d},${d},${d})`); // sombra pura
  grad.addColorStop(t1, `rgb(${l},${l},${l})`); // transición a luz
  grad.addColorStop(1, `rgb(${l},${l},${l})`);  // luz pura

  // Dibujar el gradiente en el canvas
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, 1);

  // Convertir el canvas en textura para Three.js
  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;                        // suaviza las transiciones
  tex.minFilter = THREE.LinearMipmapLinearFilter;    // filtro suave para minificación
  tex.magFilter = THREE.LinearFilter;                // filtro suave para ampliación
  tex.colorSpace = THREE.SRGBColorSpace;             // asegura saturación y color correctos

  // Devuelve la textura (gradientMap final)
  return tex;
}

/**
 * 🟠 createToonMaterial()
 * Crea un material toon estilizado con gradiente feather.
 *
 * Parámetro:
 *  - map: textura base (atlas del personaje)
 *
 * Resultado:
 *  - MeshToonMaterial con transición suave entre luz y sombra,
 *    manteniendo colores saturados y un look ilustrativo.
 */
export function createToonMaterial(map) {
  // Generar la textura del gradiente suave
  const gradientMap = makeSoftRamp({
    threshold: 0.62, // posición del borde luz/sombra
    feather: 0.12,   // suavidad de transición
    dark: 0.75,      // valor sombra
    light: 1.0,      // valor luz
  });

  // Crear y devolver el material toon final
  return new THREE.MeshToonMaterial({
    map,             // textura base del personaje
    color: 0xffffff, // color neutro (permite respetar el atlas)
    gradientMap,     // gradiente personalizado "feather"
  });
}
