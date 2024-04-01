import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const SceneWithCube = () => {
  const raycaster = new THREE.Raycaster();
  const mousePosition = new THREE.Vector2();

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  const colors = [
    0xff0000,
    0x00ff00,
    0x0000ff,
  ];

  const sceneRefs = [useRef(null), useRef(null), useRef(null)];
  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 100, window.innerHeight);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.x = 1;
    camera.position.y = 1;

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    window.addEventListener('mousemove', (e) => {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1; // Corrected y-axis calculation
    });

    colors.forEach((color, index) => {
      const material = new THREE.MeshBasicMaterial({ color });
      const geometry = new THREE.BoxGeometry();
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = ((index - 1) - 0) * 2;
      scene.add(cube);
    });

    sceneRef.current.appendChild(renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);

      scene.children.forEach((object, index) => {
        if (object instanceof THREE.Mesh) {
          object.rotation.x += 0.01 * (index + 1);
          object.rotation.y += 0.02 * (index + 1);
        }
      });

      raycaster.setFromCamera(mousePosition, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      console.log(intersects.object);
      
      if (intersects.length > 0) {
        console.log(intersects); // Log intersected elements
        const intersectedCube = intersects[0].object;
        intersectedCube.material.color.setHex(Math.random() * 0xffffff); // Change color of hovered cube
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      sceneRefs.forEach((ref) => {
        const currentRef = ref.current;
        if (currentRef && currentRef.firstChild) {
          currentRef.removeChild(currentRef.firstChild); // Add null check
        }
      });
    };
  }, []);

  return (
    <div ref={sceneRef} />
  );
};

export default SceneWithCube;
