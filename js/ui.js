import { cambiarEstado } from "./firebase.js";

export function renderCasa(data) {
  const logUl = document.getElementById("log");
  logUl.innerHTML = "";

  // 🔹 Mostrar habitaciones
  const roomsContainer = document.getElementById("rooms");
  roomsContainer.innerHTML = "";

  Object.entries(data.habitaciones).forEach(([nombre, info]) => {
    const div = document.createElement("div");
    div.className = "room";
    div.dataset.room = nombre;
    div.innerHTML = `
      <span>${nombre}<br><small>${Object.keys(info.dispositivos).length} dispositivos</small></span>
      <span class="pill">${info.temperatura}°C</span>
    `;
    roomsContainer.appendChild(div);
  });

  // 🔹 Mostrar dispositivos
  const devicesContainer = document.getElementById("devices");
  devicesContainer.innerHTML = "";

  Object.entries(data.habitaciones).forEach(([habitacion, info]) => {
    Object.entries(info.dispositivos).forEach(([nombre, valor]) => {
      const div = document.createElement("div");
      div.className = "device";
      div.dataset.habitacion = habitacion;
      div.dataset.dispositivo = nombre;

      const tipo = typeof valor === "boolean" ? "Luz" : "Clima";
      const control = (typeof valor === "boolean")
        ? `<label class="toggle">
             <input type="checkbox" class="switch" ${valor ? "checked" : ""}>
             <span class="slider"></span>
           </label>`
        : `<input type="range" min="16" max="30" value="${valor}" class="range">`;

      div.innerHTML = `
        <div class="row">
          <strong>${nombre} (${habitacion})</strong><span class="pill">${tipo}</span>
        </div>
        <div class="row">
          <span class="muted">${typeof valor === "boolean" ? (valor ? "Encendido" : "Apagado") : valor + "°C"}</span>
          ${control}
        </div>
      `;

      devicesContainer.appendChild(div);
    });
  });

  // 🔹 Asignar eventos de cambio a los switches
  devicesContainer.querySelectorAll(".switch").forEach(sw => {
  sw.addEventListener("change", (e) => {
    const deviceDiv = e.target.closest(".device");
    const habitacion = deviceDiv.dataset.habitacion;
    const dispositivo = deviceDiv.dataset.dispositivo;

    // Construir ruta completa en Firebase
    const ruta = `casa_inteligente/habitaciones/${habitacion}/dispositivos/${dispositivo}`;
    cambiarEstado(ruta, e.target.checked);
  });
});


  // 🔹 Mostrar KPI
  document.getElementById("kpi-lights").textContent = `${data.kpi.luces_encendidas} luces encendidas`;
  document.getElementById("kpi-security").textContent = data.kpi.seguridad;
}
