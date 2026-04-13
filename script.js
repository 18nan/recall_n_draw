/* DATA */
var WORDS = [
  "Apple","Banana","Bicycle","Bridge","Butterfly","Camera","Castle",
  "Crown","Dragon","Elephant","Fish","Flower","Guitar","Hat","Heart",
  "House","Key","Kite","Lamp","Leaf","Lion","Moon","Mountain","Owl",
  "Rainbow","Robot","Rocket","Rose","Ship","Star","Sun","Tiger",
  "Tree","Umbrella","Volcano","Watch","Whale","Wolf","Zebra","Clock"
];

var DESCRIPTIONS = [
  "A rabbit holding 2 large carrots walking towards a clock showing 3:15",
  "A boy wearing a red hat riding a yellow bicycle next to a tall green tree",
  "A girl with pink hair sitting on a blue bench reading a very thick book",
  "A small orange cat chasing a purple butterfly near a yellow flower field",
  "A penguin wearing a scarf standing next to a big melting snowman at sunset"
];

/* STATE */
var currentLevel = 1;
var currentWords = [];
var currentDesc  = '';
var brushColor   = '#e63027';
var brushSize    = 4;
var isDrawing    = false;
var lastX = 0, lastY = 0;

/* CANVAS SETUP */
var canvas = document.getElementById('drawCanvas');
var ctx    = canvas.getContext('2d');

function resizeCanvas() {
  var w = Math.min(860, window.innerWidth - 32);
  canvas.style.width  = w + 'px';
  canvas.style.height = (w * 480 / 860) + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getPos(e) {
  var r = canvas.getBoundingClientRect();
  return [
    (e.clientX - r.left) * (canvas.width  / r.width),
    (e.clientY - r.top)  * (canvas.height / r.height)
  ];
}

/* DRAWING EVENTS */
canvas.addEventListener('pointerdown', function(e) {
  e.preventDefault();
  isDrawing = true;
  var p = getPos(e); lastX = p[0]; lastY = p[1];
  ctx.beginPath();
  ctx.arc(lastX, lastY, brushSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = brushColor;
  ctx.fill();
});

canvas.addEventListener('pointermove', function(e) {
  if (!isDrawing) return;
  e.preventDefault();
  var p = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(p[0], p[1]);
  ctx.strokeStyle = brushColor;
  ctx.lineWidth   = brushSize;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.stroke();
  lastX = p[0]; lastY = p[1];
});

canvas.addEventListener('pointerup',  function() { isDrawing = false; });
canvas.addEventListener('pointerout', function() { isDrawing = false; });

/* UTILS */
function pickColor(el) {
  brushColor = el.getAttribute('data-c');
  document.querySelectorAll('.swatch').forEach(function(s) { s.classList.remove('active'); });
  el.classList.add('active');
}

function clearCanvas() {
  if (confirm('Clear the canvas?')) { ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

function show(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
}

function toggleDark() {
  document.body.classList.toggle('dark');
  var btn = document.getElementById('darkBtn');
  btn.textContent = document.body.classList.contains('dark') ? 'Light' : 'Dark';
}

function togglePw(id) {
  var input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* AUTH LOGIC */
function login() {
  var name  = document.getElementById('loginName').value.trim();
  var email = document.getElementById('loginEmail').value.trim();
  var pass  = document.getElementById('loginPass').value;
  var err   = document.getElementById('loginErr');
  err.textContent = '';
  if (!name || email.indexOf('@') < 0 || pass.length < 6) {
    err.textContent = 'Invalid credentials. Check name, email, and password.';
    return;
  }
  show('homeScreen');
}

function signup() {
  var name = document.getElementById('suName').value.trim();
  var ok = confirm('Create account for ' + name + '?');
  if (ok) show('loginScreen');
}

function forgotPassword() {
  var newPass = prompt('Enter new password (min 6):');
  if (newPass && newPass.length >= 6) alert('Password reset!');
}

/* GAME LOGIC */
function startLevel(lv) {
  currentLevel = lv;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (lv === 1) {
    currentWords = WORDS.slice().sort(() => 0.5 - Math.random()).slice(0, 5);
    document.getElementById('memBox').textContent = currentWords.join('   ·   ');
    document.getElementById('memBox').style.display = 'block';
    document.getElementById('descBox').style.display = 'none';
    showMemory(3);
  } else {
    currentDesc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
    document.getElementById('descBox').textContent = currentDesc;
    document.getElementById('descBox').style.display = 'block';
    document.getElementById('memBox').style.display = 'none';
    showMemory(5);
  }
}

function showMemory(secs) {
  show('memoryScreen');
  var t = secs;
  document.getElementById('memCountdown').textContent = t;
  var fill = document.getElementById('progFill');
  fill.style.transition = 'none'; fill.style.width = '100%';
  setTimeout(() => {
    fill.style.transition = 'width ' + secs + 's linear';
    fill.style.width = '0%';
  }, 50);
  var iv = setInterval(() => {
    t--;
    document.getElementById('memCountdown').textContent = t;
    if (t <= 0) {
      clearInterval(iv);
      startDrawing();
    }
  }, 1000);
}

function startDrawing() {
  show('drawScreen');
  document.getElementById('drawTitle').textContent = currentLevel === 1 ? 'Draw the 5 words' : 'Draw the scene';
}

function submitDrawing() {
  show('resultScreen');
  var ansBox = document.getElementById('ansBox');
  if (currentLevel === 1) {
    ansBox.textContent = currentWords.join('\n');
    document.getElementById('nextBtn').style.display = 'inline-block';
  } else {
    ansBox.textContent = currentDesc;
    document.getElementById('nextBtn').style.display = 'none';
  }
  var rc = document.getElementById('resultCanvas').getContext('2d');
  rc.clearRect(100, 100, 500, 500);
  rc.drawImage(canvas, 100, 100, canvas.width, canvas.height, 100, 100, 500,500);
}

function goHome() { show('homeScreen'); }