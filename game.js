// Audio System using Web Audio API (no external files needed)
class SoundSystem {
  constructor() {
    this.enabled = true;
    this.audioContext = null;
    this.backgroundMusic = null;
    this.bassOscillator = null;
    this.musicGain = null;
    this.isMusicPlaying = false;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
      console.log('Web Audio API not supported');
      this.enabled = false;
    }
  }

  // Start background music (8-bit retro style)
  startBackgroundMusic() {
    if (!this.enabled || !this.audioContext || this.isMusicPlaying) return;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    this.isMusicPlaying = true;
    this.musicGain = this.audioContext.createGain();
    this.musicGain.gain.value = 0.15;
    this.musicGain.connect(this.audioContext.destination);
    
    this.playMelodyNote(261.63, 0.2);
    setTimeout(() => this.playMelodyNote(293.66, 0.2), 250);
    setTimeout(() => this.playMelodyNote(329.63, 0.2), 500);
    setTimeout(() => this.playMelodyNote(349.23, 0.2), 750);
    setTimeout(() => this.playMelodyNote(392.00, 0.2), 1000);
    setTimeout(() => this.playMelodyNote(349.23, 0.2), 1250);
    setTimeout(() => this.playMelodyNote(329.63, 0.2), 1500);
    setTimeout(() => this.playMelodyNote(293.66, 0.2), 1750);
    setTimeout(() => this.playMelodyNote(261.63, 0.4), 2000);
    
    this.musicLoopInterval = setInterval(() => {
      if (this.isMusicPlaying && this.enabled) {
        this.playMelodyNote(261.63, 0.2);
        setTimeout(() => this.playMelodyNote(293.66, 0.2), 250);
        setTimeout(() => this.playMelodyNote(329.63, 0.2), 500);
        setTimeout(() => this.playMelodyNote(349.23, 0.2), 750);
        setTimeout(() => this.playMelodyNote(392.00, 0.2), 1000);
        setTimeout(() => this.playMelodyNote(349.23, 0.2), 1250);
        setTimeout(() => this.playMelodyNote(329.63, 0.2), 1500);
        setTimeout(() => this.playMelodyNote(293.66, 0.2), 1750);
        setTimeout(() => this.playMelodyNote(261.63, 0.4), 2000);
      }
    }, 2400);
  }

  playMelodyNote(frequency, duration) {
    if (!this.enabled || !this.audioContext || !this.isMusicPlaying) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.musicGain);
    
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicLoopInterval) {
      clearInterval(this.musicLoopInterval);
    }
  }

  playJump() {
    if (!this.enabled || !this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.frequency.value = 1046.50;
    gain.gain.value = 0.25;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.3);
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  playScore() {
    if (!this.enabled || !this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.frequency.value = 659.25;
    gain.gain.value = 0.2;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.2);
    osc.stop(this.audioContext.currentTime + 0.2);
    
    setTimeout(() => {
      const osc2 = this.audioContext.createOscillator();
      const gain2 = this.audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(this.audioContext.destination);
      osc2.frequency.value = 783.99;
      gain2.gain.value = 0.15;
      osc2.start();
      gain2.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.2);
      osc2.stop(this.audioContext.currentTime + 0.2);
    }, 50);
  }

  playGameOver() {
    if (!this.enabled || !this.audioContext) return;
    
    const notes = [523.25, 493.88, 440.00, 392.00, 349.23];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.value = 0.3;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.4);
        osc.stop(this.audioContext.currentTime + 0.4);
      }, i * 150);
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled && this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    if (!this.enabled && this.isMusicPlaying) {
      this.stopBackgroundMusic();
    } else if (this.enabled && !this.isMusicPlaying) {
      this.startBackgroundMusic();
    }
    return this.enabled;
  }
}

