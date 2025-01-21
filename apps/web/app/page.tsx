'use client'

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { WebGLRenderer, PerspectiveCamera, Scene, Object3D } from "three";
import React, { useEffect, useRef } from 'react';
import Loading from './loading';




export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {

    let scene: Scene, 
    camera: PerspectiveCamera, 
    renderer: WebGLRenderer, 
    control: OrbitControls, 
    model: Object3D | null,
    secondModel: Object3D | null,
    thirdModel: Object3D | null;


    const initScene = () => {
      scene = new THREE.Scene();
    
    };
    

    const initCamera = () => {
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100
      );
      camera.position.x = 0.02;
      camera.position.y = 2;
      camera.position.z = 100;
      camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    };

    const initRenderer = () => {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(800, 500); 
      renderer.setClearColor(0x000000, 0);
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }
    };

    const initLight = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
      scene.add(ambientLight);
      

    
      const pointLight = new THREE.PointLight(0xffffff, 1.5); 
      pointLight.position.set(10, 20, 10); 
      scene.add(pointLight);
    };
    const applyMetallicMaterial = (object: THREE.Object3D) => {
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa, 
            metalness: 1.0,  
            roughness: 0.1,  
            envMapIntensity: 2.0, 
          });
          mesh.material = material;
        }
      });
    };
    
    

    const initControl = () => {
      control = new OrbitControls(camera, renderer.domElement);
      control.enableDamping = true;
      control.dampingFactor = 0.05;
      control.autoRotate = true;
      control.autoRotateSpeed = 2.0;

      control.enableRotate = false;  
      control.enableZoom = false;   
      control.enablePan = false; 
    };

    const initModel = () => {
      const loader = new GLTFLoader();
      loader.load(
        "/models/pionek1.glb", 
        (glb) => {
          model = glb.scene;
          model.scale.set(7, 5, 7);
          model.position.y = -4;
          model.position.x = -20; 

          applyMetallicMaterial(model);

          scene.add(model);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.log("An error happened:", error);
        }
      );
      loader.load(
        "/models/pionek1.glb", 
        (glb) => {
          secondModel = glb.scene;
          secondModel.scale.set(15, 10, 15);
          secondModel.position.y = -4;
          secondModel.position.x = 0; 
          scene.add(secondModel);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.log("An error happened:", error);
        }
      );
      loader.load(
        "/models/pionek1.glb",  
        (glb) => {
          thirdModel = glb.scene;
          thirdModel.scale.set(15, 10, 15);
          thirdModel.position.y = -4;
          thirdModel.position.x = 20; 
          scene.add(thirdModel);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.log("An error happened:", error);
        }
      );
    };


    initScene();
    initCamera();
    initRenderer();
    initLight();
    initControl();
    initModel();


const animate = () => {
  requestAnimationFrame(animate);


  if (model) {

    model.rotation.x += 0.001;
    model.rotation.y += 0.001;
    model.rotation.z += 0.001;
  }

  if (secondModel) {
    secondModel.rotation.x += 0.001;
    secondModel.rotation.y += 0.001;
    secondModel.rotation.z -= 0.001;
  }

  if (thirdModel) {
    thirdModel.rotation.x += 0.001;
    thirdModel.rotation.y += 0.001;
    thirdModel.rotation.z += 0.001;
  }


  renderer.render(scene, camera);
};

    animate();

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);
  return (
    <>
      <Loading />
      
      <div className="content">
        <h1>Welcome to the Chessboard</h1>
        <p>The battle of wits begins here!</p>
        <div ref={containerRef}></div>
      </div>
    </>
  );
};


