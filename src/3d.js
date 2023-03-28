import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

var ballUrl = "/balls/beach-ball.gltf";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var intervalId = null;
var paused = true;
var menu = document.getElementById("menu");

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);
document.getElementById("treejs").appendChild(renderer.domElement);

console.log("start");

function randomMinMax(min, max) {
  return min + Math.random() * (max - min);
}

const ambiantLight = new THREE.AmbientLight(0x303030); // soft white light
scene.add(ambiantLight);

const light = new THREE.PointLight(0xffffff, 1.1, 100);
light.position.set(-5, 5, 5);
scene.add(light);

camera.position.z = 5;

var force = [0, 0.01, -0.01];

// Load a glTF resource
// const loader = new GLTFLoader();
// loader.load(ballUrl, (gltf) => {
//   ball = gltf.scene.children[0]; // access the ball object
//   scene.add(ball);
//   ball.position.set(0, 0, 0);
// });

var ball = undefined;

function createBall(url) {
  // Load a glTF resource
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    ball = gltf.scene.children[0]; // access the ball object
    scene.add(ball);
    // ball.position.set(posx, posy, 0);
    ball.position.x = randomMinMax(-4, 4);
    ball.position.y = randomMinMax(-8, -4);
    ball.position.z = 4;
  });
}

function startInterval() {
  intervalID = setInterval(function() {
    createBall(ballUrl);
  }, 1000);
  paused = false;
}

function stopInterval() {
  clearInterval(intervalID);
  paused = true;
}




//debug scene
document.getElementById("box").addEventListener("click", function() {
  console.log(scene.children);  
})


function animate() {
  requestAnimationFrame(animate);
  //kill if paused
  if (paused) {
    return;
  }
  //animate only balls
  scene.children.forEach((child) => {
    if (child.type == "Group") {
    if (child.position.z <= -3) {
      scene.remove(child);
    } else {
      child.position.y += force[1];
      child.position.z += force[2];

      child.rotation.x += (child.position.z +3) * 0.005;
      child.rotation.y += (child.position.z +3) * 0.005;
    }
  } else {
    return;
  }
  });

  renderer.render(scene, camera);
}

animate();

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
