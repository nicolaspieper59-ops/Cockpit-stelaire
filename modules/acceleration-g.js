export function activate(container) {
  const el = {
    vitesse: container.querySelector('#vitesse-kmh'),
    max: container.querySelector('#vitesse-max'),
    moy: container.querySelector('#vitesse-moy'),
    dist: container.querySelector('#distance'),
    alt: container.querySelector('#altitude'),
    gps: container.querySelector('#gps-precision'),
    mode: container.querySelector('#mode-souterrain'),
    solaire: container.querySelector('#heure-solaire'),
    moyen: container.querySelector('#temps-moyen')
  };

  let totalDistance = 0;
  let totalSpeed = 0;
  let count = 0;
  let maxSpeed = 0;
  let lastPos = null;
  let lastTime = null;

  function updateHeureSolaire() {
    const now = new Date();
    const offset = now.getTimezoneOffset() / 60;
    const longitude = lastPos?.longitude ?? 5.3; // Marseille par défaut
    const correction = longitude * 4 / 60; // 4 min par degré
    const heureSolaire = (now.getUTCHours() + correction).toFixed(2);
    el.solaire.textContent = `🌞 Heure solaire locale : ${heureSolaire} h`;
  }

  function updateTempsMoyen() {
    const now = new Date();
    const t = now.toISOString().slice(11, 19);
    el.moyen.textContent = `🧭 Temps moyen UTC : ${t}`;
  }

  navigator.geolocation.watchPosition(pos => {
    const { latitude, longitude, speed, altitude, accuracy } = pos.coords;
    const timestamp = pos.timestamp;

    const kmh = speed ? speed * 3.6 : 0;
    el.vitesse.textContent = `🚀 Vitesse : ${kmh.toFixed(4)} km/h`;

    maxSpeed = Math.max(maxSpeed, kmh);
    el.max.textContent = `📈 Max : ${maxSpeed.toFixed(4)} km/h`;

    totalSpeed += kmh;
    count++;
    el.moy.textContent = `📊 Moyenne : ${(totalSpeed / count).toFixed(4)} km/h`;

    el.alt.textContent = `🗻 Altitude : ${altitude?.toFixed(4) || '...'} m`;
    el.gps.textContent = `🎯 Précision : ±${accuracy.toFixed(4)} m`;

    if (lastPos && accuracy < 5) {
      const dx = Math.sqrt(
        Math.pow(latitude - lastPos.latitude, 2) +
        Math.pow(longitude - lastPos.longitude, 2)
      ) * 111000;
      if (dx > accuracy) {
        totalDistance += dx;
        el.dist.textContent = `📏 Distance : ${totalDistance.toFixed(4)} m`;
      }
    }

    lastPos = { latitude, longitude };
    lastTime = timestamp;

    el.mode.textContent = accuracy > 10 || kmh === 0
      ? "🕳️ Souterrain ou GPS faible"
      : "🌍 GPS actif";
    el.mode.style.color = accuracy > 10 || kmh === 0 ? "gray" : "lime";

    updateHeureSolaire();
    updateTempsMoyen();
  }, err => {
    el.mode.textContent = "🚫 GPS indisponible";
    el.mode.style.color = "gray";
  }, { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 });

  setInterval(() => {
    updateHeureSolaire();
    updateTempsMoyen();
  }, 10000);
}
