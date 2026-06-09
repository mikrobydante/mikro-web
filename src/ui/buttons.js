// ✅ /src/ui/buttons.js
import { gsap } from "gsap";

export function setupButtons(onClick) {
  const ui = document.createElement("div");
  ui.id = "controls-ui";
  document.body.appendChild(ui);

  ui.innerHTML = `
    <div class="ui-card">
      <button id="toggle-ui" type="button">Controls ▲</button>

      <div class="ui-content">
        <div id="gadget-slot"></div>

        <div class="ui-section-title">Animations</div>
        <div class="animation-row"></div>
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #controls-ui {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 30;
      width: min(92vw, 500px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .ui-card {
      background: rgba(255,245,235,0.90);
      backdrop-filter: blur(10px);
      border-radius: 22px;
      padding: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,.16);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    #toggle-ui {
      background: rgba(255,217,192,0.95);
      border: none;
      border-radius: 999px;
      padding: 8px 18px;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 13px;
      color: #3b210d;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,.12);
    }

    .ui-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .ui-card.collapsed .ui-content {
      display: none;
    }

    .ui-card.collapsed {
      padding: 10px 14px;
      width: fit-content;
      margin: 0 auto;
    }

    .ui-section-title {
      font-size: 12px;
      font-weight: 700;
      color: #7a4a25;
      opacity: .8;
      text-align: center;
    }

    #gadget-panel {
      position: static !important;
      left: auto !important;
      bottom: auto !important;
      transform: none !important;
      width: 100% !important;
      background: transparent !important;
      box-shadow: none !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 8px !important;
    }

    .gadget-row,
    .animation-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .btn,
    .btn-gadget {
      background-color: #FFD9C0;
      border: none;
      border-radius: 12px;
      padding: 10px 16px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #3b210d;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,.12);
      transition: all .2s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .btn:hover,
    .btn-gadget:hover,
    #toggle-ui:hover {
      background-color: #ffe3d0;
      box-shadow: 0 4px 8px rgba(0,0,0,.22);
    }

    .btn:active,
    .btn-gadget:active,
    #toggle-ui:active {
      transform: scale(.95);
    }

    .btn-gadget.active {
      background-color: #ffb873;
    }

    @media (max-width: 600px) {
      #controls-ui {
        bottom: 10px;
        width: min(94vw, 430px);
      }

      .ui-card {
        padding: 10px;
        gap: 8px;
        border-radius: 18px;
      }

      .btn,
      .btn-gadget {
        padding: 8px 11px;
        font-size: 12px;
      }

      #toggle-ui {
        padding: 7px 16px;
        font-size: 12px;
      }

      .ui-section-title {
        font-size: 11px;
      }
    }
  `;

  document.head.appendChild(style);

  const uiCard = ui.querySelector(".ui-card");
  const toggleBtn = ui.querySelector("#toggle-ui");
  const animationRow = ui.querySelector(".animation-row");

  uiCard.classList.add("collapsed");
  toggleBtn.textContent = "Controls ▼";

  toggleBtn.addEventListener("click", () => {
    uiCard.classList.toggle("collapsed");

    const isCollapsed = uiCard.classList.contains("collapsed");
    toggleBtn.textContent = isCollapsed ? "Controls ▼" : "Controls ▲";

    gsap.fromTo(
      uiCard,
      { scale: 0.97 },
      { scale: 1, duration: 0.18, ease: "back.out(2)" }
    );

    toggleBtn.blur();
  });

  const buttons = [
    { id: "btn-idle", label: "Idle" },
    { id: "btn-talk", label: "Talk" },
    { id: "btn-yes", label: "Yes" },
    { id: "btn-no", label: "No" },
    { id: "btn-wave", label: "Wave" }
  ];

  buttons.forEach(({ id, label }) => {
    const btn = document.createElement("button");

    btn.id = id;
    btn.className = "btn";
    btn.textContent = label;

    animationRow.appendChild(btn);

    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out"
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });
    });

    btn.addEventListener("click", () => {
      gsap.fromTo(
        btn,
        { scale: 0.9 },
        { scale: 1, duration: 0.15, ease: "back.out(2)" }
      );

      btn.blur();

      if (typeof onClick === "function") {
        onClick(id);
      }
    });
  });
}