export function activate(container) {
  let total = 0, last = null;
  navigator.geolocation.watchPosition(pos => {
    if (last) {
      const dx = Math.sqrt(
        Math.pow(pos.coords.latitude - last.latitude, 2) +
        Math.pow(pos.coords.longitude - last.longitude, 2)
      ) * 111000;
      total += dx;
      container.querySelector('#distance-val').textContent = `${total.toFixed(1)} m`;
    }
    last = pos.coords;
  });
}
