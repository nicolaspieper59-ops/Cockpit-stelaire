export function activate(container, data) {
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
    data.cockpit.heure_solaire_locale_h = parseFloat(heureSolaire);
  }

  function updateTempsMoyen() {
    const now = new Date();
    const t = now.toISOString().slice(11, 19);
    el.moyen.textContent = `🧭 Temps moyen UTC : ${t}`;
    data.cockpit.temps_moyen_utc = t;
  }

  navigator.geolocation.watchPosition(pos => {
    const { latitude, longitude, speed, altitude, accuracy } = pos.coords;
    const timestamp = pos.timestamp;

    const kmh = speed ? speed * 3.6 : 0;
    el.vitesse.textContent = `🚀 Vitesse : ${kmh.toFixed(4)} km/h`;
    data.cockpit.vitesse.instantanee_kmh = kmh;

    maxSpeed = Math.max(maxSpeed, kmh);
    el.max.textContent = `📈 Max : ${maxSpeed.toFixed(4)} km/h`;
    data.cockpit.vitesse.max_kmh = maxSpeed;

    totalSpeed += kmh;
    count++;
    const moyenne = totalSpeed / count;
    el.moy.textContent = `📊 Moyenne : ${moyenne.toFixed(4)} km/h`;
    data.cockpit.vitesse.moyenne_kmh = moyenne;

    el.alt.textContent = `🗻 Altitude : ${altitude?.toFixed(4) || '...'} m`;
    data.cockpit.altitude_m = altitude ?? null;

    el.gps.textContent = `🎯 Précision : ±${accuracy.toFixed(4)} m`;
    data.cockpit.gps_precision_m = accuracy;

    if (lastPos && accuracy < 5) {
      const dx = Math.sqrt(
        Math.pow(latitude - lastPos.latitude, 2) +
        Math.pow(longitude - lastPos.longitude, 2)
      ) * 111000;
      if (dx > accuracy) {
        totalDistance += dx;
        el.dist.textContent = `📏 Distance : ${totalDistance.toFixed(4)} m`;
        data.cockpit.distance_m = totalDistance;
      }
    } else {
      el.dist.textContent = `📏 Distance : ${totalDistance.toFixed(4)} m`;
      data.cockpit.distance_m = totalDistance;
    }

    lastPos = { latitude, longitude };
    lastTime = timestamp;

    const isUnderground = accuracy > 10 || kmh === 0;
    el.mode.textContent = isUnderground
      ? "🕳️ Souterrain ou GPS faible"
      : "🌍 GPS actif";
    el.mode.style.color = isUnderground ? "gray" : "lime";
    data.cockpit.mode_souterrain = isUnderground;

    data.cockpit.timestamp = new Date(timestamp).toISOString();

    updateHeureSolaire();
    updateTempsMoyen();
  }, err => {
    el.mode.textContent = "🚫 GPS indisponible";
    el.mode.style.color = "gray";
    data.cockpit.mode_souterrain = true;
  }, { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 });

  setInterval(() => {
    updateHeureSolaire();
    updateTempsMoyen();
  }, 10000);
      }    const { latitude, longitude, speed, altitude, accuracy } = pos.coords;
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
