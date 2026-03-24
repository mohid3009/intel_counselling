
import React, { useRef, useEffect } from 'react';

interface LightWavesProps {
  className?: string;
  themeColors?: string[];
}

const LightWaves: React.FC<LightWavesProps> = ({ 
  className = "", 
  themeColors = ["#A2D2A4", "#86BA90"] 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w: number, h: number;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    window.addEventListener('resize', resize);
    resize();

    const scaleFactor = Math.min(w, h) / 1000;
    const baseLineY = h * 0.22;

    // Balanced amplitude: 50 base + 25 stagger for a calmer look
    const waves = Array.from({ length: 2 }).map((_, i) => ({
      y: baseLineY,
      length: (0.001 + i * 0.0008) / (scaleFactor || 1),
      amplitude: (50 + i * 25) * (scaleFactor || 1), 
      frequency: 0.015 + i * 0.005,
      phase: i * Math.PI,
      color: themeColors[i % themeColors.length],
    }));

    const render = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      
      waves.forEach((wave, i) => {
        const isFrontLayer = i === waves.length - 1;
        
        ctx.beginPath();
        const startY = baseLineY + 
          Math.sin(0 * wave.length + wave.phase + time * 0.0008) * 
          wave.amplitude * 
          Math.cos(time * 0.0003 + wave.phase * 0.5);
        
        ctx.moveTo(0, startY);

        for (let x = 0; x < w; x += 2) {
          const y = baseLineY + 
            Math.sin(x * wave.length + wave.phase + time * 0.0008) * 
            wave.amplitude * 
            Math.cos(time * 0.0003 + wave.phase * 0.5);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, baseLineY - wave.amplitude, 0, h);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(1, 'rgba(247, 235, 211, 0.1)');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = isFrontLayer ? 0.85 : 0.55; 
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, startY);
        for (let x = 0; x < w; x += 2) {
          const y = baseLineY + 
            Math.sin(x * wave.length + wave.phase + time * 0.0008) * 
            wave.amplitude * 
            Math.cos(time * 0.0003 + wave.phase * 0.5);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = isFrontLayer ? 4 : 2.5; 
        ctx.globalAlpha = isFrontLayer ? 1.0 : 0.8; 
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [themeColors]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

export default LightWaves;
