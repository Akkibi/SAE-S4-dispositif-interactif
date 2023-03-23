//treejs scene
// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";

// import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/GLTFLoader.js";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);
document.getElementById("treejs").appendChild(renderer.domElement);

// const geometry = new THREE.SphereGeometry(15, 32, 16);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

// const loader = new GLTFLoader();

// loader.load(
//   "../public/balls/beach-ball.gltf",
//   function (gltf) {
//     scene.add(gltf.scene);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

light.position.y = 5;

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  //   sphere.position.z += 0.01;

  renderer.render(scene, camera);
}

animate();

//end treejs scene
