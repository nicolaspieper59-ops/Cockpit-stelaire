import { modules } from './modules/loader.js';

window.onload = () => {
  const panel = document.getElementById('panel');

  // Charger automatiquement le module "cockpit-universel"
  const mod = modules.find(m => m.file === 'cockpit-universel');
  if (mod) {
    fetch(`modules/${mod.file}.html`)
      .then(res => res.text())
      .then(html => {
        const container = document.createElement('div');
        container.className = 'module';
        container.innerHTML = html;
        panel.appendChild(container);
        import(`./modules/${mod.file}.js`).then(m => m.activate(container));
      });
  }
};
