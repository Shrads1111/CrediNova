import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hyperspeed — warp-streak star animation for the CrediNova intro screen.
 *
 * Visual: hundreds of light streaks rush from a central vanishing point toward
 * the viewer (classic hyperspeed/warp effect), rendered on a white background
 * with CrediNova teal (#0EA5A0), turquoise (#14B8A6), and green (#22C55E) streaks.
 *
 * Uses Three.js BufferGeometry lines. No extra libraries beyond `three`.
 * Fully disposes of all GPU resources on unmount.
 */

// ── CrediNova brand palette ───────────────────────────────────────────────────
const COLORS = [
  0x0ea5a0, // teal
  0x14b8a6, // turquoise
  0x22c55e, // green
  0x0b8c87, // dark teal
  0x0ea5a0, // teal (weighted extra)
  0x14b8a6, // turquoise (weighted extra)
];

const STAR_COUNT   = 600;
const SPEED_BASE   = 0.018; // units per frame at z-depth
const SPEED_FACTOR = 1.6;   // multiplier: stars accelerate as they near camera
const SPREAD       = 3.5;   // XY spread at spawn
const DEPTH        = 80;    // tunnel depth (Z range)
const TRAIL_LENGTH = 0.55;  // streak trail as fraction of depth step
const FOG_NEAR     = 0;
const FOG_FAR      = DEPTH;

// ── Helpers ──────────────────────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min;
const pickColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// ── Main component ────────────────────────────────────────────────────────────
export default function Hyperspeed({ style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 1); // pure white background
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    scene.fog    = new THREE.Fog(0xffffff, FOG_NEAR, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      DEPTH + 10
    );
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -1);

    // ── Star data ─────────────────────────────────────────────────────────────
    // Each star: { x, y, z, speed, color, lineMesh }
    const stars = [];

    const createStarMesh = (x, y, z, color) => {
      const trailZ = z + TRAIL_LENGTH * SPEED_BASE * SPEED_FACTOR * 30;
      const positions = new Float32Array([
        x, y, -z,
        x, y, -(trailZ),
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
        linewidth: 1,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      return line;
    };

    const spawnStar = (z) => {
      const x     = rand(-SPREAD, SPREAD);
      const y     = rand(-SPREAD, SPREAD);
      const depth = z ?? rand(0.5, DEPTH);
      const color = pickColor();
      const speed = rand(SPEED_BASE, SPEED_BASE * 2.2);
      const line  = createStarMesh(x, y, depth, color);
      stars.push({ x, y, z: depth, speed, color, line });
    };

    // Seed initial stars spread across the whole tunnel depth
    for (let i = 0; i < STAR_COUNT; i++) spawnStar();

    // ── Animation ─────────────────────────────────────────────────────────────
    let rafId = null;

    const updateStarPositions = (star) => {
      // Acceleration: stars move faster as they approach z=0 (camera)
      const accel = 1 + (1 - star.z / DEPTH) * SPEED_FACTOR;
      star.z -= star.speed * accel;

      if (star.z <= 0.05) {
        // Recycle: send back to far end
        scene.remove(star.line);
        star.line.geometry.dispose();
        star.line.material.dispose();

        star.x     = rand(-SPREAD, SPREAD);
        star.y     = rand(-SPREAD, SPREAD);
        star.z     = rand(DEPTH * 0.8, DEPTH);
        star.speed = rand(SPEED_BASE, SPEED_BASE * 2.2);
        star.color = pickColor();
        star.line  = createStarMesh(star.x, star.y, star.z, star.color);
        return;
      }

      // Update positions in-place
      const spread_factor = star.z / DEPTH; // near 1 when far, near 0 when close
      const xScaled = star.x / Math.max(0.01, spread_factor);
      const yScaled = star.y / Math.max(0.01, spread_factor);

      const trailZBack  = star.z + TRAIL_LENGTH * star.speed * accel * 25;
      const trailXBack  = star.x / Math.max(0.01, trailZBack / DEPTH);
      const trailYBack  = star.y / Math.max(0.01, trailZBack / DEPTH);

      const pos = star.line.geometry.attributes.position;
      pos.setXYZ(0, xScaled,   yScaled,   -star.z);
      pos.setXYZ(1, trailXBack, trailYBack, -trailZBack);
      pos.needsUpdate = true;

      // Fade in at far end, bright as they approach
      const alpha = Math.min(1, 1 - (star.z / DEPTH) * 0.6);
      star.line.material.opacity = alpha;
    };

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      stars.forEach(updateStarPositions);
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      stars.forEach(s => {
        scene.remove(s.line);
        s.line.geometry.dispose();
        s.line.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    />
  );
}
