import { useEffect, useRef } from 'react';

interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  hue: 'cyan' | 'magenta';
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  hue: 'cyan' | 'magenta';
}

function drawGlowingButterfly(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  flapPhase: number,
  scale: number,
  hue: 'cyan' | 'magenta'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // Dynamic 3D foreshortened wing flap
  const wingSpread = 0.22 + 0.78 * Math.abs(Math.sin(flapPhase));

  const primary = hue === 'cyan' ? '#38BDF8' : '#E879F9';
  const bright = hue === 'cyan' ? '#E0F2FE' : '#FDF4FF';
  const outerGlow =
    hue === 'cyan' ? 'rgba(56, 189, 248, 0.9)' : 'rgba(232, 121, 249, 0.9)';

  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = outerGlow;
  ctx.shadowBlur = 22;

  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(1, side * wingSpread);

    const grad = ctx.createRadialGradient(0, 2, 1, -2, 18, 32);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, bright);
    grad.addColorStop(0.7, primary);
    grad.addColorStop(1, 'rgba(255,255,255,0.1)');

    ctx.fillStyle = grad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1;

    // Upper forewing
    ctx.beginPath();
    ctx.moveTo(5, 1);
    ctx.bezierCurveTo(18, 13, 16, 30, -2, 33);
    ctx.bezierCurveTo(-13, 34, -17, 19, -6, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lower hindwing
    ctx.beginPath();
    ctx.moveTo(-3, 2);
    ctx.bezierCurveTo(-15, 11, -26, 24, -17, 29);
    ctx.bezierCurveTo(-10, 32, -4, 19, -1, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // Luminous body & antennae
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(8, -0.5);
  ctx.quadraticCurveTo(14, -5.5, 17, -4.5);
  ctx.moveTo(8, 0.5);
  ctx.quadraticCurveTo(14, 5.5, 17, 4.5);
  ctx.stroke();

  ctx.restore();
}

export function ButterflyNebulaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);

    const smokePuffs: SmokePuff[] = [];
    const sparkles: Sparkle[] = [];

    let prevCyan = { x: width * 0.65, y: height * 0.25 };
    let prevMagenta = { x: width * 0.35, y: height * 0.45 };
    let initialized = false;
    const startTime = performance.now();

    const render = (now: number) => {
      const t = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      // Wide sweeping cross-screen flight across the hero (biased nicely toward the open upper/right sky)
      const centerX = isMobile ? width * 0.56 : width * 0.48;
      const centerY = isMobile ? height * 0.3 : height * 0.42;
      const rangeX = isMobile ? width * 0.36 : width * 0.38;
      const rangeY = isMobile ? height * 0.22 : height * 0.3;

      const cyanX =
        centerX + Math.sin(t * 0.55) * rangeX + Math.cos(t * 0.27) * (rangeX * 0.18);
      const cyanY =
        centerY + Math.sin(t * 0.88 + 0.4) * rangeY;

      const magX =
        centerX + Math.sin(t * 0.55 + Math.PI) * rangeX - Math.cos(t * 0.27) * (rangeX * 0.15);
      const magY =
        centerY + Math.sin(t * 0.88 + Math.PI + 0.4) * rangeY;

      if (!initialized) {
        prevCyan = { x: cyanX, y: cyanY };
        prevMagenta = { x: magX, y: magY };
        initialized = true;
      }

      const cyanAngle = Math.atan2(cyanY - prevCyan.y, cyanX - prevCyan.x);
      const magAngle = Math.atan2(magY - prevMagenta.y, magX - prevMagenta.x);

      // Emit silky nebula smoke trail behind each moving butterfly
      smokePuffs.push({
        x: cyanX + (Math.random() - 0.5) * 5,
        y: cyanY + (Math.random() - 0.5) * 5,
        vx: (prevCyan.x - cyanX) * 0.12 + (Math.random() - 0.5) * 0.3,
        vy: (prevCyan.y - cyanY) * 0.12 - 0.1 + (Math.random() - 0.5) * 0.3,
        radius: 18 + Math.random() * 18,
        alpha: 0.22,
        decay: 0.0042,
        hue: 'cyan',
      });

      smokePuffs.push({
        x: magX + (Math.random() - 0.5) * 5,
        y: magY + (Math.random() - 0.5) * 5,
        vx: (prevMagenta.x - magX) * 0.12 + (Math.random() - 0.5) * 0.3,
        vy: (prevMagenta.y - magY) * 0.12 - 0.1 + (Math.random() - 0.5) * 0.3,
        radius: 18 + Math.random() * 18,
        alpha: 0.22,
        decay: 0.0042,
        hue: 'magenta',
      });

      // Stardust sparkles
      if (Math.random() < 0.85) {
        sparkles.push({
          x: cyanX + (Math.random() - 0.5) * 16,
          y: cyanY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55 - 0.15,
          size: 1 + Math.random() * 1.9,
          alpha: 0.95,
          decay: 0.013,
          hue: 'cyan',
        });
      }
      if (Math.random() < 0.85) {
        sparkles.push({
          x: magX + (Math.random() - 0.5) * 16,
          y: magY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55 - 0.15,
          size: 1 + Math.random() * 1.9,
          alpha: 0.95,
          decay: 0.013,
          hue: 'magenta',
        });
      }

      // Cap trail arrays to keep framerate locked at 60fps
      if (smokePuffs.length > 260) smokePuffs.splice(0, smokePuffs.length - 260);
      if (sparkles.length > 220) sparkles.splice(0, sparkles.length - 220);

      prevCyan = { x: cyanX, y: cyanY };
      prevMagenta = { x: magX, y: magY };

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = smokePuffs.length - 1; i >= 0; i--) {
        const p = smokePuffs[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += 0.35;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          smokePuffs.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        if (p.hue === 'cyan') {
          grad.addColorStop(0, `rgba(56, 189, 248, ${p.alpha})`);
          grad.addColorStop(0.5, `rgba(14, 165, 233, ${p.alpha * 0.45})`);
          grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
        } else {
          grad.addColorStop(0, `rgba(232, 121, 249, ${p.alpha})`);
          grad.addColorStop(0.5, `rgba(192, 38, 211, ${p.alpha * 0.45})`);
          grad.addColorStop(1, 'rgba(192, 38, 211, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.fillStyle =
          s.hue === 'cyan'
            ? `rgba(224, 242, 254, ${s.alpha})`
            : `rgba(253, 244, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      const scaleFactor = isMobile ? 0.92 : 1.08;
      drawGlowingButterfly(ctx, cyanX, cyanY, cyanAngle, t * 8.2, scaleFactor, 'cyan');
      drawGlowingButterfly(ctx, magX, magY, magAngle, t * 8.6 + 1.5, scaleFactor * 0.95, 'magenta');

      animFrame = window.requestAnimationFrame(render);
    };

    animFrame = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[6] overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
