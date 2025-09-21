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
  let souterrain = false;

  navigator.geolocation.watchPosition(pos => {
    const { speed, altitude, accuracy, latitude, longitude } = pos.coords;
    const kmh = speed ? speed * 3.6 : 0;

    // Correction GPS : ignorer si précision > 100 m
    if (accuracy > 100) {
      el.mode.textContent = "🕳️ Mode souterrain ou GPS imprécis";
      el.mode.style.color = "gray";
      return;
    } else {
      el.mode.textContent = "🌍 Signal GPS actif";
      el.mode.style.color = "lime";
    }

    // Vitesse
    el.vitesse.textContent = `🚀 Vitesse : ${kmh.toFixed(1)} km/h`;
    maxSpeed = Math.max(maxSpeed, kmh);
    totalSpeed += kmh;
    count++;

    // Moyenne et max
    el.max.textContent = `📈 Max : ${maxSpeed.toFixed(1)} km/h`;
    el.moy.textContent = `📊 Moyenne : ${(totalSpeed / count).toFixed(1)} km/h`;

    // Altitude
    el.alt.textContent = `🗻 Altitude : ${altitude?.toFixed(1) || '...'} m`;

    // GPS précision
    el.gps.textContent = `🎯 Précision : ±${accuracy.toFixed(1)} m`;

    // Distance
    if (lastPos) {
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
  }, err => {
    el.mode.textContent = "🚫 GPS indisponible";
    el.mode.style.color = "gray";
  }, { enableHighAccuracy: true });
      }
    
