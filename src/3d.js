import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

var ballUrl = "../public/balls/beach-ball.gltf";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
  );
var paused = true;
var menu = document.getElementById("menu");

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);
document.getElementById("treejs").appendChild(renderer.domElement);

console.log("start");

var ball = undefined; 

// Load a glTF resource
const loader = new GLTFLoader();
loader.load(ballUrl, (gltf) => {
  ball = gltf.scene.children[0]; // access the ball object
  scene.add(ball);
  ball.position.set(0, 0, 0);
});

const ambiantLight = new THREE.AmbientLight(0x303030); // soft white light
scene.add(ambiantLight);

const light = new THREE.PointLight(0xffffff, 1.1, 100);
light.position.set(-5, 5, 5);
console.log(light);
scene.add(light);

camera.position.z = 5;

var force = [0, 1, 1];

function animate() {
  requestAnimationFrame(animate);
  
  ball.rotation.x += 0.01;
  ball.rotation.y += 0.01;
  // ball.position.y -= force[1];
  if (paused) {
    return;
  }
  renderer.render(scene, camera);
}

//start gestion du menu
function closeMenu() {
    // if (paused && isloaded) {
    if (paused) {
        menu.style.transform = "translateY(100vh) scale(0.5)";
        paused = false;
        console.log("close menu");
        animate();
    }else {
        menu.style.transform = null;
        paused = true;
        console.log("open menu");
    }
}
// if user press ESC button open menu
document.addEventListener("keydown", function (event) {
    if (event.key == "Escape") {
        closeMenu();
    }
})
//end gestion du menu