// Particle System
class ParticleSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.particles = [];
  }

  addExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 4,
        life: 1,
        size: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 60 + 20}, 80%, 60%)`
      });
    }
  }

  addJumpDust(x, y) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x: x,
        y: y + 10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3,
        life: 0.8,
        size: Math.random() * 4 + 1,
        color: '#A0826A'
      });
    }
  }

  addLandingDust(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x,
        y: y + 15,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2,
        life: 0.6,
        size: Math.random() * 3 + 1,
        color: '#8B7355'
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= 0.02;
      
      if (p.life <= 0 || p.y > 500) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
      this.ctx.restore();
    }
  }
}

// Main Game Class
class ChiefDataRunner {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.sound = new SoundSystem();
    this.particles = new ParticleSystem(this.ctx);
    this.userInteracted = false;
    this.isPaused = false;
    
    this.setupCanvas();
    this.initGame();
    this.bindEvents();
    this.resizeCanvas();
    this.gameLoop();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  setupCanvas() {
    // Canvas size will be set dynamically
    this.groundY = this.canvas.height - 60;
  }

  resizeCanvas() {
    const container = this.canvas.parentElement;
    const maxWidth = Math.min(1200, container.clientWidth - 40);
    this.canvas.width = maxWidth;
    this.canvas.height = 400;
    this.groundY = this.canvas.height - 60;
    
    // Reposition dino
    if (this.dino) {
      this.dino.y = this.groundY - this.dino.height;
    }
  }

  initGame() {
    this.gameRunning = true;
    this.score = 0;
    this.bestScore = localStorage.getItem('chiefDataBest') || 0;
    this.speed = 5;
    this.baseSpeed = 5;
    this.maxSpeed = 14;
    
    this.dino = {
      x: 100,
      y: this.groundY - 45,
      width: 35,
      height: 45,
      vy: 0,
      grounded: true
    };
    
    this.obstacles = [];
    this.spawnTimer = 0;
    this.spawnDelay = 80;
    this.frameCount = 0;
    this.wasGrounded = true;
    
    document.getElementById('bestScoreSpan').innerText = this.bestScore;
    document.getElementById('scoreValue').innerText = '0';
    document.getElementById('speedValue').innerText = this.speed.toFixed(1);
    
    this.gravity = 0.68;
    this.jumpPower = -13.5;
    
    this.obstacleTypes = [
      { w: 25, h: 40, color: '#E74C3C', icon: '🌵' },
      { w: 28, h: 35, color: '#F39C12', icon: '🪨' },
      { w: 24, h: 38, color: '#2ECC71', icon: '🌿' },
      { w: 30, h: 32, color: '#9B59B6', icon: '🌸' },
      { w: 22, h: 42, color: '#3498DB', icon: '💎' }
    ];
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      // Pause with P key
      if (e.code === 'KeyP') {
        e.preventDefault();
        this.togglePause();
      }
      
      if (!this.isPaused) {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          this.jump();
        }
        if (e.code === 'KeyR') {
          this.reset();
        }
      }
    });
    
    this.canvas.addEventListener('click', () => {
      if (!this.isPaused) this.jump();
    });
    
    const startMusicOnInteraction = () => {
      if (!this.userInteracted) {
        this.userInteracted = true;
        this.sound.startBackgroundMusic();
      }
    };
    
    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('keydown', startMusicOnInteraction);
    
    document.getElementById('mainActionBtn').addEventListener('click', () => {
      startMusicOnInteraction();
      this.reset();
    });
    
    document.getElementById('pauseBtn').addEventListener('click', () => {
      this.togglePause();
    });
    
    document.getElementById('resumeBtn').addEventListener('click', () => {
      this.togglePause();
    });
    
    document.getElementById('restartFromPauseBtn').addEventListener('click', () => {
      this.reset();
      this.isPaused = false;
      document.getElementById('pauseOverlay').style.display = 'none';
    });
    
    document.getElementById('soundToggle').addEventListener('click', () => {
      const enabled = this.sound.toggle();
      document.getElementById('soundToggle').innerHTML = enabled ? '🔊 SOUND ON' : '🔇 SOUND OFF';
    });
    
    document.getElementById('darkModeToggle').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  togglePause() {
    if (!this.gameRunning) {
      // If game is over, reset instead
      this.reset();
      return;
    }
    
    this.isPaused = !this.isPaused;
    const pauseOverlay = document.getElementById('pauseOverlay');
    
    if (this.isPaused) {
      pauseOverlay.style.display = 'flex';
      if (this.sound.isMusicPlaying) {
        this.sound.musicGain.gain.value = 0.05; // Lower music volume when paused
      }
    } else {
      pauseOverlay.style.display = 'none';
      if (this.sound.isMusicPlaying) {
        this.sound.musicGain.gain.value = 0.15; // Restore music volume
      }
    }
  }

  jump() {
    if (!this.gameRunning) {
      this.reset();
      return;
    }
    
    if (this.dino.grounded && !this.isPaused) {
      this.dino.vy = this.jumpPower;
      this.dino.grounded = false;
      this.sound.playJump();
      this.particles.addJumpDust(this.dino.x, this.dino.y + this.dino.height);
    }
  }

  reset() {
    this.gameRunning = true;
    this.isPaused = false;
    this.score = 0;
    this.speed = this.baseSpeed;
    this.obstacles = [];
    this.dino.y = this.groundY - this.dino.height;
    this.dino.vy = 0;
    this.dino.grounded = true;
    this.spawnTimer = 20;
    document.getElementById('scoreValue').innerText = '0';
    document.getElementById('speedValue').innerText = this.speed.toFixed(1);
    document.getElementById('mainActionBtn').innerHTML = '🚀 PLAY GAME';
    document.getElementById('pauseOverlay').style.display = 'none';
    
    // Restart background music if it was stopped
    if (this.sound.enabled && !this.sound.isMusicPlaying && this.userInteracted) {
      this.sound.startBackgroundMusic();
    }
  }

  spawnObstacle() {
    const type = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];
    this.obstacles.push({
      x: this.canvas.width,
      y: this.groundY - type.h,
      w: type.w,
      h: type.h,
      type: type,
      scored: false
    });
  }

  update() {
    if (!this.gameRunning || this.isPaused) return;
    
    const wasGrounded = this.dino.grounded;
    
    this.dino.vy += this.gravity;
    this.dino.y += this.dino.vy;
    
    if (this.dino.y >= this.groundY - this.dino.height) {
      if (!wasGrounded && !this.dino.grounded) {
        this.particles.addLandingDust(this.dino.x, this.groundY - this.dino.height);
      }
      this.dino.y = this.groundY - this.dino.height;
      this.dino.vy = 0;
      this.dino.grounded = true;
    }
    
    if (this.dino.y < 0) {
      this.dino.y = 0;
      this.dino.vy = 0;
    }
    
    this.speed = Math.min(this.baseSpeed + Math.floor(this.score / 400), this.maxSpeed);
    document.getElementById('speedValue').innerText = this.speed.toFixed(1);
    
    if (this.spawnTimer <= 0) {
      this.spawnObstacle();
      this.spawnTimer = Math.max(50, this.spawnDelay - Math.floor(this.score / 250));
    } else {
      this.spawnTimer--;
    }
    
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].x -= this.speed;
      
      const dinoHitbox = {
        x: this.dino.x + 3,
        y: this.dino.y + 2,
        w: this.dino.width - 6,
        h: this.dino.height - 4
      };
      
      const obsHitbox = {
        x: this.obstacles[i].x + 2,
        y: this.obstacles[i].y,
        w: this.obstacles[i].w - 4,
        h: this.obstacles[i].h
      };
      
      if (dinoHitbox.x < obsHitbox.x + obsHitbox.w &&
          dinoHitbox.x + dinoHitbox.w > obsHitbox.x &&
          dinoHitbox.y < obsHitbox.y + obsHitbox.h &&
          dinoHitbox.y + dinoHitbox.h > obsHitbox.y) {
        this.gameRunning = false;
        this.sound.playGameOver();
        this.sound.stopBackgroundMusic();
        this.particles.addExplosion(this.dino.x + this.dino.width/2, this.dino.y + this.dino.height/2);
        document.getElementById('mainActionBtn').innerHTML = '💀 RESTART GAME';
        return;
      }
      
      if (!this.obstacles[i].scored && this.obstacles[i].x + this.obstacles[i].w < this.dino.x) {
        this.obstacles[i].scored = true;
        this.score += 15;
        this.sound.playScore();
        document.getElementById('scoreValue').innerText = Math.floor(this.score);
        
        if (Math.floor(this.score) > this.bestScore) {
          this.bestScore = Math.floor(this.score);
          localStorage.setItem('chiefDataBest', this.bestScore);
          document.getElementById('bestScoreSpan').innerText = this.bestScore;
        }
      }
    }
    
    this.obstacles = this.obstacles.filter(obs => obs.x + obs.w > 0);
    this.score += 0.25;
    document.getElementById('scoreValue').innerText = Math.floor(this.score);
    this.particles.update();
  }

  drawBackground() {
    const isDark = document.body.classList.contains('dark-mode');
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    
    if (isDark) {
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(1, '#16213e');
    } else {
      grad.addColorStop(0, '#87CEEB');
      grad.addColorStop(0.7, '#98D8C8');
      grad.addColorStop(1, '#E8F5E9');
    }
    
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!isDark) {
      this.ctx.fillStyle = '#FFD700';
      this.ctx.shadowBlur = 20;
      this.ctx.beginPath();
      this.ctx.arc(100, 80, 35, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.fillStyle = '#C0C0C0';
      this.ctx.beginPath();
      this.ctx.arc(100, 80, 30, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0;
    
    this.ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 4; i++) {
      const x = (this.frameCount * 0.3 + i * 400) % (this.canvas.width + 300) - 200;
      this.ctx.beginPath();
      this.ctx.ellipse(x, 60, 50, 35, 0, 0, Math.PI * 2);
      this.ctx.ellipse(x + 40, 50, 45, 32, 0, 0, Math.PI * 2);
      this.ctx.ellipse(x - 35, 55, 42, 30, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.fillStyle = isDark ? '#2d2d3f' : '#8B7355';
    this.ctx.fillRect(0, this.groundY, this.canvas.width, 5);
    this.ctx.fillStyle = isDark ? '#3d3d5f' : '#A0826A';
    this.ctx.fillRect(0, this.groundY + 5, this.canvas.width, 8);
    
    this.ctx.fillStyle = isDark ? '#4a7c59' : '#6B8E23';
    for (let i = 0; i < 25; i++) {
      const x = (this.frameCount * 1.2 + i * 50) % this.canvas.width;
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.groundY);
      this.ctx.lineTo(x - 4, this.groundY - 12);
      this.ctx.lineTo(x + 4, this.groundY - 10);
      this.ctx.fill();
    }
  }

  drawDino() {
    this.ctx.save();
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
    
    let stretchX = 1;
    let stretchY = 1;
    if (!this.dino.grounded && this.dino.vy < -5) {
      stretchX = 0.9;
      stretchY = 1.1;
    } else if (!this.dino.grounded && this.dino.vy > 3) {
      stretchX = 1.05;
      stretchY = 0.95;
    }
    
    this.ctx.translate(this.dino.x + this.dino.width/2, this.dino.y + this.dino.height/2);
    this.ctx.scale(stretchX, stretchY);
    this.ctx.translate(-(this.dino.x + this.dino.width/2), -(this.dino.y + this.dino.height/2));
    
    const grad = this.ctx.createLinearGradient(this.dino.x, this.dino.y, this.dino.x + 10, this.dino.y + this.dino.height);
    grad.addColorStop(0, '#4CAF50');
    grad.addColorStop(1, '#2E7D32');
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.roundRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height, 12);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#A5D6A7';
    this.ctx.beginPath();
    this.ctx.ellipse(this.dino.x + 12, this.dino.y + this.dino.height - 12, 10, 14, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.dino.x + this.dino.width - 10, this.dino.y + 15, 7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.beginPath();
    this.ctx.arc(this.dino.x + this.dino.width - 8, this.dino.y + 14, 3.5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.dino.x + this.dino.width - 10, this.dino.y + 12, 1.5, 0, Math.PI * 2);
    this.ctx.fill();
    
    if (!this.dino.grounded) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.dino.x + this.dino.width - 15, this.dino.y + 8);
      this.ctx.lineTo(this.dino.x + this.dino.width - 5, this.dino.y + 10);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#1a1a1a';
      this.ctx.stroke();
    }
    
    this.ctx.fillStyle = '#F9A825';
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.dino.x + 5 + i * 12, this.dino.y - 5);
      this.ctx.lineTo(this.dino.x + 9 + i * 12, this.dino.y - 14);
      this.ctx.lineTo(this.dino.x + 13 + i * 12, this.dino.y - 5);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  drawObstacles() {
    for (const obs of this.obstacles) {
      this.ctx.save();
      this.ctx.shadowBlur = 4;
      
      const grad = this.ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.w, obs.y + obs.h);
      grad.addColorStop(0, obs.type.color);
      grad.addColorStop(1, this.darkenColor(obs.type.color));
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 8);
      this.ctx.fill();
      
      this.ctx.font = `${obs.w + 5}px "Segoe UI Emoji"`;
      this.ctx.fillStyle = 'white';
      this.ctx.shadowBlur = 2;
      this.ctx.fillText(obs.type.icon, obs.x + 4, obs.y + obs.h - 8);
      
      this.ctx.restore();
    }
  }

  drawGameOver() {
    if (!this.gameRunning) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.font = 'bold 48px "Segoe UI"';
      this.ctx.fillStyle = '#ff6b6b';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText('GAME OVER', this.canvas.width / 2 - 140, this.canvas.height / 2 - 40);
      
      this.ctx.font = '24px "Segoe UI"';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(`Score: ${Math.floor(this.score)}`, this.canvas.width / 2 - 60, this.canvas.height / 2 + 20);
      this.ctx.font = '18px "Segoe UI"';
      this.ctx.fillText('Press SPACE, UP, W or click RESTART', this.canvas.width / 2 - 170, this.canvas.height / 2 + 70);
    }
  }

  darkenColor(color) {
    return color;
  }

  drawUI() {
    this.ctx.font = 'bold 28px monospace';
    this.ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#333';
    this.ctx.shadowBlur = 0;
    this.ctx.fillText(`⚡ ${Math.floor(this.score)}`, this.canvas.width - 100, 50);
    
    if (this.dino.grounded && this.gameRunning && !this.isPaused) {
      this.ctx.font = 'bold 14px monospace';
      this.ctx.fillStyle = '#4CAF50';
      this.ctx.fillText('↑ JUMP READY ↑', this.dino.x - 10, this.dino.y - 10);
    }
    
    if (this.isPaused && this.gameRunning) {
      this.ctx.font = 'bold 24px monospace';
      this.ctx.fillStyle = '#ffd700';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText('⏸ PAUSED', this.canvas.width / 2 - 60, this.canvas.height / 2);
    }
  }

  render() {
    this.drawBackground();
    this.drawObstacles();
    this.drawDino();
    this.particles.draw();
    this.drawGameOver();
    this.drawUI();
    this.frameCount++;
  }

  gameLoop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.gameLoop);
  }
}

// Helper for rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.moveTo(x + r, y);
  this.lineTo(x + w - r, y);
  this.quadraticCurveTo(x + w, y, x + w, y + r);
  this.lineTo(x + w, y + h - r);
  this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  this.lineTo(x + r, y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r);
  this.lineTo(x, y + r);
  this.quadraticCurveTo(x, y, x + r, y);
  return this;
};

// Start the game
window.addEventListener('DOMContentLoaded', () => {
  new ChiefDataRunner();
});