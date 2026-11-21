'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* Ashima 3D simplex noise (MIT) — drives the liquid-metal surface. */
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
vec3 liquid(vec3 p){
  vec3 n=normalize(p);
  float d=snoise(n*uFreq+vec3(uTime*0.22,uTime*0.17,-uTime*0.13));
  d+=0.18*snoise(n*uFreq*1.9-vec3(uTime*0.12));
  return p+n*d*uAmp;
}
`;

/** Soft round sprite so dust particles read as bokeh, not squares. */
function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Hero centrepiece: a molten champagne-metal sculpture with a studio
 * reflection rig, a fine orbit ring and drifting bokeh dust.
 * Decorative only — pointer-events off, pauses off-screen / in hidden tabs,
 * honours prefers-reduced-motion and no-ops without WebGL.
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
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    // ── Studio reflections ──
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.85;

    // ── Lights: warm key, cool hairline rim, low bounce ──
    const key = new THREE.DirectionalLight(0xfff1d6, 2.4);
    key.position.set(4, 5, 6);
    const rim = new THREE.DirectionalLight(0xb9c7d8, 1.6);
    rim.position.set(-6, 2, -4);
    const bounce = new THREE.DirectionalLight(0xc9a96e, 0.8);
    bounce.position.set(0, -6, 3);
    scene.add(key, rim, bounce, new THREE.AmbientLight(0x2a241c, 0.6));

    const rig = new THREE.Group();
    scene.add(rig);
    const sculpt = new THREE.Group();
    rig.add(sculpt);

    // ── Liquid-metal sculpture ──
    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.3 },
      uFreq: { value: 0.78 },
    };
    const blobGeo = new THREE.IcosahedronGeometry(1.55, 72);
    const blobMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a96e,
      metalness: 1,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.15,
    });
    blobMat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${NOISE_GLSL}`)
        .replace(
          '#include <beginnormal_vertex>',
          `
          vec3 lqN = normalize(position);
          vec3 lqT = normalize(abs(lqN.y) < 0.99 ? cross(lqN, vec3(0.0, 1.0, 0.0)) : cross(lqN, vec3(1.0, 0.0, 0.0)));
          vec3 lqB = normalize(cross(lqN, lqT));
          float lqR = length(position);
          vec3 lqP0 = liquid(position);
          vec3 lqP1 = liquid(normalize(position + lqT * 0.012) * lqR);
          vec3 lqP2 = liquid(normalize(position + lqB * 0.012) * lqR);
          vec3 objectNormal = normalize(cross(lqP1 - lqP0, lqP2 - lqP0));
          if (dot(objectNormal, lqN) < 0.0) objectNormal = -objectNormal;
          `
        )
        .replace('#include <begin_vertex>', 'vec3 transformed = lqP0;');
    };
    const blob = new THREE.Mesh(blobGeo, blobMat);
    sculpt.add(blob);

    // ── Orbit rings ──
    const ringGeo = new THREE.TorusGeometry(2.75, 0.0045, 8, 360);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe3cfa4, transparent: true, opacity: 0.55 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.set(Math.PI / 2.25, 0.25, 0);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xf2ede4, transparent: true, opacity: 0.12 });
    const ring2 = new THREE.Mesh(ringGeo, ring2Mat);
    ring2.scale.setScalar(1.22);
    ring2.rotation.set(Math.PI / 1.9, -0.5, 0.3);
    sculpt.add(ring, ring2);

    // Small satellite pearl riding the ring
    const pearlGeo = new THREE.SphereGeometry(0.075, 32, 32);
    const pearlMat = new THREE.MeshPhysicalMaterial({ color: 0xf2e6cc, metalness: 1, roughness: 0.1, clearcoat: 1 });
    const pearl = new THREE.Mesh(pearlGeo, pearlMat);
    ring.add(pearl);

    // ── Bokeh dust ──
    const COUNT = 520;
    const pos = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = 3 + Math.pow(Math.random(), 0.6) * 9;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(ph) - 2;
      seeds[i] = Math.random();
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dotTex = makeDotTexture();
    const dustMat = new THREE.PointsMaterial({
      color: 0xe3cfa4,
      size: 0.07,
      map: dotTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ── Layout: right of the headline on desktop, upper centre on mobile ──
    let baseX = 0;
    let baseY = 0;
    let baseScale = 1;
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = w >= 1024;
      const mid = w >= 640;
      baseX = wide ? 2.85 : 0;
      baseY = wide ? 0.05 : -0.15;
      baseScale = wide ? 0.84 : mid ? 0.9 : 0.82;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── Pointer + scroll ──
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let energy = 0;
    let lastX = 0;
    let lastY = 0;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      energy = Math.min(1, energy + Math.hypot(nx - lastX, ny - lastY) * 1.5);
      lastX = nx;
      lastY = ny;
      target.x = nx;
      target.y = ny;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let scrollP = 0;
    const onScroll = () => {
      scrollP = Math.min(1, window.scrollY / Math.max(1, mount.clientHeight));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Loop ──
    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

    const render = (t: number) => {
      const intro = reduceMotion ? 1 : easeOutExpo(Math.min(1, t / 2.2));
      cur.x += (target.x - cur.x) * 0.045;
      cur.y += (target.y - cur.y) * 0.045;
      energy *= 0.96;

      uniforms.uTime.value = t;
      uniforms.uAmp.value = 0.24 + 0.12 * (1 - intro) + energy * 0.08 + Math.sin(t * 0.45) * 0.03;

      blob.rotation.y = t * 0.12;
      blob.rotation.x = Math.sin(t * 0.2) * 0.25;
      ring.rotation.z = t * 0.16;
      ring2.rotation.z = -t * 0.07;
      const a = t * 0.9;
      pearl.position.set(Math.cos(a) * 2.75, Math.sin(a) * 2.75, 0);
      dust.rotation.y = t * 0.012;
      dust.position.y = Math.sin(t * 0.15) * 0.15;

      sculpt.rotation.y = cur.x * 0.45;
      sculpt.rotation.x = cur.y * 0.25;
      const s = baseScale * (0.82 + 0.18 * intro) * (1 - scrollP * 0.15);
      rig.scale.setScalar(s);
      rig.position.set(baseX, baseY + scrollP * 1.6 + Math.sin(t * 0.6) * 0.06, 0);
      camera.position.x = cur.x * 0.35;
      camera.position.y = -cur.y * 0.22;
      camera.lookAt(baseX * 0.35, 0, 0);

      renderer.render(scene, camera);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible && !document.hidden) render(clock.getElapsedTime());
    };
    if (reduceMotion) render(1.5);
    else loop();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      [blobGeo, ringGeo, pearlGeo, dustGeo].forEach((g) => g.dispose());
      [blobMat, ringMat, ring2Mat, pearlMat, dustMat].forEach((m) => m.dispose());
      dotTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
