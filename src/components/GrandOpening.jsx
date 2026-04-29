import React, { useState, useEffect, useRef } from 'react';
import './GrandOpening.css';
import curtainImg from '../assets/curtain.png';
import ribbonImg from '../assets/ribbon.png';
import posterImg from '../assets/poster.png';

const COLORS = ['#FFD700', '#FF3366', '#FF6600', '#00CFFF', '#C8FF00', '#CC00FF', '#FFFFFF'];
const SHAPES = ['circle', 'square', 'star', 'rect'];

const GrandOpening = () => {
  const [phase, setPhase] = useState(0); // 0: IDLE, 1: SCISSORS, 2: CUT, 3: CURTAIN, 4: REVEAL
  const [snipping, setSnipping] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  // Particle creation helper
  const createParticle = (x, y, type) => {
    const size = type === 'burst' ? Math.random() * 8 + 4 : type === 'antigravity' ? Math.random() * 10 + 6 : Math.random() * 12 + 8;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    
    let vx, vy, gravity, decay, rotSpeed;
    
    if (type === 'burst') {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
      gravity = 0.15;
      decay = 0.015;
      rotSpeed = (Math.random() - 0.5) * 10;
    } else if (type === 'antigravity') {
      vx = (Math.random() - 0.5) * 6;
      vy = -(Math.random() * 5 + 3);
      gravity = -0.03;
      decay = 0.008;
      rotSpeed = (Math.random() - 0.5) * 12;
    } else { // confetti
      vx = (Math.random() - 0.5) * 3;
      vy = Math.random() * 3 + 2;
      gravity = 0.04;
      decay = 0.003;
      rotSpeed = (Math.random() - 0.5) * 8;
    }

    return {
      x, y, vx, vy, gravity, alpha: 1.0, decay, color, shape, size, rotation: Math.random() * 360, rotSpeed, type
    };
  };

  const spawnBurst = () => {
    const x = window.innerWidth / 2;
    const y = window.innerHeight * 0.48;
    for (let i = 0; i < 60; i++) particlesRef.current.push(createParticle(x, y, 'burst'));
    for (let i = 0; i < 30; i++) particlesRef.current.push(createParticle(x, y, 'antigravity'));
  };

  const spawnConfettiRain = () => {
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 150) {
        clearInterval(interval);
        return;
      }
      particlesRef.current.push(createParticle(Math.random() * window.innerWidth, -20, 'confetti'));
      count++;
    }, 20);
  };

  const updateParticles = () => {
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;
    });
  };

  const drawParticles = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    particlesRef.current.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      
      if (p.type === 'antigravity') {
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      }

      switch(p.shape) {
        case 'circle': ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill(); break;
        case 'square': ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); break;
        case 'rect': ctx.fillRect(-p.size, -p.size/4, p.size*2, p.size/2); break;
        case 'star':
          const r = p.size/2;
          ctx.beginPath();
          for(let i=0; i<10; i++) {
            const angle = (i * Math.PI)/5 - Math.PI/2;
            const dist = i%2 === 0 ? r : r/2;
            ctx.lineTo(Math.cos(angle)*dist, Math.sin(angle)*dist);
          }
          ctx.closePath();
          ctx.fill();
          break;
      }
      ctx.restore();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      updateParticles();
      drawParticles(ctx);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleClick = () => {
    if (phase !== 0 && phase !== 4) return;
    if (phase === 4) {
      setPhase(0);
      particlesRef.current = [];
      return;
    }

    setPhase(1);
    
    // Timing Sequence
    setTimeout(() => setSnipping(true), 720); // Snip start
    setTimeout(() => {
      setSnipping(false);
      setPhase(2); // CUT
      spawnBurst();
    }, 1100);

    setTimeout(() => {
      setPhase(3); // Curtains begin
    }, 1800);

    setTimeout(() => {
      setPhase(4); // Reveal
      spawnConfettiRain();
    }, 3000);
  };

  return (
    <div className="grand-opening-stage" onClick={handleClick}>
      <div className="stage-bg"></div>
      <div className="wooden-floor"></div>
      <div className="spotlight"></div>
      
      <canvas ref={canvasRef} className="particle-canvas" />

      <div className={`flash-overlay ${phase === 2 ? 'active' : ''}`}></div>

      <div className={`poster-stage ${phase >= 4 ? 'visible' : ''}`}>
        <div className="god-rays" />
        <div className="poster-container">
          <img src={posterImg} alt="AI-THON 1.0" className="event-poster" />
          <div className="poster-frame"></div>
          <Ornament pos="top-left" />
          <Ornament pos="top-right" />
          <Ornament pos="bottom-left" />
          <Ornament pos="bottom-right" />
        </div>
      </div>

      <div className="curtain-system">
        <div className={`curtain-panel left ${phase >= 3 ? 'open' : ''}`} style={{ backgroundImage: `url(${curtainImg})` }}>
          <div className="curtain-shadow-edge"></div>
          <div className="gold-fringe"></div>
        </div>
        <div className={`curtain-panel right ${phase >= 3 ? 'open' : ''}`} style={{ backgroundImage: `url(${curtainImg})` }}>
          <div className="curtain-shadow-edge"></div>
          <div className="gold-fringe"></div>
        </div>
        <div className="curtain-rod">
          {[...Array(12)].map((_, i) => <div key={i} className="rod-ring" style={{left: `${(i+1)*8}%`}}></div>)}
        </div>
        <div className={`center-seam-shadow ${phase >= 3 ? 'fading' : ''}`}></div>
      </div>

      <div className={`ribbon-display ${phase >= 2 ? 'cut' : ''}`}>
        <div className="ribbon-half left-half">
          <img src={ribbonImg} className="ribbon-img" alt="Ribbon" />
        </div>
        <div className="ribbon-half right-half">
           <img src={ribbonImg} className="ribbon-img" alt="Ribbon" />
        </div>
        <div className={`ribbon-bow ${phase >= 2 ? 'cut' : ''}`}>
          <img src={ribbonImg} className="ribbon-img" alt="Bow" />
        </div>
      </div>

      {phase === 1 && (
        <div className={`scissors-display ${snipping ? 'snipping' : ''}`}>
          <ScissorsSVG />
        </div>
      )}

      <div className="click-prompt">
        {phase === 0 && "✂ Click anywhere to cut the ribbon"}
        {phase === 4 && "✦ Click to replay"}
      </div>
    </div>
  );
};

