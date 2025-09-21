export function activate(container) {
  window.addEventListener('devicemotion', e => {
    const a = e.accelerationIncludingGravity;
    container.querySelector('#inertiel-val').textContent =
      `x: ${a.x?.toFixed(2)} y: ${a.y?.toFixed(2)} z: ${a.z?.toFixed(2)}`;
  });
}
