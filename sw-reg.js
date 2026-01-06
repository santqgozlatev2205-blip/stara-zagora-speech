navigator.serviceWorker.register('sw.js');
window.addEventListener('load', async () => {
  const sw = await navigator.serviceWorker.ready;
  const perm = await Notification.requestPermission();
  if (perm === 'granted') await sw.pushManager.subscribe({userVisibleOnly: true});
});
