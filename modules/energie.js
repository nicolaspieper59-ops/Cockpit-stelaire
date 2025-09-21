export function activate(container) {
  const m = 70;
  navigator.geolocation.watchPosition(pos => {
    const v = pos.coords.speed || 0;
    const E = 0.5 * m * v * v;
    container.querySelector('#energie-val').textContent = `E = ${E.toFixed(2)} J`;
  });
}
