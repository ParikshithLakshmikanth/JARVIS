// ════════════════════════════════════════
//  J.A.R.V.I.S — Frontend App Logic
// ════════════════════════════════════════

/* ── Particle Canvas ── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.4 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0,212,255' : '0,102,255';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── Live Clock ── */
function updateClock() {
  const el = document.getElementById('live-time');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour12: false });
}
updateClock();
setInterval(updateClock, 1000);

/* ── Navbar active link on scroll ── */
const sections = ['home', 'features', 'commands', 'demo', 'about'];
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const target = document.querySelector(`#nav-${entry.target.id}`);
      if (target) target.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

/* ── Feature card scroll animation ── */
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .cmd-card, .step, .tech-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  cardObserver.observe(el);
});

/* ── Command Database ── */
const COMMANDS = [
  { trigger: 'wake up', action: 'Activates JARVIS and plays a greeting based on time of day', category: 'system' },
  { trigger: 'go to sleep', action: 'Puts JARVIS into standby mode', category: 'system' },
  { trigger: 'finally sleep', action: 'Completely exits the JARVIS program', category: 'system' },
  { trigger: 'shutdown system', action: 'Confirms and shuts down your Windows PC', category: 'system' },
  { trigger: 'change password', action: 'Prompts you to set a new access password', category: 'system' },
  { trigger: 'screenshot', action: 'Captures a screenshot and saves it as ss.jpg', category: 'system' },
  { trigger: 'click my photo', action: 'Opens camera app and takes a photo', category: 'system' },
  { trigger: 'open [app/website]', action: 'Opens Chrome, VS Code, Word, Excel, PowerPoint, Paint, CMD or any .com website', category: 'system' },
  { trigger: 'close [app/tabs]', action: 'Closes apps or browser tabs (1–5 tabs supported)', category: 'system' },
  { trigger: 'google [topic]', action: 'Searches Google and reads a Wikipedia summary of the topic', category: 'search' },
  { trigger: 'youtube [song/video]', action: 'Opens YouTube search and plays the first matching video', category: 'search' },
  { trigger: 'wikipedia [topic]', action: 'Fetches a 2-sentence Wikipedia summary and reads it aloud', category: 'search' },
  { trigger: 'news', action: 'Reads latest Indian news headlines — choose Business, Tech, Health, Sports, Science or Entertainment', category: 'info' },
  { trigger: 'temperature', action: 'Scrapes current temperature in Chennai from Google', category: 'info' },
  { trigger: 'weather', action: 'Fetches current weather conditions for Chennai', category: 'info' },
  { trigger: 'what is the time', action: 'Reads out the current system time (HH:MM)', category: 'info' },
  { trigger: 'hello', action: 'JARVIS greets you back', category: 'info' },
  { trigger: 'how are you', action: 'JARVIS responds: "Perfect, sir"', category: 'info' },
  { trigger: 'i am fine', action: 'JARVIS responds: "That\'s great, sir"', category: 'info' },
  { trigger: 'thank you', action: 'JARVIS responds: "You are welcome, sir"', category: 'info' },
  { trigger: 'volume up', action: 'Increases system volume by 5 steps', category: 'media' },
  { trigger: 'volume down', action: 'Decreases system volume by 5 steps', category: 'media' },
  { trigger: 'pause', action: 'Simulates pressing K to pause video (YouTube/VLC)', category: 'media' },
  { trigger: 'play', action: 'Simulates pressing K to resume video playback', category: 'media' },
  { trigger: 'mute', action: 'Simulates pressing M to mute/unmute video', category: 'media' },
  { trigger: 'play a game', action: 'Starts a 5-round Rock Paper Scissors match against JARVIS', category: 'game' },
];

const badgeMap = { search:'search', system:'system', media:'media', info:'info', game:'game' };

