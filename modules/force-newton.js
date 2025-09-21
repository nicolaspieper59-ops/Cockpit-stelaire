export function activate(container) {
  const m = 70, a = 9.8;
  const F = m * a;
  container.querySelector('#force-val').textContent = `F = ${F.toFixed(2)} N`;
}
