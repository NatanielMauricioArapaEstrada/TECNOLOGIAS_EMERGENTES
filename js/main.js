import { escucharCasa } from "./firebase.js";
import { renderCasa } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  // Muestra hora actual
  const nowEl = document.getElementById("now");
  const fmt = new Intl.DateTimeFormat('es-BO', { dateStyle:'medium', timeStyle:'short' });
  nowEl.textContent = fmt.format(new Date());

  // Conectar Firebase
  escucharCasa((data) => {
    renderCasa(data);
  });
});
