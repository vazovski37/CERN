import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SceneWithCube = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    const colors = [
      0xff0000, 
      0x00ff00, 
      0x0000ff, 
      0xffff00, 
      0xff00ff, 
      0x00ffff  
    ];

    const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));

    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, materials);

    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      sceneRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default SceneWithCube;
