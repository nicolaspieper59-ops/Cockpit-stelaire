export function activate(container) {
  navigator.geolocation.watchPosition(pos => {
    const v = pos.coords.speed || 0;
    container.querySelector('#vitesse-val').textContent = `${v.toFixed(2)} m/s`;
  });
}
