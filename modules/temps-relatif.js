export function activate(container) {
  const p = container.querySelector('#temps-relatif');
  setInterval(() => {
    const now = new Date();
    const heuresSolaires = ((now.getUTCHours() + 1 + now.getTimezoneOffset() / 60) % 24).toFixed(2);
    p.textContent = `UTC : ${now.toISOString().slice(11, 19)} | Solaire : ${heuresSolaires} h`;
  }, 1000);
}
