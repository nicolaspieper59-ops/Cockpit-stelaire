// interface.js — Chargement automatique du module cockpit-universel

window.onload = () => {
  const panel = document.getElementById('panel');

  // Créer un conteneur pour le module
  const container = document.createElement('div');
  container.className = 'module';

  // Charger le HTML du module
  fetch('modules/cockpit-universel.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      panel.appendChild(container);

      // Activer le module JS
      import('./modules/cockpit-universel.js')
        .then(module => module.activate(container))
        .catch(err => {
          console.error("Erreur lors de l'import du module :", err);
          container.innerHTML = "<p>⚠️ Échec du chargement du cockpit cosmique.</p>";
        });
    })
    .catch(err => {
      console.error("Erreur lors du chargement du HTML :", err);
      container.innerHTML = "<p>⚠️ Module introuvable.</p>";
      panel.appendChild(container);
    });
};
