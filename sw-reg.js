// регистрираме SW + поискаме известия
navigator.serviceWorker.register('sw.js');

window.addEventListener('load', async () => {
  const sw = await navigator.serviceReady;
  const perm = await Notification.requestPermission();
  if (perm === 'granted') await sw.pushManager.subscribe({userVisibleOnly:true});
});