const ScissorsSVG = () => (
  <svg width="140" height="auto" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="gold-handle" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd060" />
        <stop offset="60%" stopColor="#c8a020" />
        <stop offset="100%" stopColor="#8a6800" />
      </radialGradient>
      <linearGradient id="silver-blade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#d8d8d8" />
        <stop offset="50%" stopColor="#f0f0f0" />
        <stop offset="100%" stopColor="#b0b0b0" />
      </linearGradient>
    </defs>
    {/* Upper Blade */}
    <g className="blade upper">
      <path d="M70 50 L130 30 L135 35 L70 55 Z" fill="url(#silver-blade)" />
      <circle cx="25" cy="30" r="18" stroke="url(#gold-handle)" strokeWidth="6" />
    </g>
    {/* Lower Blade */}
    <g className="blade lower">
      <path d="M70 50 L130 70 L135 65 L70 45 Z" fill="url(#silver-blade)" />
      <circle cx="25" cy="70" r="18" stroke="url(#gold-handle)" strokeWidth="6" />
    </g>
    {/* Pivot */}
    <circle cx="70" cy="50" r="4" fill="#333" />
    <circle cx="70" cy="50" r="2" fill="#888" />
  </svg>
);

const Ornament = ({ pos }) => (
  <div className={`ornament ${pos}`}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="#c8a020">
      <path d="M0 0 Q 20 0 20 20 Q 20 40 0 40 Q 10 20 0 0" />
      <path d="M40 0 Q 20 0 20 20 Q 20 40 40 40 Q 30 20 40 0" transform="scale(-1, 1) translate(-40, 0)" />
    </svg>
  </div>
);

export default GrandOpening;
