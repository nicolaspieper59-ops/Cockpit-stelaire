export function activate(container) {
  const el = {
    vitesse: container.querySelector('#vitesse-kmh'),
    max: container.querySelector('#vitesse-max'),
    moy: container.querySelector('#vitesse-moy'),
    dist: container.querySelector('#distance'),
    alt: container.querySelector('#altitude'),
    gps: container.querySelector('#gps-precision'),
    mode: container.querySelector('#mode-souterrain')
  };

  let totalDistance = 0;
  let totalSpeed = 0;
  let count = 0;
  let maxSpeed = 0;
  let lastPos = null;
  let lastTime = null;

  navigator.geolocation.watchPosition(pos => {
    const { latitude, longitude, speed, altitude, accuracy } = pos.coords;
    const timestamp = pos.timestamp;

    // Vitesse en km/h
    const kmh = speed ? speed * 3.6 : 0;
    el.vitesse.textContent = `🚀 Vitesse : ${kmh.toFixed(1)} km/h`;

    // Vitesse max
    maxSpeed = Math.max(maxSpeed, kmh);
    el.max.textContent = `📈 Max : ${maxSpeed.toFixed(1)} km/h`;

    // Moyenne
    totalSpeed += kmh;
    count++;
    el.moy.textContent = `📊 Moyenne : ${(totalSpeed / count).toFixed(1)} km/h`;

    // Altitude
    el.alt.textContent = `🗻 Altitude : ${altitude?.toFixed(1) || '...'} m`;

    // Précision GPS
    el.gps.textContent = `🎯 Précision : ±${accuracy.toFixed(1)} m`;

    // Distance (corrigée par précision)
    if (lastPos && accuracy < 100) {
      const dx = Math.sqrt(
        Math.pow(latitude - lastPos.latitude, 2) +
        Math.pow(longitude - lastPos.longitude, 2)
      ) * 111000;
      if (dx > accuracy) {
        totalDistance += dx;
        el.dist.textContent = `📏 Distance : ${totalDistance.toFixed(1)} m`;
      }
    }
    lastPos = { latitude, longitude };
    lastTime = timestamp;

    // Mode souterrain
    if (accuracy > 100 || kmh === 0) {
      el.mode.textContent = "🕳️ Souterrain ou GPS faible";
      el.mode.style.color = "gray";
    } else {
      el.mode.textContent = "🌍 GPS actif";
      el.mode.style.color = "lime";
    }
  }, err => {
    el.mode.textContent = "🚫 GPS indisponible";
    el.mode.style.color = "gray";
  }, { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 });
}