function renderCommands(filter = 'all') {
  const grid = document.getElementById('cmd-grid');
  grid.innerHTML = '';
  const filtered = filter === 'all' ? COMMANDS : COMMANDS.filter(c => c.category === filter);
  filtered.forEach(cmd => {
    const card = document.createElement('div');
    card.className = 'cmd-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.innerHTML = `
      <div class="cmd-trigger">${cmd.trigger}</div>
      <div class="cmd-action">${cmd.action}</div>
      <span class="cmd-badge badge-${cmd.category}">${cmd.category.toUpperCase()}</span>
    `;
    grid.appendChild(card);
    cardObserver.observe(card);
  });
}
renderCommands();

document.querySelectorAll('.cmd-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cmd-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCommands(btn.dataset.filter);
  });
});

/* ── Interactive Demo Terminal ── */
const LOCKED = { state: 'locked', attempts: 0 };
const PASSWORD = 'ITZME';
let awake = false;
let gamePlaying = false;
let gameRound = 0, meScore = 0, comScore = 0;
const choices = ['rock', 'paper', 'scissors'];

function termPrint(text, cls = '') {
  const body = document.getElementById('terminal-body');
  const line = document.createElement('div');
  line.className = 'term-line' + (cls ? ' ' + cls : '');
  line.textContent = text;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

function processInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return;
  termPrint(`>> ${trimmed}`, 'user');

  // Password lock phase
  if (LOCKED.state === 'locked') {
    if (trimmed === PASSWORD) {
      LOCKED.state = 'open';
      termPrint('✓ Access granted. Say "wake up" to activate JARVIS.', 'jarvis');
    } else {
      LOCKED.attempts++;
      if (LOCKED.attempts >= 3) {
        termPrint('✗ Too many failed attempts. System locked.', 'error');
        termPrint('Refresh the page to try again.', 'error');
        LOCKED.state = 'dead';
      } else {
        termPrint(`✗ Wrong password. ${3 - LOCKED.attempts} attempt(s) remaining.`, 'error');
      }
    }
    return;
  }

  if (LOCKED.state === 'dead') { termPrint('System locked. Please refresh.', 'error'); return; }

  const q = trimmed.toLowerCase();

  // Game mode
  if (gamePlaying) {
    const valid = choices.find(c => q.includes(c));
    if (!valid) { termPrint('Say rock, paper, or scissors.', 'jarvis'); return; }
    const com = choices[Math.floor(Math.random() * 3)];
    termPrint(`JARVIS chose: ${com.toUpperCase()}`, 'jarvis');
    let result = '';
    if (valid === com) result = 'Draw!';
    else if ((valid==='rock'&&com==='scissors')||(valid==='paper'&&com==='rock')||(valid==='scissors'&&com==='paper')) { meScore++; result = 'You win this round!'; }
    else { comScore++; result = 'JARVIS wins this round!'; }
    termPrint(`${result} | Score → You: ${meScore} | JARVIS: ${comScore}`, 'jarvis');
    gameRound++;
    if (gameRound >= 5) {
      termPrint(`─── FINAL SCORE → You: ${meScore} | JARVIS: ${comScore} ───`, 'jarvis');
      termPrint(meScore > comScore ? '🏆 You WIN! Well played, sir.' : meScore < comScore ? '🤖 JARVIS wins! Better luck next time.' : '🤝 It\'s a tie!', 'jarvis');
      gamePlaying = false; gameRound = 0; meScore = 0; comScore = 0;
    } else {
      termPrint(`Round ${gameRound}/5 — Choose: rock, paper, or scissors`, 'jarvis');
    }
    return;
  }

  // Main logic
  if (q.includes('wake up') && !awake) {
    awake = true;
    const h = new Date().getHours();
    const greeting = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
    termPrint(`${greeting}, sir! Please tell me how can I help you?`, 'jarvis');
    termPrint('[ JARVIS is now ACTIVE ]', 'system');
  } else if (!awake) {
    termPrint('I\'m asleep. Say "wake up" to activate me.', 'jarvis');
  } else if (q.includes('go to sleep')) {
    awake = false;
    termPrint('Ok sir, you can call me anytime. Going to sleep...', 'jarvis');
    termPrint('[ JARVIS is now STANDBY ]', 'system');
  } else if (q.includes('hello')) {
    termPrint('Hello sir, how are you?', 'jarvis');
  } else if (q.includes('i am fine')) {
    termPrint("That's great, sir!", 'jarvis');
  } else if (q.includes('how are you')) {
    termPrint('Perfect, sir! All systems nominal.', 'jarvis');
  } else if (q.includes('thank you')) {
    termPrint('You are welcome, sir.', 'jarvis');
  } else if (q.includes('time')) {
    const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    termPrint(`Sir, the time is ${t}.`, 'jarvis');
  } else if (q.includes('play a game')) {
    gamePlaying = true; gameRound = 1; meScore = 0; comScore = 0;
    termPrint("Let's play ROCK PAPER SCISSORS! Best of 5.", 'jarvis');
    termPrint('Round 1/5 — Choose: rock, paper, or scissors', 'jarvis');
  } else if (q.includes('screenshot')) {
    termPrint('[Simulated] Screenshot captured and saved as ss.jpg', 'jarvis');
  } else if (q.includes('volume up')) {
    termPrint('Turning volume up, sir. (5 steps)', 'jarvis');
  } else if (q.includes('volume down')) {
    termPrint('Turning volume down, sir. (5 steps)', 'jarvis');
  } else if (q.includes('pause')) {
    termPrint('Video paused. (Simulated keypress: K)', 'jarvis');
  } else if (q.includes('play')) {
    termPrint('Video playing. (Simulated keypress: K)', 'jarvis');
  } else if (q.includes('mute')) {
    termPrint('Video muted. (Simulated keypress: M)', 'jarvis');
  } else if (q.includes('temperature') || q.includes('weather')) {
    termPrint('[Fetching] Searching "temperature in Chennai" on Google...', 'system');
    setTimeout(() => termPrint('Current temperature in Chennai: 34°C (simulated). It\'s a hot day, sir!', 'jarvis'), 800);
  } else if (q.includes('news')) {
    termPrint('Which category? [business / health / technology / sports / entertainment / science]', 'jarvis');
  } else if (['business','health','technology','sports','entertainment','science'].some(k => q.includes(k))) {
    const cat = ['business','health','technology','sports','entertainment','science'].find(k => q.includes(k));
    termPrint(`[Fetching] Retrieving top ${cat} headlines from NewsAPI...`, 'system');
    setTimeout(() => termPrint(`[Simulated] Top ${cat} headline: "India leads in ${cat} innovation this quarter." — Times of India`, 'jarvis'), 900);
  } else if (q.includes('google')) {
    const search = q.replace('google','').replace('jarvis','').trim();
    termPrint(`Searching Google for: "${search || 'your query'}"`, 'system');
    setTimeout(() => termPrint(`[Simulated] Opening Google search for "${search || 'your query'}" and reading Wikipedia summary...`, 'jarvis'), 700);
  } else if (q.includes('youtube')) {
    const search = q.replace('youtube','').replace('jarvis','').trim();
    termPrint(`[Opening] YouTube search: "${search || 'your query'}"`, 'jarvis');
  } else if (q.includes('wikipedia')) {
    const search = q.replace('wikipedia','').replace('search','').replace('jarvis','').trim();
    termPrint(`Searching Wikipedia for: "${search}"...`, 'system');
    setTimeout(() => termPrint(`[Simulated] "${search}" is a topic covered on Wikipedia. According to Wikipedia, it refers to a well-documented subject with broad relevance.`, 'jarvis'), 1000);
  } else if (q.includes('open') || q.includes('launch')) {
    const app = q.replace('open','').replace('launch','').replace('jarvis','').trim();
    termPrint(`Launching "${app}", sir...`, 'jarvis');
  } else if (q.includes('close')) {
    const app = q.replace('close','').replace('jarvis','').trim();
    termPrint(`Closing "${app}", sir...`, 'jarvis');
  } else if (q.includes('change password')) {
    termPrint("What's the new password? (Enter it in the terminal below)", 'jarvis');
    LOCKED.state = 'changing_pw';
  } else if (q.includes('shutdown')) {
    termPrint('Are you sure you want to shutdown? (yes/no)', 'jarvis');
  } else if (q === 'yes') {
    termPrint('Initiating system shutdown... (Simulated — no actual shutdown performed)', 'jarvis');
  } else if (q === 'no') {
    termPrint('Shutdown cancelled, sir.', 'jarvis');
  } else {
    termPrint(`Command not recognized: "${trimmed}". Try "hello", "what is the time", or "play a game".`, 'error');
  }
}

const demoInput = document.getElementById('demo-input');
const sendBtn = document.getElementById('btn-send-cmd');

function sendCommand() {
  const val = demoInput.value;
  if (!val.trim()) return;
  processInput(val);
  demoInput.value = '';
  demoInput.focus();
}

sendBtn.addEventListener('click', sendCommand);
demoInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendCommand(); });

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    demoInput.value = chip.dataset.cmd;
    sendCommand();
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

document.getElementById('btn-clear-term').addEventListener('click', () => {
  const body = document.getElementById('terminal-body');
  body.innerHTML = '';
  termPrint('Terminal cleared. JARVIS ready.', 'system');
});

/* ── Orb interactive hover ── */
const orb = document.getElementById('orb-container');
if (orb) {
  orb.addEventListener('mouseenter', () => orb.style.transform = 'scale(1.05)');
  orb.addEventListener('mouseleave', () => orb.style.transform = 'scale(1)');
  orb.style.transition = 'transform 0.5s ease';
}

/* ── Navbar background on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(2,11,24,0.97)' : 'rgba(2,11,24,0.85)';
});
