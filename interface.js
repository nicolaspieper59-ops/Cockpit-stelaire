import { modules } from './modules/loader.js';

window.onload = () => {
  const panel = document.getElementById('panel');
  modules.forEach(mod => {
    const btn = document.createElement('button');
    btn.textContent = mod.name;
    btn.onclick = () => {
      fetch(`modules/${mod.file}.html`)
        .then(res => res.text())
        .then(html => {
          const container = document.createElement('div');
          container.className = 'module';
          container.innerHTML = html;
          panel.appendChild(container);
          import(`./modules/${mod.file}.js`).then(m => m.activate(container));
        });
    };
    panel.appendChild(btn);
  });
};
