// script.js
const startBtn = document.getElementById('startBtn');
const view1 = document.getElementById('view-1');
const view2 = document.getElementById('view-2');
const likesCanvas = document.getElementById('likesCanvas');
const likeCount = document.getElementById('likeCount');
const backBtn = document.getElementById('backBtn');
const audio = document.getElementById('romanticTrack');
const whatsappShare = document.getElementById('whatsappShare');

let count = 0;

// Prepare WhatsApp share link (mensaje prellenado)
const text = encodeURIComponent("Ingeniera, encontré algo para usted: https://REPLACE_WITH_YOUR_SITE — si quiere, respóndame 'Hola Ingeniera'.");
whatsappShare.href = `https://api.whatsapp.com/send?text=${text}`;

// PokeAPI small fetch to add un detalle moderno
(async function loadPokemon(){
  try{
    const id = Math.floor(Math.random()*151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    document.getElementById('pokeName').innerText = data.name;
    const img = document.createElement('img');
    img.src = data.sprites.front_default || '';
    img.alt = data.name;
    img.style.maxHeight = '72px';
    document.getElementById('pokeImg').appendChild(img);
  }catch(e){
    document.getElementById('pokeName').innerText = 'sorpresa';
  }
})();

// Helper to try play audio (browsers often block autoplay with sound)
function tryPlayAudio(){
  audio.volume = 0.9;
  audio.play().catch(()=>{ /* si falla, esperamos interacción */ });
}

// Start button: triggers audio + go to view 2 when clicked
startBtn.addEventListener('click', async () => {
  tryPlayAudio();
  // small transition effect
  view1.classList.add('fade-out');
  setTimeout(()=> {
    view1.classList.add('d-none');
    view2.classList.remove('d-none');
    view2.classList.add('fade-in');
    // create a batch of floating hearts to fill initially
    for(let i=0;i<24;i++) spawnHeart();
  }, 420);
});

// Back button
backBtn.addEventListener('click', () => {
  view2.classList.add('d-none');
  view1.classList.remove('d-none');
  tryPlayAudio();
});

// spawnHeart: crea un corazón que sube desde el fondo
function spawnHeart(opts={}) {
  const el = document.createElement('div');
  el.className = 'like';
  const size = (36 + Math.random()*36); // 36..72 px
  el.style.width = size + 'px';
  el.style.height = size + 'px';

  const x = Math.random() * (window.innerWidth - 80);
  el.style.left = x + 'px';

  // stagger animation duration and delay
  const duration = 6 + Math.random() * 6; // 6..12s
  const delay = Math.random() * 0.6;
  el.style.animation = `floatUp ${duration}s linear ${delay}s forwards`;

  // small random rotation
  el.style.transform = `rotate(${(Math.random()*40)-20}deg)`;

  likesCanvas.appendChild(el);

  // increment counter
  count++;
  likeCount.innerText = count;

  // remove from DOM after animation
  setTimeout(()=> {
    el.remove();
  }, (duration + delay) * 1000 + 200);
}

// Adding click interaction: cuando se pulsa en la pantalla de vista 2 aparecen filas de me gusta y animación
view2.addEventListener('click', (e) => {
  // Si se pulsa sobre la foto centrada no generamos corazón tras ella
  const rect = document.querySelector('.center-photo').getBoundingClientRect();
  const withinPhoto = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
  if(withinPhoto) {
    // pequeño efecto: zoom foto y mensaje
    const photo = document.querySelector('.center-photo .photo-center');
    photo.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 450 });
    return;
  }

  // cada click genera varias filas verticales
  for(let i=0;i<6;i++){
    setTimeout(()=> spawnHeart({}), i*60);
  }

  // intentar reproducir audio en caso de bloqueo (click permite sonido)
  tryPlayAudio();
});

// Intentar play al load (probablemente bloqueado por política)
window.addEventListener('load', () => {
  tryPlayAudio();
});

// también reproducir audio en primer toque anywhere (móviles)
window.addEventListener('touchstart', function once() {
  tryPlayAudio();
  window.removeEventListener('touchstart', once);
}, {passive:true});