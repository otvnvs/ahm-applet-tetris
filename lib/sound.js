class TetrisAudioEngine {
  constructor() {
    this.ctx = null;
    this.activeNodes = []; // Tracks playing audio oscillators for lifecycle cleanup
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  trackNode(osc, gain) {
    const nodeRef = { osc, gain };
    this.activeNodes.push(nodeRef);
    osc.onended = () => {
      this.activeNodes = this.activeNodes.filter(n => n !== nodeRef);
    };
  }

  // Hard stop mechanism for component unmount
  stopAll() {
    this.activeNodes.forEach(node => {
      try {
        node.osc.stop();
        node.osc.disconnect();
        node.gain.disconnect();
      } catch (e) {
        // Suppress already completed buffers
      }
    });
    this.activeNodes = [];
  }

  playMove() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    this.trackNode(osc, gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playRotate() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(580, this.ctx.currentTime + 0.06);
    
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    this.trackNode(osc, gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playLineClear() {
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      
      gain.gain.setValueAtTime(0.04, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.12);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      this.trackNode(osc, gain);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.12);
    });
  }

  playGameOver() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    this.trackNode(osc, gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}

export const tetrisSfx = new TetrisAudioEngine();

