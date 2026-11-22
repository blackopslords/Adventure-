import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import texNeptuneMap from '../assets/images/tex_neptune_map_1794865473810.jpg';
import texMercuryMap from '../assets/images/tex_mercury_map_1794865474467.jpg';
import texSaturnMap from '../assets/images/tex_saturn_map_1794865475426.jpg';
import texLunaMap from '../assets/images/tex_luna_map_1794865475843.jpg';
import texKeplerMap from '../assets/images/tex_kepler_map_1794865475955.jpg';

export interface SpacePlanetTheme {
  id: string;
  sectorLabel: string;
  planetName: string;
  englishSubtitle: string;
  classification: string;
  diameter: string;
  distance: string;
  orbitalPeriod: string;
  rotationPeriod: string;
  meanTemp: string;
  moons: string;
  atmosphere: string;
  textureUrl: string;
  hasRings?: boolean;
  accentHex: string;
  glowRgba: string;
  atmosphereColor: string;
  sunCoreRgba: string;
  sunWarmRgba: string;
  bumpScale: number;
  roughness: number;
  axialTilt: number;
  spinSpeed: number;
}

export const SPACE_PLANET_THEMES: SpacePlanetTheme[] = [
  {
    id: 'abyss-neptune',
    sectorLabel: 'SECTOR 01 · SOLAR SYSTEM VIII',
    planetName: 'Neptune',
    englishSubtitle: 'Eighth Planet · Ice Giant',
    classification: 'Deep-Space Ice Giant',
    diameter: '49,528 km',
    distance: '4.52 Billion km',
    orbitalPeriod: '164.8 Earth yrs',
    rotationPeriod: '16.1 hrs',
    meanTemp: '-200 °C',
    moons: '16 Moons',
    atmosphere: 'H₂ · He · Methane (CH₄)',
    textureUrl: texNeptuneMap,
    accentHex: '#22D3EE',
    glowRgba: 'rgba(34, 211, 238, 0.24)',
    atmosphereColor: '#38bdf8',
    sunCoreRgba: 'rgba(224, 247, 255, 0.72)',
    sunWarmRgba: 'rgba(56, 189, 248, 0.26)',
    bumpScale: 0.012,
    roughness: 0.72,
    axialTilt: 0.24,
    spinSpeed: 0.0022,
  },
  {
    id: 'solar-mercury',
    sectorLabel: 'SECTOR 02 · SOLAR SYSTEM I',
    planetName: 'Mercury',
    englishSubtitle: 'First Planet · Closest to Sun',
    classification: 'Rocky Terrestrial',
    diameter: '4,879 km',
    distance: '57.9 Million km',
    orbitalPeriod: '88.0 Earth days',
    rotationPeriod: '58.6 Earth days',
    meanTemp: '167 °C',
    moons: '0 Moons',
    atmosphere: 'Thin O₂ · Na · He Exosphere',
    textureUrl: texMercuryMap,
    accentHex: '#FB923C',
    glowRgba: 'rgba(249, 115, 22, 0.28)',
    atmosphereColor: '#fb923c',
    sunCoreRgba: 'rgba(255, 244, 214, 0.8)',
    sunWarmRgba: 'rgba(251, 146, 60, 0.32)',
    bumpScale: 0.042,
    roughness: 0.88,
    axialTilt: 0.08,
    spinSpeed: 0.0018,
  },
  {
    id: 'aurora-saturn',
    sectorLabel: 'SECTOR 03 · SOLAR SYSTEM VI',
    planetName: 'Saturn',
    englishSubtitle: 'Sixth Planet · Ringed Giant',
    classification: 'Ringed Gas Giant',
    diameter: '120,536 km',
    distance: '1.43 Billion km',
    orbitalPeriod: '29.4 Earth yrs',
    rotationPeriod: '10.7 hrs',
    meanTemp: '-140 °C',
    moons: '95 Moons',
    atmosphere: '96% H₂ · 3% He · Icy Rings',
    textureUrl: texSaturnMap,
    hasRings: true,
    accentHex: '#FB7185',
    glowRgba: 'rgba(251, 113, 133, 0.24)',
    atmosphereColor: '#f5d0c5',
    sunCoreRgba: 'rgba(255, 241, 242, 0.76)',
    sunWarmRgba: 'rgba(251, 182, 168, 0.28)',
    bumpScale: 0.01,
    roughness: 0.75,
    axialTilt: 0.36,
    spinSpeed: 0.002,
  },
  {
    id: 'eclipse-luna',
    sectorLabel: 'SECTOR 04 · EARTH ORBIT',
    planetName: 'The Moon',
    englishSubtitle: 'Luna · Natural Satellite',
    classification: 'Lunar World',
    diameter: '3,475 km',
    distance: '384,400 km (Earth)',
    orbitalPeriod: '27.3 Earth days',
    rotationPeriod: '27.3 Earth days',
    meanTemp: '-20 °C',
    moons: 'Tidally Locked',
    atmosphere: 'Lunar Regolith · Basalt',
    textureUrl: texLunaMap,
    accentHex: '#E11D48',
    glowRgba: 'rgba(225, 29, 72, 0.24)',
    atmosphereColor: '#e2e8f0',
    sunCoreRgba: 'rgba(255, 236, 238, 0.72)',
    sunWarmRgba: 'rgba(225, 29, 72, 0.26)',
    bumpScale: 0.048,
    roughness: 0.92,
    axialTilt: 0.12,
    spinSpeed: 0.0016,
  },
  {
    id: 'kepler-twilight',
    sectorLabel: 'SECTOR 05 · SOLAR SYSTEM III',
    planetName: 'Earth',
    englishSubtitle: 'Third Planet · Blue Marble',
    classification: 'Ocean Terrestrial World',
    diameter: '12,756 km',
    distance: '149.6 Million km',
    orbitalPeriod: '365.2 Days (1 yr)',
    rotationPeriod: '23.9 hrs',
    meanTemp: '15 °C',
    moons: '1 Moon',
    atmosphere: '78% N₂ · 21% O₂ · 1% Ar',
    textureUrl: texKeplerMap,
    accentHex: '#60A5FA',
    glowRgba: 'rgba(96, 165, 250, 0.25)',
    atmosphereColor: '#60a5fa',
    sunCoreRgba: 'rgba(254, 249, 231, 0.78)',
    sunWarmRgba: 'rgba(96, 165, 250, 0.28)',
    bumpScale: 0.022,
    roughness: 0.64,
    axialTilt: 0.3,
    spinSpeed: 0.0021,
  },
];

