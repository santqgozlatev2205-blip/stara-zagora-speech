self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request));
});
// --------- Web-Push известия ---------
self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [200, 100, 200],
    sound: 'data:audio/mpeg;base64,', // празно – звукът е отделно
    tag: 'stop-alert',
    renotify: true
  });
});

// --------- Пускане на звук във фонов режим ---------
let audioCtx, gainNode;
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (self.AudioContext || self.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
}

function playBuffer(buf) {
  initAudio();
  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  src.connect(gainNode);
  src.start(0);
}

// кешираме аудио буферите
const audioBuffers = {};
async function loadAudio(name) {
  if (audioBuffers[name]) return audioBuffers[name];
  const resp = await fetch(name);
  const arrayBuf = await resp.arrayBuffer();
  const buf = await audioCtx.decodeAudioData(arrayBuf);
  audioBuffers[name] = buf;
  return buf;
}

// съобщение от основния скрипт
self.addEventListener('message', async e => {
  if (e.data.type === 'PLAY') {
    const buf = await loadAudio(e.data.file);
    playBuffer(buf);
  }
});
