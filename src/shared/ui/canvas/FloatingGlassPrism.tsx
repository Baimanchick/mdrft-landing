"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface FloatingGlassPrismProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FloatingGlassPrism({ className = "", size = "md" }: FloatingGlassPrismProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 300;
    const height = currentMount.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Rounded Box / Torus Glass Geometry
    const geometry =
      size === "sm"
        ? new THREE.IcosahedronGeometry(1.2, 1)
        : new THREE.BoxGeometry(1.8, 1.8, 1.8, 4, 4, 4);

    // Luxury Chromatic Glass Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.55,
      reflectivity: 0.9,
      thickness: 1.2,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0x0099ff),
      attenuationDistance: 2.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Dramatic Lighting for Chromatic Aberration
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x0099ff, 50, 20);
    blueLight.position.set(-4, 3, 3);
    scene.add(blueLight);

    const redLight = new THREE.PointLight(0xea262a, 40, 20);
    redLight.position.set(4, -3, 3);
    scene.add(redLight);

    const whiteLight = new THREE.DirectionalLight(0xffffff, 2);
    whiteLight.position.set(0, 5, 5);
    scene.add(whiteLight);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mesh.rotation.x += 0.005 + targetY * 0.01;
      mesh.rotation.y += 0.008 + targetX * 0.01;
      mesh.rotation.z += 0.003;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size]);

  return <div ref={mountRef} className={`relative pointer-events-none ${className}`} />;
}
