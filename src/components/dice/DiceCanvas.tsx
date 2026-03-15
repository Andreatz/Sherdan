import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface Props {
  dieType: DieType;
  onResult: (value: number) => void;
  rolling: boolean;
}

// Mappa facce -> valore per ogni dado
const FACE_VALUES: Record<DieType, number[]> = {
  4:  [1,2,3,4],
  6:  [1,2,3,4,5,6],
  8:  [1,2,3,4,5,6,7,8],
  10: [0,1,2,3,4,5,6,7,8,9],
  12: [1,2,3,4,5,6,7,8,9,10,11,12],
  20: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
  100:[10,20,30,40,50,60,70,80,90,100],
};

function createDieGeometry(sides: DieType): THREE.BufferGeometry {
  switch (sides) {
    case 4:  return new THREE.TetrahedronGeometry(1);
    case 6:  return new THREE.BoxGeometry(1.4, 1.4, 1.4);
    case 8:  return new THREE.OctahedronGeometry(1);
    case 10: return new THREE.ConeGeometry(0.9, 1.6, 10);
    case 12: return new THREE.DodecahedronGeometry(1);
    case 20: return new THREE.IcosahedronGeometry(1);
    case 100:return new THREE.ConeGeometry(0.9, 1.6, 10); // usa stesso shape del d10
  }
}

function createDieMaterial(sides: DieType): THREE.Material {
  const colors: Record<DieType, number> = {
    4:  0x8b0000,
    6:  0x1a3a6b,
    8:  0x2d6a2d,
    10: 0x6b1a6b,
    12: 0x8b4500,
    20: 0x1a1a8b,
    100:0x4a4a00,
  };
  return new THREE.MeshStandardMaterial({
    color: colors[sides],
    metalness: 0.4,
    roughness: 0.3,
    envMapIntensity: 1.0,
  });
}

function getTopFaceValue(mesh: THREE.Mesh, sides: DieType): number {
  const values = FACE_VALUES[sides];
  // Trova la faccia che punta piu' verso l'alto usando la normale trasformata
  const geo = mesh.geometry;
  const normals = geo.attributes.normal;
  const faceCount = normals.count / 3;
  let bestDot = -Infinity;
  let bestFace = 0;

  const worldNormal = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);

  for (let i = 0; i < faceCount; i++) {
    const nx = normals.getX(i * 3);
    const ny = normals.getY(i * 3);
    const nz = normals.getZ(i * 3);
    worldNormal.set(nx, ny, nz).applyMatrix3(normalMatrix).normalize();
    const dot = worldNormal.dot(up);
    if (dot > bestDot) {
      bestDot = dot;
      bestFace = i % values.length;
    }
  }
  return values[bestFace];
}

export const DiceCanvas: React.FC<Props> = ({ dieType, onResult, rolling }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    world: CANNON.World;
    dieMesh: THREE.Mesh;
    dieBody: CANNON.Body;
    floor: CANNON.Body;
    animId: number;
    settled: boolean;
    settleTimer: number;
  } | null>(null);

  const cleanup = useCallback(() => {
    if (stateRef.current) {
      cancelAnimationFrame(stateRef.current.animId);
      stateRef.current.renderer.dispose();
      stateRef.current = null;
    }
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
    }
  }, []);

  const initScene = useCallback(() => {
    cleanup();
    const container = canvasRef.current;
    if (!container) return;

    const W = container.clientWidth || 400;
    const H = container.clientHeight || 300;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 8, 6);
    camera.lookAt(0, 0, 0);

    // Luci
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffd700, 1.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0xff8800, 0.8, 20);
    pointLight.position.set(-4, 6, -2);
    scene.add(pointLight);

    // Piano (invisibile, solo fisica)
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 1 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.5;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Particelle dorate
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(60);
    for (let i = 0; i < 60; i++) positions[i] = (Math.random() - 0.5) * 6;
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffd700, size: 0.04, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(particleGeo, particleMat));

    // Fisica
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });
    world.broadphase = new CANNON.NaiveBroadphase();
    (world.solver as CANNON.GSSolver).iterations = 10;

    const floorBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    floorBody.position.set(0, -1.5, 0);
    world.addBody(floorBody);

    // Pareti
    const wallShape = new CANNON.Plane();
    const walls = [
      { pos: new CANNON.Vec3(-5, 0, 0), euler: [0,  Math.PI/2, 0] },
      { pos: new CANNON.Vec3( 5, 0, 0), euler: [0, -Math.PI/2, 0] },
      { pos: new CANNON.Vec3(0, 0, -5), euler: [0, 0, 0] },
      { pos: new CANNON.Vec3(0, 0,  5), euler: [0, Math.PI, 0] },
    ];
    walls.forEach(w => {
      const b = new CANNON.Body({ mass: 0, shape: wallShape });
      b.position.copy(w.pos);
      b.quaternion.setFromEuler(...w.euler as [number,number,number]);
      world.addBody(b);
    });

    // Corpo fisico del dado (sfera approssimata)
    const dieBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.8),
      linearDamping: 0.3,
      angularDamping: 0.3,
    });
    // Lancia il dado dall'alto con impulso casuale
    dieBody.position.set(
      (Math.random() - 0.5) * 2,
      5,
      (Math.random() - 0.5) * 2
    );
    dieBody.velocity.set(
      (Math.random() - 0.5) * 6,
      -2,
      (Math.random() - 0.5) * 6
    );
    dieBody.angularVelocity.set(
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 25
    );
    world.addBody(dieBody);

    // Mesh del dado
    const geo = createDieGeometry(dieType);
    const mat = createDieMaterial(dieType);
    const dieMesh = new THREE.Mesh(geo, mat);
    dieMesh.castShadow = true;
    // Linee wireframe oro
    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 1.5, transparent: true, opacity: 0.7 });
    dieMesh.add(new THREE.LineSegments(edges, lineMat));
    scene.add(dieMesh);

    let settled = false;
    let settleTimer = 0;

    const animate = () => {
      const id = requestAnimationFrame(animate);
      stateRef.current!.animId = id;

      world.step(1 / 60);

      dieMesh.position.copy(dieBody.position as unknown as THREE.Vector3);
      dieMesh.quaternion.copy(dieBody.quaternion as unknown as THREE.Quaternion);

      // Rileva quando il dado si ferma
      if (!settled) {
        const speed = dieBody.velocity.length();
        const angSpeed = dieBody.angularVelocity.length();
        if (speed < 0.05 && angSpeed < 0.05) {
          settleTimer++;
          if (settleTimer > 30) {
            settled = true;
            stateRef.current!.settled = true;
            dieMesh.updateMatrixWorld();
            const result = getTopFaceValue(dieMesh, dieType);
            const actual = dieType === 10 && result === 0 ? 10 :
                           dieType === 100 && result === 0 ? 100 : result;
            onResult(actual);
          }
        } else {
          settleTimer = 0;
        }
      }

      renderer.render(scene, camera);
    };

    const id = requestAnimationFrame(animate);

    stateRef.current = {
      renderer, scene, camera, world,
      dieMesh, dieBody, floor: floorBody,
      animId: id, settled, settleTimer,
    };
  }, [dieType, onResult, cleanup]);

  useEffect(() => {
    if (rolling) initScene();
    return () => { if (!rolling) cleanup(); };
  }, [rolling, initScene, cleanup]);

  useEffect(() => () => cleanup(), [cleanup]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full"
      style={{ minHeight: 260 }}
    />
  );
};
