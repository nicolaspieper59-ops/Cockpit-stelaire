export function activate(container) {
  const vitesseEl = container.querySelector('#vitesse-kmh');
  const souterrainEl = container.querySelector('#mode-souterrain');

  let lastUpdate = Date.now();
  let souterrain = false;

  navigator.geolocation.watchPosition(pos => {
    const speed = pos.coords.speed; // en m/s
    const kmh = speed ? speed * 3.6 : 0;

    vitesseEl.textContent = `🚀 Vitesse : ${kmh.toFixed(1)} km/h`;

    if (kmh === 0) {
      if (Date.now() - lastUpdate > 10000 && !souterrain) {
        souterrain = true;
        souterrainEl.textContent = "🕳️ Mode souterrain détecté";
        souterrainEl.style.color = "gray";
      }
    } else {
      souterrain = false;
      lastUpdate = Date.now();
      souterrainEl.textContent = "🌍 Signal GPS actif";
      souterrainEl.style.color = "lime";
    }
  }, err => {
    vitesseEl.textContent = "🚫 Vitesse indisponible";
    souterrainEl.textContent = "🕳️ Mode souterrain (GPS perdu)";
    souterrainEl.style.color = "gray";
  }, { enableHighAccuracy: true });
}
