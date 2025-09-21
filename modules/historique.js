export function activate(container) {
  const list = container.querySelector('#historique-list');
  ["Big Bang", "Naissance du Soleil", "Cockpit Cosmique"].forEach(e => {
    const li = document.createElement('li');
    li.textContent = e;
    list.appendChild(li);
  });
}
