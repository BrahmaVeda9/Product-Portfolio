'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Decorative 3D hero scene: a gold-wireframe icosahedron around a polished
 * torus-knot core, orbiting rings, and a drifting particle field.
 * Purely visual — pointer-events disabled, pauses off-screen, respects
 * prefers-reduced-motion, and silently no-ops if WebGL is unavailable.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // WebGL unavailable — page still works without the scene
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // ── Studio reflections (metal needs an environment to look like metal) ──
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.9;

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0x8899cc, 0.55));
    const key = new THREE.PointLight(0xf9c846, 90, 40);
    key.position.set(4, 4, 6);
    const rim = new THREE.PointLight(0x2dd4bf, 70, 40);
    rim.position.set(-6, -2, 3);
    const fill = new THREE.PointLight(0x6677ff, 35, 40);
    fill.position.set(0, -5, -4);
    scene.add(key, rim, fill);

    const group = new THREE.Group();
    scene.add(group);

    // ── Core: polished gold torus knot ──
    const coreGeo = new THREE.TorusKnotGeometry(1, 0.32, 220, 32, 2, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xe3b23c,
      metalness: 1,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // ── Shell: wireframe icosahedron ──
    const shellGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, wireframe: true, transparent: true, opacity: 0.22 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    // ── Rings ──
    const ringGeo = new THREE.TorusGeometry(2.9, 0.012, 16, 200);
    const ringMatA = new THREE.MeshBasicMaterial({ color: 0xf9c846, transparent: true, opacity: 0.55 });
    const ringMatB = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 });
    const ringA = new THREE.Mesh(ringGeo, ringMatA);
    const ringB = new THREE.Mesh(ringGeo, ringMatB);
    ringA.rotation.x = Math.PI / 2.4;
    ringB.rotation.set(Math.PI / 3.2, Math.PI / 5, 0);
    ringB.scale.setScalar(1.18);
    group.add(ringA, ringB);

    // ── Particles ──
    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 4 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf9c846,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Sizing: object sits right-of-centre on wide screens, centred on mobile ──
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      const wide = w >= 1024;
      group.position.x = wide ? 3.4 : 0;
      group.position.y = wide ? 0 : 1.6;
      group.scale.setScalar(wide ? 0.85 : 0.7);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── Pointer parallax ──
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // ── Loop ──
    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const render = () => {
      const t = clock.getElapsedTime();
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      core.rotation.x = t * 0.18;
      core.rotation.y = t * 0.27;
      shell.rotation.y = -t * 0.08;
      shell.rotation.x = t * 0.05;
      ringA.rotation.z = t * 0.12;
      ringB.rotation.z = -t * 0.09;
      particles.rotation.y = t * 0.018;
      group.rotation.y = current.x * 0.35;
      group.rotation.x = current.y * 0.2;
      camera.position.x = current.x * 0.4;
      camera.position.y = -current.y * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible && !document.hidden) render();
    };
    if (reduceMotion) {
      render();
    } else {
      loop();
    }

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      [coreGeo, shellGeo, ringGeo, particleGeo].forEach((g) => g.dispose());
      [coreMat, shellMat, ringMatA, ringMatB, particleMat].forEach((m) => m.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
