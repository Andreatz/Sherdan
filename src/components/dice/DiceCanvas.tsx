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

const DIE_COLORS: Record<DieType, string> = {
  4: '#7b0000', 6: '#0f2a5c', 8: '#1a4d1a',
  10: '#4a0f4a', 12: '#6b3300', 20: '#0f0f6b', 100: '#3a3a00',
};

function makeNumberTexture(num: number, bgColor: string): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 10;
  ctx.strokeRect(8, 8, size - 16, size - 16);
  const label = num === 100 ? '00' : String(num);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${label.length > 2 ? 80 : 110}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 20;
  ctx.fillText(label, size / 2, size / 2);
  return new THREE.CanvasTexture(c);
}

function makeMaterials(sides: DieType): THREE.MeshStandardMaterial[] {
  const values = FACE_VALUES[sides];
  const bg = DIE_COLORS[sides];
  return values.map(v => new THREE.MeshStandardMaterial({
    map: makeNumberTexture(v, bg),
    metalness: 0.45,
    roughness: 0.25,
  }));
}

function createGeometry(sides: DieType): THREE.BufferGeometry {
  switch (sides) {
    case 4:   return new THREE.TetrahedronGeometry(1.4);
    case 6:   return new THREE.BoxGeometry(1.8, 1.8, 1.8);
    case 8:   return new THREE.OctahedronGeometry(1.4);
    case 10:  return new THREE.ConeGeometry(1.1, 2.0, 10);
    case 12:  return new THREE.DodecahedronGeometry(1.4);
    case 20:  return new THREE.IcosahedronGeometry(1.4);
    case 100: return new THREE.ConeGeometry(1.1, 2.0, 10);
  }
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

    // Aspetta un frame per assicurarsi che il DOM abbia fatto layout
    const initId = requestAnimationFrame(() => {
      cleanup();
      const container = mountRef.current;
      if (!container) return;

      // Usa sempre le dimensioni della finestra come fallback
      const W = window.innerWidth;
      const H = window.innerHeight;

      /* --- Renderer --- */
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setClearColor(0x050510, 1); // sfondo quasi nero, non blu
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      /* --- Scene --- */
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050510);

      /* --- Camera --- */
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
      camera.position.set(0, 0, 18);
      camera.lookAt(0, 0, 0);

      /* --- Luci --- */
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const sun = new THREE.DirectionalLight(0xffe080, 2.5);
      sun.position.set(5, 10, 10);
      sun.castShadow = true;
      scene.add(sun);
      const rim = new THREE.PointLight(0xff8800, 1.2, 60);
      rim.position.set(-8, 5, 5);
      scene.add(rim);

      /* --- Particelle dorate --- */
      const pPos = new Float32Array(300 * 3);
      for (let i = 0; i < pPos.length; i++) pPos[i] = (Math.random() - 0.5) * 30;
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: 0xffd700, size: 0.08, transparent: true, opacity: 0.5,
      })));

      /* --- Dado --- */
      const geo  = createGeometry(dieType);
      const mats = makeMaterials(dieType);
      const dieMesh = new THREE.Mesh(geo, mats);
      dieMesh.castShadow = true;
      dieMesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.7 })
      ));
      scene.add(dieMesh);

      /* --- Bounds (piano z=0 visto dalla camera) --- */
      const fovRad = (camera.fov * Math.PI) / 180;
      const halfH  = Math.tan(fovRad / 2) * camera.position.z;
      const halfW  = halfH * camera.aspect;
      const BX = halfW - 2.2;
      const BY = halfH - 2.2;

      /* --- Stato dinamica --- */
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * BX,
        (Math.random() - 0.5) * BY,
        0
      );
      const vel = new THREE.Vector3(
        (Math.random() < 0.5 ? 1 : -1) * (0.18 + Math.random() * 0.18),
        (Math.random() < 0.5 ? 1 : -1) * (0.18 + Math.random() * 0.18),
        0
      );
      const angVel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );

      const DAMP_V   = 0.990;
      const DAMP_A   = 0.975;
      const STOP_THR = 0.0006;
      let settleFrames = 0;

      /* --- Resize --- */
      const onResize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      /* --- Loop --- */
      const tick = () => {
        rafRef.current = requestAnimationFrame(tick);

        pos.addScaledVector(vel, 1);

        if (pos.x >  BX) { pos.x =  BX; vel.x *= -0.8; angVel.z += (Math.random() - 0.5) * 0.12; }
        if (pos.x < -BX) { pos.x = -BX; vel.x *= -0.8; angVel.z += (Math.random() - 0.5) * 0.12; }
        if (pos.y >  BY) { pos.y =  BY; vel.y *= -0.8; angVel.x += (Math.random() - 0.5) * 0.12; }
        if (pos.y < -BY) { pos.y = -BY; vel.y *= -0.8; angVel.x += (Math.random() - 0.5) * 0.12; }

        vel.multiplyScalar(DAMP_V);
        angVel.multiplyScalar(DAMP_A);

        dieMesh.rotation.x += angVel.x;
        dieMesh.rotation.y += angVel.y;
        dieMesh.rotation.z += angVel.z;
        dieMesh.position.copy(pos);

        if (!firedRef.current) {
          if (vel.length() + angVel.length() < STOP_THR) {
            settleFrames++;
            if (settleFrames > 50) {
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

      // Cleanup interno
      const internalCleanup = () => {
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(rafRef.current);
        renderer.dispose();
        mats.forEach(m => { m.map?.dispose(); m.dispose(); });
        geo.dispose();
        pGeo.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };

      // Salva cleanup nel ref per poterlo richiamare
      (mountRef as any)._cleanup = internalCleanup;
    });

    return () => {
      cancelAnimationFrame(initId);
      if ((mountRef as any)._cleanup) {
        (mountRef as any)._cleanup();
        (mountRef as any)._cleanup = null;
      }
      cleanup();
    };
  }, [rolling, dieType, onResult, cleanup]);

  useEffect(() => () => cleanup(), [cleanup]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', background: '#050510' }}
    />
  );
};
