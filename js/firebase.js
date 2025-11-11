import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getDatabase, ref, onValue, update, set, push } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP0AfXzS4VsY_oAdkucpGihyhNlO9AJEA",
  authDomain: "registro-tiempo-real.firebaseapp.com",
  databaseURL: "https://registro-tiempo-real-default-rtdb.firebaseio.com",
  projectId: "registro-tiempo-real",
  storageBucket: "registro-tiempo-real.firebasestorage.app",
  messagingSenderId: "266350344341",
  appId: "1:266350344341:web:fec3443ea8d6ab2c79039c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Leer toda la casa en tiempo real
export function escucharCasa(callback) {
  const refCasa = ref(db, "casa_inteligente");
  onValue(refCasa, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

// 🔹 Cambiar el estado de un dispositivo (encender/apagar)
export function cambiarEstado(ruta, valor) {
  const partes = ruta.split("/");
  const nombreDispositivo = partes.pop();  // ej: "luz_principal"
  const refDispositivo = ref(db, partes.join("/")); // ej: casa_inteligente/habitaciones/sala/dispositivos

  update(refDispositivo, { [nombreDispositivo]: valor })
    .then(() => console.log(`✅ ${nombreDispositivo} actualizado a ${valor}`))
    .catch((err) => console.error("❌ Error al actualizar:", err));
}

// 🔹 Guardar logs (historial)
export function agregarLog(mensaje) {
  const path = `casa_inteligente/historial`;
  push(ref(db, path), {
    mensaje,
    fecha: new Date().toLocaleString()
  });
}
