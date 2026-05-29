import React, { useRef, useEffect } from 'react';
import { useClass } from '../../context/ClassContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { confettiTriggerCount } = useClass();

  const colors = ['#feb700', '#004d3d', '#aff0d9', '#93d3be', '#ffdea8', '#c5c5d8', '#ffba20'];

  // Trigger burst when count increases
  useEffect(() => {
    if (confettiTriggerCount === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const count = 50 + Math.random() * 30;
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.45; // slightly above middle

    const newParticles: Particle[] = Array.from({ length: count }).map(() => ({
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 12 - 5, // shoot upwards
      radius: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    }));

    particlesRef.current = [...particlesRef.current, ...newParticles].slice(0, 150); // limit screen clutter
  }, [confettiTriggerCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.vx *= 0.98; // physics air drag
        p.vy += 0.35; // gravity pulls down
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012; // fade out slowly

        if (p.opacity <= 0) {
          return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Draw cute little rectangular/pill confetti pieces
        ctx.fillRect(-p.radius, -p.radius / 2, p.radius * 2, p.radius);
        ctx.restore();
      });

      // Filter dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
    />
  );
};
