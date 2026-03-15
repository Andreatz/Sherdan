import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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
  10:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  12:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  20:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  100: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
};

const DIE_COLORS: Record<DieType, number> = {
  4: 0x8b0000, 6: 0x1a3a6b, 8: 0x2d6a2d,
  10: 0x6b1a6b, 12: 0x8b4500, 20: 0x1a1a8b, 100: 0x4a4a00,
};

function createGeometry(sides: DieType): THREE.BufferGeometry {
  switch (sides) {
    case 4:   return new THREE.TetrahedronGeometry(1.2);
    case 6:   return new THREE.BoxGeometry(1.6, 1.6, 1.6);
    case 8:   return new THREE.OctahedronGeometry(1.2);
    case 10:  return new THREE.ConeGeometry(1.0, 1.8, 10);
    case 12:  return new THREE.DodecahedronGeometry(1.2);
    case 20:  return new THREE.IcosahedronGeometry(1.2);
    case 100: return new THREE.ConeGeometry(1.0, 1.8, 10);
  }
}

function getTopFaceValue(mesh: THREE.Mesh, sides: DieType): number {
  const values = FACE_VALUES[sides];
  const normals = mesh.geometry.attributes.normal;
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  const up = new THREE.Vector3(0, 1, 0);
  const wn = new THREE.Vector3();
  let bestDot = -Infinity, bestFace = 0;
  const faceCount = normals.count / 3;
  for (let i = 0; i < faceCount; i++) {
    wn.set(normals.getX(i * 3), normals.getY(i * 3), normals.getZ(i * 3))
      .applyMatrix3(normalMatrix).normalize();
    const dot = wn.dot(up);
    if (dot > bestDot) { bestDot = dot; bestFace = i % values.length; }
  }
  return values[bestFace];
}

export const DiceCanvas: React.FC<Props> = ({ dieType, onResult, rolling }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const resultFiredRef = useRef(false);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (mountRef.current) mountRef.current.innerHTML = '';
  }, []);

  useEffect(() => {
    if (!rolling) return;
    resultFiredRef.current = false;
    cleanup();

    const container = mountRef.current!;
    const W = container.clientWidth;
    const H = container.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene = new THREE.Scene();

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.set(0, 14, 10);
    camera.lookAt(0, 0, 0);

    /* ── Luci ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sun = new THREE.DirectionalLight(0xffd060, 2.0);
    sun.position.set(6, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);
    const rim = new THREE.PointLight(0xff6600, 1.2, 40);
    rim.position.set(-8, 8, -6);
    scene.add(rim);

    /* ── Piano invisibile (ombra) ── */
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.ShadowMaterial({ opacity: 0.25 })
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    /* ── Particelle dorate ── */
    const pCount = 120;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 18;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xffd700, size: 0.06, transparent: true, opacity: 0.5,
    })));

    /* ── Fisica ── */
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -28, 0) });
    (world.solver as CANNON.GSSolver).iterations = 12;

    const makeWall = (pos: CANNON.Vec3, euler: [number, number, number]) => {
      const b = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
      b.position.copy(pos); b.quaternion.setFromEuler(...euler); world.addBody(b);
    };
    makeWall(new CANNON.Vec3(0, -2, 0),   [-Math.PI / 2, 0, 0]);
    makeWall(new CANNON.Vec3(-9, 0, 0),   [0,  Math.PI / 2, 0]);
    makeWall(new CANNON.Vec3( 9, 0, 0),   [0, -Math.PI / 2, 0]);
    makeWall(new CANNON.Vec3(0, 0, -9),   [0, 0, 0]);
    makeWall(new CANNON.Vec3(0, 0,  9),   [0, Math.PI, 0]);

    const dieBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(1.0),
      linearDamping: 0.25,
      angularDamping: 0.25,
    });
    dieBody.position.set((Math.random() - 0.5) * 5, 10, (Math.random() - 0.5) * 5);
    dieBody.velocity.set((Math.random() - 0.5) * 8, -3, (Math.random() - 0.5) * 8);
    dieBody.angularVelocity.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );
    world.addBody(dieBody);

    /* ── Mesh dado ── */
    const geo = createGeometry(dieType);
    const mat = new THREE.MeshStandardMaterial({
      color: DIE_COLORS[dieType],
      metalness: 0.55,
      roughness: 0.25,
    });
    const dieMesh = new THREE.Mesh(geo, mat);
    dieMesh.castShadow = true;
    dieMesh.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.8 })
    ));
    scene.add(dieMesh);

    /* ── Resize ── */
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ── Loop ── */
    let settleFrames = 0;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      world.step(1 / 60);
      dieMesh.position.copy(dieBody.position as unknown as THREE.Vector3);
      dieMesh.quaternion.copy(dieBody.quaternion as unknown as THREE.Quaternion);

      if (!resultFiredRef.current) {
        const v = dieBody.velocity.length();
        const av = dieBody.angularVelocity.length();
        if (v < 0.06 && av < 0.06) {
          settleFrames++;
          if (settleFrames > 40) {
            resultFiredRef.current = true;
            dieMesh.updateMatrixWorld();
            let raw = getTopFaceValue(dieMesh, dieType);
            if (dieType === 10 && raw === 0) raw = 10;
            if (dieType === 100 && raw === 0) raw = 100;
            onResult(raw);
          }
        } else { settleFrames = 0; }
      }
      renderer.render(scene, camera);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [rolling, dieType, onResult, cleanup]);

  useEffect(() => () => cleanup(), [cleanup]);

  return <div ref={mountRef} className="w-full h-full" />;
};
