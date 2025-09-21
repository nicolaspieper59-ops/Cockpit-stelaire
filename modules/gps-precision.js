export function activate(container) {
  navigator.geolocation.watchPosition(pos => {
    const acc = pos.coords.accuracy;
    container.querySelector('#gps-val').textContent = `±${acc.toFixed(1)} m`;
  });
}
