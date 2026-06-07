// ✅ /src/ui/buttons.js
import { gsap } from "gsap";

// Esta función crea los botones y los conecta al sistema
export function setupButtons(onClick) {
  // Contenedor principal
  const ui = document.createElement("div");
  ui.id = "ui";
  document.body.appendChild(ui);

  // Estilos básicos (puedes moverlos a CSS si prefieres)
  const style = document.createElement("style");
  style.textContent = `
    #ui {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 10;
    }

    .btn {
      background-color: #FFD9C0;
      border: none;
      border-radius: 12px;
      padding: 10px 18px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #3b210d;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      transition: background 0.2s, box-shadow 0.2s;
    }

    .btn:hover {
      background-color: #ffe3d0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.25);
    }

    .btn:active {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);

  // Lista de botones
  const buttons = [
    { id: "btn-idle", label: "Idle" },
    { id: "btn-talk", label: "Talk" },
    { id: "btn-yes", label: "Yes" },
    { id: "btn-no", label: "No" },
    { id: "btn-wave", label: "Wave" },
  ];

  // Crear y animar botones
  buttons.forEach(({ id, label }) => {
    const btn = document.createElement("button");
    btn.id = id;
    btn.className = "btn";
    btn.textContent = label;
    ui.appendChild(btn);

    // Animaciones suaves con GSAP
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, { scale: 1.1, duration: 0.2, ease: "power2.out" });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { scale: 1.0, duration: 0.3, ease: "power2.inOut" });
    });

    btn.addEventListener("click", () => {
      gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.15, ease: "back.out(2)" });
      if (typeof onClick === "function") onClick(id);
    });
  });
}
