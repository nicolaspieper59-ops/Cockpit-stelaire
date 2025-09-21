export function activate(container) {
  window.addEventListener('deviceorientation', e => {
    container.querySelector('#orientation-val').textContent =
      `Alpha: ${e.alpha?.toFixed(1)}°, Beta: ${e.beta?.toFixed(1)}°, Gamma: ${e.gamma?.toFixed(1)}°`;
  });
}
