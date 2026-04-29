import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const COLORS = [
  '#FFD700',  // gold
  '#FF3366',  // hot pink
  '#FF6600',  // orange
  '#00CFFF',  // cyan
  '#C8FF00',  // lime
  '#CC00FF',  // violet
  '#FFFFFF',  // white
  '#FF99CC',  // soft pink
  '#FFAA00',  // amber
  '#00FF88',  // mint
];

const SHAPES = ['circle', 'square', 'star', 'diamond', 'rect'];

const AntigravityParticles = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const createParticle = (x, y, type = 'main') => {
    let size, color, shape, vx, vy, gravity, decay, scaleX, rotSpeed;

    if (type === 'main') {
      size = Math.random() * 10 + 6;
      color = COLORS[Math.floor(Math.random() * COLORS.length)];
      shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      vx = (Math.random() - 0.5) * 12; // -6 to +6
      vy = -(Math.random() * 8 + 4); // -4 to -12
      gravity = -0.06;
      decay = 0.008;
      scaleX = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
      rotSpeed = (Math.random() - 0.5) * 8; // -4 to +4
    } else if (type === 'ribbon') {
      size = Math.random() * 10 + 18; // 18 to 28
      color = Math.random() > 0.5 ? '#cc0033' : '#ff3366';
      shape = 'rect';
      vx = (Math.random() - 0.5) * 4;
      vy = -(Math.random() * 4 + 3); // -3 to -7
      gravity = -0.04;
      decay = 0.005;
      scaleX = 0.3; // thin
      rotSpeed = (Math.random() - 0.5) * 4;
    } else if (type === 'sparkle') {
      size = Math.random() * 3 + 2; // 2 to 5
      color = Math.random() > 0.5 ? '#FFFFFF' : '#FFD700';
      shape = 'circle';
      vx = (Math.random() - 0.5) * 8;
      vy = -(Math.random() * 8 + 6); // -6 to -14
      gravity = -0.02;
      decay = 0.015;
      scaleX = 1.0;
      rotSpeed = 0;
    }

    return {
      x,
      y,
      vx,
      vy,
      gravity,
      alpha: 1.0,
      decay,
      size,
      rotation: Math.random() * 360,
      rotSpeed,
      color,
      shape,
      trail: [],
      scaleX,
      glowRadius: size * 2.5,
      type
    };
  };

  const drawStar = (ctx, size) => {
    const outerRadius = size / 2;
    const innerRadius = size / 4;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawShape = (ctx, p, sizeOverride = null) => {
    const size = sizeOverride !== null ? sizeOverride : p.size;
    
    ctx.fillStyle = p.color;

    switch (p.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(-size / 2, -size / 2, size, size);
        break;
      case 'rect':
        ctx.fillRect(-size, -size / 3, size * 2, size / 1.5);
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, 0);
        ctx.lineTo(0, size / 2);
        ctx.lineTo(-size / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
      case 'star':
        drawStar(ctx, size);
        break;
      default:
        break;
    }
  };

  const spawnAntigravity = (x, y) => {
    const batches = [0, 100, 200, 400];
    batches.forEach((delay) => {
      setTimeout(() => {
        for (let i = 0; i < 20; i++) {
          particlesRef.current.push(createParticle(x, y, 'main'));
        }
      }, delay);
    });

    // Secondary Wave - Ribbon pieces
    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push(createParticle(x, y, 'ribbon'));
      }
    }, 150);

    // Sparkle layer
    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push(createParticle(x, y, 'sparkle'));
      }
    }, 50);
  };

  useImperativeHandle(ref, () => ({
    spawn: (x, y) => spawnAntigravity(x, y),
  }));

  const updateParticle = (p) => {
    // Save current pos to trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > 4) p.trail.shift();

    // Physics
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.992;
    p.rotation += p.rotSpeed;
    p.alpha -= p.decay;
  };

  const renderParticle = (ctx, p) => {
    ctx.save();
    
    // Trail drawing
    for (let i = 0; i < p.trail.length; i++) {
      const trailAlpha = p.alpha * (i / p.trail.length) * 0.3;
      if (trailAlpha <= 0) continue;
      
      ctx.save();
      ctx.globalAlpha = trailAlpha;
      ctx.translate(p.trail[i].x, p.trail[i].y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.scale(p.scaleX, 1);
      const trailSize = p.size * (i / p.trail.length) * 0.6;
      drawShape(ctx, p, trailSize);
      ctx.restore();
    }

    // Glow effect
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.glowRadius;
    ctx.globalAlpha = p.alpha;

    // Main shape
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.scale(p.scaleX, 1);
    drawShape(ctx, p);

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const ctx = canvas.getContext('2d');

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and filter
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);
      
      // Draw
      particlesRef.current.forEach((p) => {
        updateParticle(p);
        renderParticle(ctx, p);
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
});

export default AntigravityParticles;
