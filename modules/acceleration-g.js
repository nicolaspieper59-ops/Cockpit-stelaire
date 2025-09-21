export function activate(container) {
  const g = 9.80665;
  container.querySelector('#acceleration-val').textContent = `g = ${g.toFixed(2)} m/s²`;
}
