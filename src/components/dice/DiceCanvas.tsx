import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface Props {
  dieType: DieType;
  onResult: (value: number) => void;
  rolling: boolean;
}

// Numero di facce -> valori
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

// Crea texture con numero centrato su fondo colorato
function makeNumberTexture(num: number, bgColor: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Sfondo
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Bordo dorato
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 12;
  ctx.strokeRect(8, 8, size - 16, size - 16);

  // Numero
  const label = num === 100 ? '00' : String(num);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${label.length > 2 ? 80 : 110}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Ombra testo
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 18;
  ctx.fillText(label, size / 2, size / 2);

  return new THREE.CanvasTexture(canvas);
}

// Crea materiali per ogni faccia del dado
function makeMaterials(sides: DieType): THREE.MeshStandardMaterial[] {
  const values = FACE_VALUES[sides];
  const bg = DIE_COLORS[sides];
  // Per geometrie con N facce, ripeti i materiali ciclicamente
  return values.map(v =>
    new THREE.MeshStandardMaterial({
      map: makeNumberTexture(v, bg),
      metalness: 0.4,
      roughness: 0.3,
    })
  );
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
  const rafRef = useRef<number>(0);
  const firedRef = useRef(false);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (mountRef.current) mountRef.current.innerHTML = '';
  }, []);

  useEffect(() => {
    if (!rolling) return;
    firedRef.current = false;
    cleanup();

    const container = mountRef.current!;
    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    /* Scene */
    const scene = new THREE.Scene();

    /* Camera */
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.set(0, 0, 18);
    camera.lookAt(0, 0, 0);

    /* Luci */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xffe080, 2.5);
    sun.position.set(5, 10, 10);
    sun.castShadow = true;
    scene.add(sun);
    scene.add(Object.assign(new THREE.PointLight(0xff8800, 1.0, 60), { position: new THREE.Vector3(-8, 5, 5) }));

    /* Particelle */
    const pPos = new Float32Array(200 * 3);
    for (let i = 0; i < pPos.length; i++) pPos[i] = (Math.random() - 0.5) * 30;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xffd700, size: 0.07, transparent: true, opacity: 0.45,
    })));

    /* Dado */
    const geo = createGeometry(dieType);
    const mats = makeMaterials(dieType);
    const dieMesh = new THREE.Mesh(geo, mats);
    dieMesh.castShadow = true;
    // Wireframe dorato
    dieMesh.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.6 })
    ));
    scene.add(dieMesh);

    /* Calcolo bounds camera (frustum a z=0) */
    const fovRad = (camera.fov * Math.PI) / 180;
    const halfH = Math.tan(fovRad / 2) * camera.position.z;
    const halfW = halfH * camera.aspect;
    const BOUND_X = halfW - 1.8;
    const BOUND_Y = halfH - 1.8;

    /* Stato fisica manuale */
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * BOUND_X * 1.2,
      (Math.random() - 0.5) * BOUND_Y * 1.2,
      0
    );
    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.28,
      (Math.random() - 0.5) * 0.28,
      0
    );
    // Velocita' angolare iniziale alta -> rallenta
    const angVel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.45,
      (Math.random() - 0.5) * 0.45,
      (Math.random() - 0.5) * 0.45
    );

    const DAMPING_VEL = 0.988;
    const DAMPING_ANG = 0.972;
    const STOP_THRESHOLD = 0.0008;
    let settleFrames = 0;

    /* Resize */
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* Loop */
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      // Aggiorna posizione
      pos.addScaledVector(vel, 1);

      // Rimbalzo sui bordi
      if (pos.x > BOUND_X)  { pos.x = BOUND_X;  vel.x *= -0.75; angVel.z += (Math.random() - 0.5) * 0.15; }
      if (pos.x < -BOUND_X) { pos.x = -BOUND_X; vel.x *= -0.75; angVel.z += (Math.random() - 0.5) * 0.15; }
      if (pos.y > BOUND_Y)  { pos.y = BOUND_Y;  vel.y *= -0.75; angVel.x += (Math.random() - 0.5) * 0.15; }
      if (pos.y < -BOUND_Y) { pos.y = -BOUND_Y; vel.y *= -0.75; angVel.x += (Math.random() - 0.5) * 0.15; }

      // Smorzamento
      vel.multiplyScalar(DAMPING_VEL);
      angVel.multiplyScalar(DAMPING_ANG);

      // Aggiorna rotazione
      dieMesh.rotation.x += angVel.x;
      dieMesh.rotation.y += angVel.y;
      dieMesh.rotation.z += angVel.z;
      dieMesh.position.copy(pos);

      // Rilevamento fermo
      if (!firedRef.current) {
        const totalMotion = vel.length() + angVel.length();
        if (totalMotion < STOP_THRESHOLD) {
          settleFrames++;
          if (settleFrames > 45) {
            firedRef.current = true;
            const values = FACE_VALUES[dieType];
            const result = values[Math.floor(Math.random() * values.length)];
            onResult(result);
          }
        } else {
          settleFrames = 0;
        }
      }

      renderer.render(scene, camera);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      mats.forEach(m => { m.map?.dispose(); m.dispose(); });
      geo.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [rolling, dieType, onResult, cleanup]);

  useEffect(() => () => cleanup(), [cleanup]);

  return <div ref={mountRef} className="w-full h-full" />;
};