function hash1D(n: number): number {
  const x = Math.sin(n * 127.1 + 31.7) * 43758.5453;
  return x - Math.floor(x);
}

// Smoothly blend left/right edges so the 360° globe has zero UV seam while rotating
function buildSeamlessTextures(
  img: HTMLImageElement,
  targetWidth = 1440
): {
  colorTex: THREE.CanvasTexture;
  bumpTex: THREE.CanvasTexture;
} {
  const w = targetWidth;
  const h = Math.round(targetWidth / 2);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const blendW = Math.floor(w * 0.06);
  const copy = new Uint8ClampedArray(data);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < blendW; x++) {
      const alpha = x / blendW;
      const mirrorX = w - 1 - x;
      const iLeft = (y * w + x) * 4;
      const iRight = (y * w + mirrorX) * 4;

      for (let c = 0; c < 3; c++) {
        const avg = (copy[iLeft + c] + copy[iRight + c]) * 0.5;
        data[iLeft + c] = copy[iLeft + c] * alpha + avg * (1 - alpha);
        data[iRight + c] = copy[iRight + c] * alpha + avg * (1 - alpha);
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bumpCtx = bumpCanvas.getContext('2d')!;
  const bumpData = bumpCtx.createImageData(w, h);
  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    bumpData.data[i] = lum;
    bumpData.data[i + 1] = lum;
    bumpData.data[i + 2] = lum;
    bumpData.data[i + 3] = 255;
  }
  bumpCtx.putImageData(bumpData, 0, 0);

  const colorTex = new THREE.CanvasTexture(canvas);
  colorTex.colorSpace = THREE.SRGBColorSpace;
  colorTex.wrapS = THREE.RepeatWrapping;
  colorTex.wrapT = THREE.ClampToEdgeWrapping;
  colorTex.anisotropy = 8;

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.ClampToEdgeWrapping;

  return { colorTex, bumpTex };
}

function buildSaturnRingTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0.0, 'rgba(215, 195, 175, 0)');
  grad.addColorStop(0.12, 'rgba(218, 196, 178, 0.22)');
  grad.addColorStop(0.24, 'rgba(242, 224, 206, 0.72)');
  grad.addColorStop(0.38, 'rgba(226, 202, 184, 0.88)');
  grad.addColorStop(0.49, 'rgba(248, 232, 218, 0.92)');
  grad.addColorStop(0.55, 'rgba(60, 50, 56, 0.08)');
  grad.addColorStop(0.6, 'rgba(235, 212, 194, 0.82)');
  grad.addColorStop(0.78, 'rgba(210, 188, 174, 0.55)');
  grad.addColorStop(0.92, 'rgba(195, 174, 165, 0.18)');
  grad.addColorStop(1.0, 'rgba(195, 174, 165, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let x = 0; x < w; x += 3) {
    const ripple = 0.78 + 0.22 * Math.sin(x * 0.22) * Math.cos(x * 0.07);
    ctx.fillStyle = `rgba(255, 248, 240, ${(0.08 * ripple).toFixed(3)})`;
    ctx.fillRect(x, 0, 1.5, h);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface SpacePlanetCanvasProps {
  profileIndex: number;
}

export function SpacePlanetCanvas({ profileIndex }: SpacePlanetCanvasProps) {
  const theme =
    SPACE_PLANET_THEMES[profileIndex % SPACE_PLANET_THEMES.length] ??
    SPACE_PLANET_THEMES[0];

  const rootRef = useRef<HTMLDivElement | null>(null);
  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const threeHostRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries.some((entry) => entry.isIntersecting);
      },
      { rootMargin: '180px 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 48 : 96;
    const stars = Array.from({ length: starCount }, (_, i) => ({
      x: hash1D(i + 1 + profileIndex * 100),
      y: hash1D(i + 201 + profileIndex * 100),
      r: 0.4 + hash1D(i + 401) * 1.0,
      alpha: 0.2 + hash1D(i + 601) * 0.65,
      speed: 0.7 + hash1D(i + 801) * 1.6,
      phase: hash1D(i + 1001) * Math.PI * 2,
      blueTint: hash1D(i + 1201) > 0.68,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let time = 0;
    let lastDraw = 0;
    let rafId = 0;

    const renderStars = (now: number) => {
      rafId = window.requestAnimationFrame(renderStars);
      if (!isVisibleRef.current) return;
      // Throttle starfield twinkle on mobile to save main-thread canvas ticks
      if (isMobile && now - lastDraw < 42) return;
      lastDraw = now;

      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? 480;
      const h = parent?.clientHeight ?? 380;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const twinkle = 0.65 + 0.35 * Math.sin(time * s.speed + s.phase);
        ctx.fillStyle = s.blueTint
          ? `rgba(186, 230, 253, ${(s.alpha * twinkle).toFixed(3)})`
          : `rgba(255, 255, 255, ${(s.alpha * twinkle).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      time += isMobile ? 0.042 : 0.016;
    };

    rafId = window.requestAnimationFrame(renderStars);
    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [profileIndex]);

  useEffect(() => {
    const host = threeHostRef.current;
    if (!host) return;

    let disposed = false;
    let rafId = 0;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34,
      Math.max(1, host.clientWidth) / Math.max(1, host.clientHeight),
      0.1,
      100
    );
    camera.position.set(0, 0, theme.hasRings ? 5.25 : 4.3);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2)
    );
    renderer.setSize(
      Math.max(1, host.clientWidth),
      Math.max(1, host.clientHeight)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.background = 'transparent';
    host.appendChild(renderer.domElement);

    const sunDir = new THREE.Vector3(-4.2, 2.3, 2.8).normalize();
    const sunLight = new THREE.DirectionalLight('#fff8eb', 3.15);
    sunLight.position.copy(sunDir).multiplyScalar(8);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(theme.atmosphereColor, 0.85);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight('#b8c7e0', 0.24);
    scene.add(ambientLight);

    const planetGroup = new THREE.Group();
    planetGroup.rotation.z = theme.axialTilt;
    planetGroup.rotation.x = theme.hasRings ? 0.34 : 0.1;
    scene.add(planetGroup);

    const sphereSegs = isMobile ? 48 : 96;
    const sphereGeo = new THREE.SphereGeometry(1, sphereSegs, sphereSegs);
    const planetMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: theme.roughness,
      metalness: 0.04,
      bumpScale: theme.bumpScale,
    });
    const planetMesh = new THREE.Mesh(sphereGeo, planetMat);
    planetGroup.add(planetMesh);

    const atmoSegs = isMobile ? 36 : 96;
    const atmoGeo = new THREE.SphereGeometry(1.06, atmoSegs, atmoSegs);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      uniforms: {
        uColor: { value: new THREE.Color(theme.atmosphereColor) },
        uSunDir: { value: sunDir },
      },
      vertexShader: `
        varying vec3 vNormalWorld;
        varying vec3 vViewDir;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vNormalWorld = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uSunDir;
        varying vec3 vNormalWorld;
        varying vec3 vViewDir;
        void main() {
          float ndotv = clamp(dot(vNormalWorld, -vViewDir), 0.0, 1.0);
          float glow = pow(ndotv, 2.4) * smoothstep(0.0, 0.22, ndotv);
          float sunSide = clamp(dot(vNormalWorld, uSunDir) * 0.55 + 0.55, 0.14, 1.0);
          gl_FragColor = vec4(uColor, glow * sunSide * 0.9);
        }
      `,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    planetGroup.add(atmoMesh);

    let ringGeo: THREE.RingGeometry | null = null;
    let ringMat: THREE.MeshStandardMaterial | null = null;
    let ringTex: THREE.CanvasTexture | null = null;

    if (theme.hasRings) {
      ringGeo = new THREE.RingGeometry(1.32, 2.32, 128);
      const posAttr = ringGeo.attributes.position;
      const uvAttr = ringGeo.attributes.uv;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        v3.fromBufferAttribute(posAttr, i);
        const radius = v3.length();
        const u = (radius - 1.32) / (2.32 - 1.32);
        uvAttr.setXY(i, u, 0.5);
      }

      ringTex = buildSaturnRingTexture();
      ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.78,
        metalness: 0.02,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      planetGroup.add(ringMesh);
    }

    let colorTex: THREE.CanvasTexture | null = null;
    let bumpTex: THREE.CanvasTexture | null = null;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = theme.textureUrl;
    img.onload = () => {
      if (disposed) return;
      const built = buildSeamlessTextures(img, isMobile ? 720 : 1440);
      colorTex = built.colorTex;
      bumpTex = built.bumpTex;
      planetMat.map = colorTex;
      planetMat.bumpMap = bumpTex;
      planetMat.needsUpdate = true;
    };

    const handleResize = () => {
      if (!host) return;
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(host);

    let hasRenderedInitial = false;
    const animate = () => {
      if (disposed) return;
      rafId = window.requestAnimationFrame(animate);
      if (!isVisibleRef.current && hasRenderedInitial) return;
      hasRenderedInitial = true;
      planetMesh.rotation.y += theme.spinSpeed;
      renderer.render(scene, camera);
    };
    rafId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      sphereGeo.dispose();
      planetMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      ringGeo?.dispose();
      ringMat?.dispose();
      ringTex?.dispose();
      colorTex?.dispose();
      bumpTex?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={rootRef}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Twinkling Deep-Space Starfield */}
      <canvas
        ref={starCanvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle Distant Sun Corona Behind Top-Left Horizon of 3D Planet */}
      <div
        aria-hidden="true"
        className="absolute left-[14%] sm:left-[20%] top-[14%] w-[250px] h-[250px] sm:w-[310px] sm:h-[310px] rounded-full blur-[72px] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.sunCoreRgba} 0%, ${theme.sunWarmRgba} 40%, transparent 74%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-[22%] sm:left-[27%] top-[24%] w-[95px] h-[95px] rounded-full blur-[24px] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, rgba(255, 251, 235, 0.72) 0%, ${theme.sunWarmRgba} 55%, transparent 82%)`,
        }}
      />

      {/* Top Editorial Planet Header Mark (Stylish Serif Title + Classification) */}
      <div className="relative z-20 px-6 pt-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p
            className="text-[10px] font-mono uppercase tracking-[0.26em] mb-1"
            style={{ color: theme.accentHex }}
          >
            {theme.englishSubtitle}
          </p>
          <h3
            className="text-3xl sm:text-4xl font-semibold tracking-[0.14em] uppercase text-white"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            {theme.planetName}
          </h3>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
            ATMOSPHERE / SURFACE
          </p>
          <p className="text-xs font-mono text-neutral-200 mt-0.5">
            {theme.atmosphere}
          </p>
        </div>
      </div>

      {/* Center 3D Planet Stage + Infographic Callout Lines */}
      <div className="relative z-10 flex-1 min-h-[260px] sm:min-h-[310px]">
        {/* Transparent WebGL Three.js 3D HD Rotating Planet */}
        <div
          ref={threeHostRef}
          aria-label={`${theme.planetName} — ${theme.classification}`}
          className="w-full h-full min-h-[260px] sm:min-h-[310px]"
        />

        {/* Delicate Infographic Leader Line: Top-Right Callout */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center gap-2.5 absolute top-[22%] right-5 pointer-events-none"
        >
          <svg
            width="64"
            height="24"
            viewBox="0 0 64 24"
            fill="none"
            className="opacity-70"
          >
            <circle cx="3" cy="20" r="2.5" fill={theme.accentHex} />
            <path
              d="M5 19 L22 5 L64 5"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1"
            />
          </svg>
          <div className="text-left">
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              DISTANCE FROM SUN
            </p>
            <p className="text-xs font-mono text-white tabular-nums">
              {theme.distance}
            </p>
          </div>
        </div>

        {/* Delicate Infographic Leader Line: Bottom-Left Callout */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-center gap-2.5 absolute bottom-[18%] left-6 pointer-events-none"
        >
          <div className="text-right">
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              ORBITAL PERIOD
            </p>
            <p className="text-xs font-mono text-white tabular-nums">
              {theme.orbitalPeriod}
            </p>
          </div>
          <svg
            width="64"
            height="24"
            viewBox="0 0 64 24"
            fill="none"
            className="opacity-70"
          >
            <path
              d="M0 19 L42 19 L59 5"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1"
            />
            <circle cx="61" cy="4" r="2.5" fill={theme.accentHex} />
          </svg>
        </div>
      </div>

      {/* Bottom NASA Planetary Infographic Fact Strip */}
      <div className="relative z-20 px-6 py-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
            Diameter
          </p>
          <p className="text-xs sm:text-sm font-mono text-white mt-0.5 tabular-nums">
            {theme.diameter}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
            Rotation
          </p>
          <p className="text-xs sm:text-sm font-mono text-white mt-0.5 tabular-nums">
            {theme.rotationPeriod}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
            Mean Temp
          </p>
          <p className="text-xs sm:text-sm font-mono text-white mt-0.5 tabular-nums">
            {theme.meanTemp}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
            Moons
          </p>
          <p className="text-xs sm:text-sm font-mono text-white mt-0.5 tabular-nums">
            {theme.moons}
          </p>
        </div>
      </div>
    </div>
  );
}
