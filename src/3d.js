import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { setBackground } from "./background.js";
import { step } from "./background.js";

var ballUrl = "/balls/beach-ball.gltf";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const minZ = -10;
var intervalID = null;
var paused = true;
var menu = document.getElementById("menu");
var score = 0;

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
light.position.set(-5, 5, -2);
scene.add(light);

camera.position.z = 5;
var ball = undefined;

const loader = new GLTFLoader();
function createBall(url) {
  // Load a glTF resource
  loader.load(url, (gltf) => {
    // console.log("gltf: ", gltf);
    ball = gltf.scene.children[0]; // access the ball object
    // console.log("ball: ", ball);
    scene.add(ball);
    // ball.scale.set(0.15, 0.15, 0.15);
    // ball.position.set(posx, posy, 0);
    ball.position.x = randomMinMax(-4, 4);
    ball.position.y = randomMinMax(-8, -4);
    ball.position.z = 4;
    gsap.to(ball.position, {
      x: randomMinMax(-6, 6),
      y: ball.position.x,
      z: minZ - 0.25,
      ease: "circ",
      duration: 3,
    });
  });
}
// const geometry = new THREE.SphereGeometry( 15, 32, 16 );
// const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// function createBall(url) {
//   const sphere = new THREE.Mesh( geometry, material );
//   //add a texture
//   scene.add( sphere );
// }

//end gltf loader

//raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// function onPointerMove(event) {
//   // calculate pointer position in normalized device coordinates
//   // (-1 to +1) for both components
//   // console.log(
//   //   (event.clientX / window.innerWidth) * 2 - 1,
//   //   (event.clientY / window.innerHeight) * 2 + 1
//   // );
//   // console.log(topCalc, event.clientY);
//   // console.log(leftCalc, event.clientX);
//   gsap.to("#mouse", {
//     y: event.clientY,
//     x: event.clientX,
//     duration: 0.2,
//   });
//   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   // console.log("MOUSE left: ", event.clientX, "top: ", event.clientY);
// }
// window.addEventListener("pointermove", onPointerMove);

//debug scene
// document.getElementById("box").addEventListener("click", function () {
//   console.log(scene.children);
// });

var isDead = true;
var pv = 3;

// document.getElementById("mouse").addEventListener("click", function () {
//   if (isDead) {
//     isDead = false;
//     console.log("ded");
//   } else {
//     isDead = true;
//     console.log("not");
//   }
// });
//load hand model
console.log("start");
//end load hand model

const video = document.getElementById("video");
const box = document.getElementById("box").style;
let isVideo = false;
let model = null;
let topCalc = 0;
let leftCalc = 0;
let isloaded = false;

// Ajouter un événement de chargement à la fenêtre
// paramètres model
const modelParams = {
  flipHorizontal: true, // retourner l'image horizontalement
  imageScaleFactor: 0.5, // réduire la taille de l'image pour la détection
  maxNumBoxes: 1, // détecter une seule main
  iouThreshold: 0.5, // seuil de recouvrement pour la détection des boîtes englobantes
  scoreThreshold: 0.7, // seuil de confiance pour la détection des boîtes englobantes
};

window.addEventListener("load", () => {
  // Lancer la webcam
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      // Assigner le flux vidéo à l'élément video
      video.srcObject = stream;
      isVideo = true;
      handTrack.load(modelParams).then((lmodel) => {
        // detect objects in the image.
        model = lmodel;
        console.log("Loaded Model!");
        //change text inside button to "Lancer une partie"
        document.getElementById("button").innerText = "Lancer une partie";
        isloaded = true;
      });
    })
    .catch((error) => {
      console.log("MyErreur :", error);
    });
});

var intersects = [];
function animate() {
  requestAnimationFrame(animate);
  //kill if paused
  if (paused) {
    return;
  }
  //animate only balls

  scene.children.forEach((child) => {
    if (child.type == "Group") {
      if (child.position.z <= minZ) {
        scene.remove(child);
      } else {
        child.rotation.x += (child.position.z - minZ) * 0.005;
        child.rotation.y += (child.position.z - minZ) * 0.005;
      }
    } else {
      return;
    }
    raycaster.setFromCamera(pointer, camera);
    intersects = raycaster.intersectObjects(scene.children);
    // calculate objects intersecting the picking ray
    // const intersects = raycaster.intersectObjects("group", true);
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.position.z += 1;
      // console.log(intersects[i]);
    }
    // );
  });
  //move hand picture and get position
  model.detect(video).then((predictions) => {
    if (predictions.length != 0 && predictions[0].label != "face") {
      // console.log(predictions);
      topCalc = Math.round(
        (window.innerHeight / 100) *
          (predictions[0].bbox[1] + predictions[0].bbox[2] / 2)
      );
      leftCalc = Math.round((window.innerWidth / 100) * predictions[0].bbox[0]);
      pointer.x = (leftCalc / window.innerWidth) * 2 - 1;
      pointer.y = (topCalc / window.innerHeight) * 2 + 1;
      // box.left = leftCalc;
      // box.top = topCalc;
      gsap.to("#box", {
        y: topCalc,
        x: leftCalc,
        // x: predictions[0].bbox[0],
        // y: predictions[0].bbox[1],
        duration: 0.2,
      });
      // console.log(pointer.x, pointer.y);
    }
    //   // end move hand picture and get position
  });
  renderer.render(scene, camera);
}

animate();

//start gestion du menu
export function closeMenu() {
  if (paused) {
    // if (paused && isloaded) {
    // if (paused) {
    menu.style.transform = "translateY(100vh) scale(0.5)";
    paused = false;
    console.log("close menu");
    animate();
    intervalID = setInterval(function () {
      createBall(ballUrl);
    }, 2000);
  } else {
    setTimeout(() => {
      setBackground();
      step(0);
      pv = 3;
      score = 0;
      document.getElementById("score").innerHTML = score;
      document.getElementById("vies").innerHTML = pv;
    }, "500");
    menu.style.transform = null;
    paused = true;
    console.log("open menu");
    clearInterval(intervalID);
    scene.children.forEach((child) => {
      if (child.type == "Group") {
        scene.remove(child);
      }
    });
  }
}
// if user press ESC button open menu
document.addEventListener("keydown", function (event) {
  if (event.key == "Escape") {
    closeMenu();
  }
});
//end gestion du menu

document.getElementById("button").addEventListener("click", () => {
  closeMenu();
});

// DONE * problem de rapidité apres la réouverture du menu mais bon..
// DONE * toujours pas d'icon
// MID * pas de raycast
// * pas d'animation de ball poussée
// * pas de statistiques (points de vie et points gagnés)
