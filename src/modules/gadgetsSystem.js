// ✅ src/modules/gadgetsSystem.js
import { gsap } from 'gsap';

const gadgets = {};
let panel;

export function initGadgets(scene) {
  console.log('🎒 Initializing gadget system...');

  scene.traverse((child) => {
    if (child.isMesh && child.name.startsWith('addon-')) {
      const parts = child.name.split('-');
      const category = `addon-${parts[1]}`;

      if (!gadgets[category]) gadgets[category] = [];
      gadgets[category].push(child);

      child.visible = false;
    }
  });

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

  createGadgetPanel();

  document.querySelectorAll('.btn-gadget').forEach((btn) => {
    btn.addEventListener('click', () => handleGadgetClick(btn.id));
  });
}

function handleGadgetClick(id) {
  const category = `addon-${id.replace('btn-', '')}`;
  const group = gadgets[category];

  if (!group || group.length === 0) return;

  const btn = document.getElementById(id);
  const currentIndex = group.findIndex((mesh) => mesh.visible);
  const nextIndex = (currentIndex + 1) % (group.length + 1);

  group.forEach((mesh) => {
    mesh.visible = false;
  });

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
    <div class="ui-section-title">Customize</div>
    <div class="gadget-row">
      <button class="btn-gadget" id="btn-hoodie">Hoodie</button>
      <button class="btn-gadget" id="btn-pants">Pants</button>
      <button class="btn-gadget" id="btn-shoes">Shoes</button>
      <button class="btn-gadget" id="btn-glasses">Glasses</button>
      <button class="btn-gadget" id="btn-hats">Hats</button>
    </div>
  `;

  movePanelToSlot();

  gsap.from(panel, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)',
  });
}

function movePanelToSlot() {
  const gadgetSlot = document.getElementById('gadget-slot');

  if (gadgetSlot) {
    gadgetSlot.appendChild(panel);
  } else {
    document.body.appendChild(panel);

    setTimeout(() => {
      movePanelToSlot();
    }, 100);
  }
}