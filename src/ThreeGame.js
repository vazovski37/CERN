import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ThreeGame = () => {
  const raycaster = new THREE.Raycaster();
  const mousePosition = new THREE.Vector2();

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  const colors = [
    0xff0000,
    0x00ff00,
    0x0000ff,
  ];
  const scene = new THREE.Scene();

  const cubes = [];
  const selectedObjects = [];

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth - 100, window.innerHeight);
  rendererRef.current = renderer;

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;
  camera.position.x = 1;
  camera.position.y = 1;

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update();

  colors.forEach((color, index) => {
    const material = new THREE.MeshBasicMaterial({ color });
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = (index - (colors.length - 1) / 2) * 3; // Adjust spacing
    cubes.push(cube);
    scene.add(cube);
  });

  useEffect(() => {
    window.addEventListener('click', onClick);


    sceneRef.current.appendChild(renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);

      cubes.forEach((cube, index) => {
        cube.rotation.x = 0.01 * (index + 1);
        cube.rotation.y = 0.02 * (index + 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  const onClick = (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      const newColor = Math.floor(Math.random() * 0xffffff);

      const intersectedCube = intersects[0].object;
      intersectedCube.material.color.setHex(newColor);

      selectedObjects.length = 0;
      selectedObjects.push(intersectedCube); 

      updateRandomObjectPosition();
    }
  };

  const updateRandomObjectPosition = () => {
    if (selectedObjects.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedObjects.length);
      const selectedObject = selectedObjects[randomIndex];

      const randomX = Math.random() * 10 - 5; 
      const randomY = Math.random() * 10 - 5; 
      const randomZ = Math.random() * 10 - 5; 

      selectedObject.position.x += randomX;
      selectedObject.position.y += randomY;
      selectedObject.position.z += randomZ;
    }
  };

  return (
    <div ref={sceneRef} />
  );
};

export default ThreeGame;
