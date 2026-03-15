import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface Props {
  dieType: DieType;
  onResult: (value: number) => void;
  rolling: boolean;
}

const FACE_VALUES: Record<DieType, number[]> = {
  4:   [1, 2, 3, 4],
  6:   [1, 2, 3, 4, 5, 6],
  8:   [1, 2, 3, 4, 5, 6, 7, 8],
  10:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  12:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  20:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  100: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
};

const DIE_BG: Record<DieType, string> = {
  4: '#6b0000', 6: '#0a2050', 8: '#0f3d0f',
  10: '#3d0a3d', 12: '#5a2800', 20: '#0a0a5a', 100: '#2e2e00',
};

// Crea texture canvas per una singola faccia
function makeFaceTex(label: string, bg: string): THREE.CanvasTexture {
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d')!;

  // Sfondo con gradiente radiale
  const grad = ctx.createRadialGradient(S/2, S/2, 20, S/2, S/2, S/2);
  grad.addColorStop(0, shadeColor(bg, 60));
  grad.addColorStop(1, bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  // Bordo dorato arrotondato
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 16;
  roundRect(ctx, 12, 12, S - 24, S - 24, 24);
  ctx.stroke();

  // Numero
  const fontSize = label.length > 2 ? 160 : 200;
  ctx.font = `900 ${fontSize}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Ombra esterna
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, S / 2, S / 2);
  // Secondo passaggio senza ombra per nitidezza
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fffde0';
  ctx.fillText(label, S / 2, S / 2);

  return new THREE.CanvasTexture(cv);
}

function shadeColor(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amt);
  const g = Math.min(255, ((n >> 8)  & 0xff) + amt);
  const b = Math.min(255, ( n        & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Costruisce una geometria con gruppi espliciti per ogni faccia triangolare
function buildGroupedGeometry(base: THREE.BufferGeometry): THREE.BufferGeometry {
  // Converti in non-indexed per avere triangoli indipendenti
  const nonIndexed = base.toNonIndexed();
  const pos = nonIndexed.getAttribute('position');
  const triCount = pos.count / 3;

  nonIndexed.clearGroups();
  for (let i = 0; i < triCount; i++) {
    nonIndexed.addGroup(i * 3, 3, i);
  }
  // Ricalcola le normali
  nonIndexed.computeVertexNormals();
  return nonIndexed;
}

function createDie(dieType: DieType): { mesh: THREE.Mesh; mats: THREE.MeshStandardMaterial[] } {
  const values = FACE_VALUES[dieType];
  const bg = DIE_BG[dieType];

  if (dieType === 6) {
    // BoxGeometry ha gia' 6 gruppi nativi
    const geo = new THREE.BoxGeometry(1.9, 1.9, 1.9);
    const mats = values.map(v =>
      new THREE.MeshStandardMaterial({ map: makeFaceTex(String(v), bg), metalness: 0.4, roughness: 0.3 })
    );
    const mesh = new THREE.Mesh(geo, mats);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.8 })));
    return { mesh, mats };
  }

  // Per tutti gli altri: geometria con gruppi per ogni triangolo
  let base: THREE.BufferGeometry;
  switch (dieType) {
    case 4:   base = new THREE.TetrahedronGeometry(1.6); break;
    case 8:   base = new THREE.OctahedronGeometry(1.5); break;
    case 10:  base = new THREE.ConeGeometry(1.1, 2.1, 10); break;
    case 12:  base = new THREE.DodecahedronGeometry(1.5); break;
    case 20:  base = new THREE.IcosahedronGeometry(1.5); break;
    case 100: base = new THREE.ConeGeometry(1.1, 2.1, 10); break;
    default:  base = new THREE.IcosahedronGeometry(1.5);
  }

  const geo = buildGroupedGeometry(base);
  const triCount = geo.getAttribute('position').count / 3;

  // Cicla i valori sulle facce triangolari
  const mats: THREE.MeshStandardMaterial[] = [];
  for (let i = 0; i < triCount; i++) {
    const v = values[i % values.length];
    mats.push(new THREE.MeshStandardMaterial({
      map: makeFaceTex(String(v), bg),
      metalness: 0.4,
      roughness: 0.3,
    }));
  }

  const mesh = new THREE.Mesh(geo, mats);
  // Edges sulla geometria originale (piu' pulito)
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(base),
    new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.75 })));

  return { mesh, mats };
}

export const DiceCanvas: React.FC<Props> = ({ dieType, onResult, rolling }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const firedRef = useRef(false);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (mountRef.current) mountRef.current.innerHTML = '';
  }, []);

  useEffect(() => {
    if (!rolling) return;
    firedRef.current = false;

    const initId = requestAnimationFrame(() => {
      cleanup();
      const container = mountRef.current;
      if (!container) return;

      const W = window.innerWidth;
      const H = window.innerHeight;

      /* Renderer */
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setClearColor(0x06060f, 1);
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      /* Scene */
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x06060f);

      /* Nebbia leggera per profondità */
      scene.fog = new THREE.FogExp2(0x06060f, 0.018);

      /* Camera */
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
      camera.position.set(0, 0, 18);
      camera.lookAt(0, 0, 0);

      /* Luci */
      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const sun = new THREE.DirectionalLight(0xfff0c0, 2.8);
      sun.position.set(6, 12, 10);
      sun.castShadow = true;
      scene.add(sun);
      const rim = new THREE.PointLight(0xff9900, 1.5, 50);
      rim.position.set(-10, 6, 4);
      scene.add(rim);

      /* Particelle */
      const pPos = new Float32Array(300 * 3);
      for (let i = 0; i < pPos.length; i++) pPos[i] = (Math.random() - 0.5) * 32;
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: 0xffd700, size: 0.09, transparent: true, opacity: 0.4,
      })));

      /* Dado */
      const { mesh: dieMesh, mats } = createDie(dieType);
      dieMesh.castShadow = true;
      scene.add(dieMesh);

      /* Bounds */
      const fovRad = (camera.fov * Math.PI) / 180;
      const halfH  = Math.tan(fovRad / 2) * camera.position.z;
      const halfW  = halfH * camera.aspect;
      const BX = halfW - 2.5;
      const BY = halfH - 2.5;

      /* Stato fisica */
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * BX,
        (Math.random() - 0.5) * BY,
        0
      );
      const vel = new THREE.Vector3(
        (Math.random() < 0.5 ? 1 : -1) * (0.20 + Math.random() * 0.16),
        (Math.random() < 0.5 ? 1 : -1) * (0.20 + Math.random() * 0.16),
        0
      );
      // Velocita' angolare: crea la sensazione di "spigoli"
      const angVel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.55,
        (Math.random() - 0.5) * 0.55,
        (Math.random() - 0.5) * 0.55
      );

      const DAMP_V   = 0.991;
      const DAMP_A   = 0.976;
      const STOP_THR = 0.0005;
      let settleFrames = 0;
      let frame = 0;

      /* Resize */
      const onResize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      /* Loop */
      const tick = () => {
        rafRef.current = requestAnimationFrame(tick);
        frame++;

        pos.addScaledVector(vel, 1);

        // Rimbalzo con piccolo impulso angolare casuale (simula spigolo)
        if (pos.x >  BX) { pos.x =  BX; vel.x *= -0.82; angVel.y -= 0.18 + Math.random() * 0.12; }
        if (pos.x < -BX) { pos.x = -BX; vel.x *= -0.82; angVel.y += 0.18 + Math.random() * 0.12; }
        if (pos.y >  BY) { pos.y =  BY; vel.y *= -0.82; angVel.x += 0.18 + Math.random() * 0.12; }
        if (pos.y < -BY) { pos.y = -BY; vel.y *= -0.82; angVel.x -= 0.18 + Math.random() * 0.12; }

        vel.multiplyScalar(DAMP_V);
        angVel.multiplyScalar(DAMP_A);

        dieMesh.rotation.x += angVel.x;
        dieMesh.rotation.y += angVel.y;
        dieMesh.rotation.z += angVel.z;
        dieMesh.position.copy(pos);

        // Piccola oscillazione di scala per effetto "urto"
        const bounce = 1 + Math.abs(vel.x + vel.y) * 0.08;
        dieMesh.scale.setScalar(Math.min(bounce, 1.12));

        if (!firedRef.current) {
          if (vel.length() + angVel.length() < STOP_THR) {
            settleFrames++;
            if (settleFrames > 55) {
              firedRef.current = true;
              const vals = FACE_VALUES[dieType];
              onResult(vals[Math.floor(Math.random() * vals.length)]);
            }
          } else {
            settleFrames = 0;
          }
        }

        renderer.render(scene, camera);
      };
      rafRef.current = requestAnimationFrame(tick);

      (mountRef as any)._internalCleanup = () => {
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(rafRef.current);
        renderer.dispose();
        mats.forEach(m => { m.map?.dispose(); m.dispose(); });
        pGeo.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelAnimationFrame(initId);
      if ((mountRef as any)._internalCleanup) {
        (mountRef as any)._internalCleanup();
        (mountRef as any)._internalCleanup = null;
      }
      cleanup();
    };
  }, [rolling, dieType, onResult, cleanup]);

  useEffect(() => () => cleanup(), [cleanup]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', background: '#06060f' }}
    />
  );
};
