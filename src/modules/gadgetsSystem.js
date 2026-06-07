// ✅ src/modules/gadgetsSystem.js
// System to manage "addon-" gadgets inside the GLB
// Each category (shirt, pants, shoes...) can have multiple models and cycles between them.

import { gsap } from 'gsap';

// Internal registry
const gadgets = {};
let panel;

export function initGadgets(scene) {
  console.log('🎒 Initializing gadget system...');

  // 1️⃣ Find all addon-* meshes
  scene.traverse((child) => {
    if (child.isMesh && child.name.startsWith('addon-')) {
      const parts = child.name.split('-'); // ["addon", "shoes", "01"]
      const category = `addon-${parts[1]}`;

      if (!gadgets[category]) gadgets[category] = [];
      gadgets[category].push(child);

      // Hide everything by default
      child.visible = false;
    }
  });

  // 🔹 Ensure all parent nodes are visible (avoid hidden parents)
  for (const key in gadgets) {
    gadgets[key].forEach((mesh) => {
      let parent = mesh.parent;
      while (parent) {
        parent.visible = true;
        parent = parent.parent;
      }
    });
  }

  console.log('🧱 Gadget groups:', Object.keys(gadgets));

  // 2️⃣ Create HUD panel if not exists
  createGadgetPanel();

  // 3️⃣ Setup button listeners
  document.querySelectorAll('.btn-gadget').forEach((btn) => {
    btn.addEventListener('click', () => handleGadgetClick(btn.id));
  });
}

function handleGadgetClick(id) {
  const category = `addon-${id.replace('btn-', '')}`;
  const group = gadgets[category];
  if (!group || group.length === 0) return;

  const btn = document.getElementById(id);

  // Find current visible gadget index
  const currentIndex = group.findIndex((mesh) => mesh.visible);
  const nextIndex = (currentIndex + 1) % (group.length + 1);

  console.log(
    '👉 Group found:',
    group.map((g) => g.name),
    'Current index:',
    currentIndex,
    'Next:',
    nextIndex
  );

  // Hide all gadgets of that group
  group.forEach((mesh) => (mesh.visible = false));

  // If nextIndex < group.length → show next; else all stay hidden
  if (nextIndex < group.length) {
    group[nextIndex].visible = true;
    btn.classList.add('active');
    console.log(`✨ ${category}: showing ${group[nextIndex].name}`);
  } else {
    btn.classList.remove('active');
    console.log(`🚫 ${category}: all hidden`);
  }
}

function createGadgetPanel() {
  if (document.getElementById('gadget-panel')) return;

  panel = document.createElement('div');
  panel.id = 'gadget-panel';
  panel.innerHTML = `
    <button class="btn-gadget" id="btn-hoodie">Hoodie</button>
    <button class="btn-gadget" id="btn-pants">Pants</button>
    <button class="btn-gadget" id="btn-shoes">Shoes</button>
    <button class="btn-gadget" id="btn-glasses">Glasses</button>
    <button class="btn-gadget" id="btn-hats">Hats</button>  <!-- 🧢 NUEVO -->
  `;
  document.body.appendChild(panel);

  // GSAP entrance
  gsap.from(panel, {
    y: 80,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
  });
}
