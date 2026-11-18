// src/components/landing/EarthAndMoon.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export const EarthAndMoon = ({
  cameraDistance = 3.2,
  cameraFov = 45,
  earthRotationSpeed = 0.0009,
  moonOrbitSpeed = 0.0075, // Smooth, visibly continuous 3D orbital speed
  cloudOpacity = 0.32,
  starCount = 5000,
  autoRotate = true,
  mouseInteractive = true,
  className = "",
  style = {},
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId;
    let isDisposed = false;

    // Dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isNarrow = width < 768;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(cameraFov, width / height, 0.1, 8000);
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("[EarthAndMoon] WebGL not available:", e);
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";

    // Earth size: scaled so the visible curved dome covers the bottom ~55-60% of the screen
    const visibleHeight = 2 * cameraDistance * Math.tan((cameraFov * Math.PI) / 360);
    const earthRadius = visibleHeight * 0.72; // Generous radius for realistic curvature
    const earthOffsetY = -earthRadius * 0.70; // Positioned so top curvature rises into lower 58% of view

    // Moon sizing and continuous in-view 3D orbit dimensions
    // "little big" radius and centered around the middle of Earth
    const moonRadius = earthRadius * (isNarrow ? 0.14 : 0.17);
    const orbitRadiusX = earthRadius * (isNarrow ? 1.05 : 1.25);
    const orbitRadiusZ = earthRadius * (isNarrow ? 0.95 : 1.15);
    const orbitCenterY = earthOffsetY + earthRadius * 0.30; // Centered at the middle of Earth
    const orbitInclinationY = earthRadius * 0.16; // Elegant subtle orbital inclination
    let moonAngle = Math.PI * 0.88; // Starts smoothly on the left side in view matching reference

    // 1. Natural Starfield (Realistic white & subtle icy stars)
    const starGeo = new THREE.BufferGeometry();
    const starPos = [];
    const starColors = [];
    const starPhases = [];

    for (let i = 0; i < starCount; i++) {
      const r = 25 + Math.random() * 45;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      starPos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // Natural white/icy blue/soft warm star colors
      const rand = Math.random();
      if (rand > 0.85) {
        starColors.push(0.85, 0.92, 1.0); // Icy blue
      } else if (rand > 0.7) {
        starColors.push(1.0, 0.95, 0.88); // Soft warm
      } else {
        starColors.push(0.95, 0.95, 0.95); // Pure white
      }

      starPhases.push({
        speed: 0.4 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.Float32BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 2. Earth Group (Positioned at bottom, rising smoothly)
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, earthOffsetY, 0);
    earthGroup.rotation.z = (18 * Math.PI) / 180;
    scene.add(earthGroup);

    // Earth Sphere Mesh
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
      ),
      specularMap: textureLoader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"
      ),
      normalMap: textureLoader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"
      ),
      specular: new THREE.Color(0x222222),
      shininess: 12,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.castShadow = true;
    earthMesh.receiveShadow = true;
    earthGroup.add(earthMesh);

    // Cloud Layer Mesh
    const cloudGeo = new THREE.SphereGeometry(earthRadius + 0.012, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"
      ),
      transparent: true,
      opacity: cloudOpacity,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // Thin Realistic Atmospheric Blue Horizon Glow
    const atmosGeo = new THREE.SphereGeometry(earthRadius + 0.024, 64, 64);
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x4ba3e3,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    atmosMesh.position.set(0, earthOffsetY, 0);
    scene.add(atmosMesh);

    // 3. Moon (Orbiting around the Earth in 3D)
    const moonGeo = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg"
      ),
      shininess: 3,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    scene.add(moonMesh);

    // Set initial position on orbit
    const initX = Math.cos(moonAngle) * orbitRadiusX;
    const initZ = Math.sin(moonAngle) * orbitRadiusZ;
    const initY = orbitCenterY + Math.sin(moonAngle) * orbitInclinationY;
    moonMesh.position.set(initX, initY, initZ);

    // 4. Natural Directional & Ambient Lighting (No neon tint)
    const ambientLight = new THREE.AmbientLight(0x1a1c20, 1.2);
    scene.add(ambientLight);

    // Main Sunlight illuminating top-right of Earth and Moon
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(6, 4, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Subtle soft fill light
    const softFillLight = new THREE.DirectionalLight(0x2a3340, 0.6);
    softFillLight.position.set(-5, -2, -3);
    scene.add(softFillLight);

    // 5. Interactive Mouse Rotation on Earth
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const onMouseDown = (e) => {
      if (!mouseInteractive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      targetRotationY += deltaX * 0.004;
      targetRotationX += deltaY * 0.003;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support
    const onTouchStart = (e) => {
      if (!mouseInteractive || e.touches.length !== 1) return;
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
      targetRotationY += deltaX * 0.004;
      targetRotationX += deltaY * 0.003;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Resize Handler
    const onResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 6. Animation Loop
    const animate = () => {
      if (isDisposed) return;
      animId = requestAnimationFrame(animate);

      // Auto rotation of Earth
      if (autoRotate && !isDragging) {
        targetRotationY += earthRotationSpeed;
      }

      // Smooth damping for Earth rotation
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;

      earthGroup.rotation.y = currentRotationY;
      earthGroup.rotation.x = currentRotationX;
      cloudMesh.rotation.y += 0.00025;

      // Realistic continuous 3D Moon orbit around the Earth
      moonAngle += moonOrbitSpeed;
      const mx = Math.cos(moonAngle) * orbitRadiusX;
      const mz = Math.sin(moonAngle) * orbitRadiusZ;
      const my = orbitCenterY + Math.sin(moonAngle) * orbitInclinationY;

      moonMesh.position.set(mx, my, mz);
      moonMesh.rotation.y += 0.003;

      // Gentle starfield drift
      stars.rotation.y -= 0.00008;

      // Subtle twinkling on stars
      const time = Date.now() * 0.001;
      const colors = starGeo.attributes.color.array;
      for (let i = 0; i < starCount; i++) {
        const { speed, phase } = starPhases[i];
        const val = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * speed + phase));
        colors[i * 3] = val;
        colors[i * 3 + 1] = val;
        colors[i * 3 + 2] = val;
      }
      starGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, [
    cameraDistance,
    cameraFov,
    earthRotationSpeed,
    moonOrbitSpeed,
    cloudOpacity,
    starCount,
    autoRotate,
    mouseInteractive,
  ]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    />
  );
};

export default EarthAndMoon;
