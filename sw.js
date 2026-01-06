// sw.js
const CACHE='sz-v1';
const FILES=['/','/index.html','/sw-reg.js','/manifest.json','/stop.mp3','/next_stop.mp3','/your_stop.mp3','/line.mp3','/71.mp3','/direction.mp3','/zora_jheleznik_stadion_beroe.mp3','/jheleznik_zora_stadion_beroe.mp3','/icon-192.png','/icon-512.png'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});

// --------- Web-Push + фонов звук ---------
self.addEventListener('push',e=>{
  const data=e.data.json();
  self.registration.showNotification(data.title,{
    body:data.body,
    icon:'icon-192.png',
    badge:'icon-192.png',
    vibrate:[200,100,200],
    tag:'stop-alert',
    renotify:true
  });
});

let audioCtx,gainNode;
const audioBuffers={};

function initAudio(){
 if(audioCtx)return;
 audioCtx=new (self.AudioContext||self.webkitAudioContext)();
 gainNode=audioCtx.createGain();
 gainNode.connect(audioCtx.destination);
}

async function loadAudio(name){
 if(!audioCtx)initAudio();
 if(audioBuffers[name])return audioBuffers[name];
 const resp=await fetch(name);
 const arrayBuf=await resp.arrayBuffer();
 const buf=await audioCtx.decodeAudioData(arrayBuf);
 audioBuffers[name]=buf;
 return buf;
}

function playBuffer(buf){
 initAudio();
 const src=audioCtx.createBufferSource();
 src.buffer=buf;
 src.connect(gainNode);
 src.start(0);
}

self.addEventListener('message',async e=>{
 if(e.data.type==='PLAY'){
   const buf=await loadAudio(e.data.file);
   playBuffer(buf);
 }
 if(e.data.type==='PUSH'){
   self.registration.showNotification(e.data.title,{
     body:e.data.body,
     icon:'icon-192.png',
     badge:'icon-192.png',
     vibrate:[200,100,200],
     tag:'stop-alert',
     renotify:true
   });
 }
});


