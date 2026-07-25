"use client";

import { useRef, useEffect } from "react";

const DATACENTERS: [number, number][] = [
  [19.08, 72.88],
];

function Globe3D({ size = 500 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const THREE = await import("three");
      if (!mountedRef.current || !canvas) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.z = 3;

      // Globe
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1, 80, 80),
        new THREE.MeshPhongMaterial({ color: 0x0d1a40, emissive: 0x1a0550, emissiveIntensity: 0.35, specular: 0x4433aa, shininess: 30 })
      );
      scene.add(globe);

      // Wireframe
      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.003, 28, 28),
        new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.1 })
      ));

      // Atmosphere
      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.22, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x5b21b6, transparent: true, opacity: 0.09, side: THREE.BackSide })
      ));

      // Outer glow
      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.45, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.04, side: THREE.BackSide })
      ));

      // Stars
      const sp: number[] = [];
      for (let i = 0; i < 600; i++) {
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(Math.random() * 2 - 1);
        const r = 3.5 + Math.random() * 3;
        sp.push(Math.sin(p) * Math.cos(t) * r, Math.cos(p) * r, Math.sin(p) * Math.sin(t) * r);
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.012, transparent: true, opacity: 0.5 })));

      // Datacenter markers
      DATACENTERS.forEach(([lat, lng]) => {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = ((lng + 180) * Math.PI) / 180;
        const x = -(Math.sin(phi) * Math.cos(theta));
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
        );
        dot.position.set(x, y, z);
        scene.add(dot);

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.045, 0.065, 12),
          new THREE.MeshBasicMaterial({ color: 0x8b5cf6, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
        );
        ring.position.set(x, y, z);
        ring.lookAt(0, 0, 0);
        scene.add(ring);
      });

      // Equator ring
      const eqRing = new THREE.Mesh(
        new THREE.RingGeometry(0.99, 1.01, 64),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.1 })
      );
      eqRing.rotation.x = Math.PI / 2;
      scene.add(eqRing);

      // Orbit particles
      const op: number[] = [];
      for (let i = 0; i < 200; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 1.35 + Math.random() * 0.25;
        op.push(Math.cos(a) * r, (Math.random() - 0.5) * 0.5, Math.sin(a) * r);
      }
      const og = new THREE.BufferGeometry();
      og.setAttribute("position", new THREE.Float32BufferAttribute(op, 3));
      scene.add(new THREE.Points(og, new THREE.PointsMaterial({ color: 0x8b5cf6, size: 0.014, transparent: true, opacity: 0.5 })));

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dl = new THREE.DirectionalLight(0x8b5cf6, 1.4);
      dl.position.set(3, 2, 3);
      scene.add(dl);
      const pl = new THREE.PointLight(0x06b6d4, 1, 6);
      pl.position.set(-2, 1, 1);
      scene.add(pl);
      const pl2 = new THREE.PointLight(0x3b82f6, 0.6, 5);
      pl2.position.set(1, -2, -1);
      scene.add(pl2);

      // Mouse tracking
      let mx = 0, my = 0;
      const onMove = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove);

      // Animate
      let t = 0;
      const animate = () => {
        if (!mountedRef.current) return;
        animId = requestAnimationFrame(animate);
        t += 0.003;
        globe.rotation.y += 0.0025 + mx * 0.0004;
        globe.rotation.x += 0.0003 + my * 0.0002;
        pl.intensity = 0.8 + Math.sin(t * 1.5) * 0.3;
        eqRing.rotation.z += 0.002;
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(animId);
        renderer.dispose();
      };
    };

    init();

    return () => {
      mountedRef.current = false;
      cleanup?.();
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="w-full h-full"
      style={{ maxWidth: size, maxHeight: size }}
    />
  );
}

export default Globe3D;
