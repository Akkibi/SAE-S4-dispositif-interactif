import * as THREE from "three";
import { setBackground } from "./background.js";
import { step } from "./background.js";

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
var pv = 3;

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

const ballList = [
  "./balls/tennis.jpg",
  "./balls/baseball.jpg",
  "./balls/volley.jpg",
  "./balls/football.jpg",
  "./balls/balldimpled.png",
];

camera.position.z = 5;

let ballCount = 0;
const geometry = new THREE.SphereGeometry(15, 32, 16);
const textureLoader = new THREE.TextureLoader();
var texture = {};
var material = {};

function createBall() {
  let type = Math.round(randomMinMax(0, 4));
  texture = textureLoader.load(ballList[type]);
  material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.5,
  });
  const ball = new THREE.Mesh(geometry, material);
  scene.add(ball);
  ball.name = ballCount;
  ballCount += 1;
  console.log("ball: ", ball.name);
  ball.position.x = randomMinMax(-6, 6);
  ball.position.y = randomMinMax(-6, 6);
  ball.position.z = minZ - 0.25;
  ball.dead = false;
  ball.scale.set(type * 0.025 + 0.05, type * 0.025 + 0.05, type * 0.025 + 0.05);
  gsap.from(ball.position, {
    x: randomMinMax(-10, 10),
    y: randomMinMax(-10, -6),
    z: 4,
    ease: "circ.out",
    duration: type * 0.25 + 1.5,
  });
}

//end gltf loader

//raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  // console.log(
  //   (event.clientX / window.innerWidth) * 2 - 1,
  //   (event.clientY / window.innerHeight) * 2 + 1
  // );
  // console.log(topCalc, event.clientY);
  // console.log(leftCalc, event.clientX);
  gsap.to("#mouse", {
    y: event.clientY,
    x: event.clientX,
    duration: 0.2,
  });
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // console.log("MOUSE left: ", event.clientX, "top: ", event.clientY);
}
window.addEventListener("pointermove", onPointerMove);

//debug scene
// document.getElementById("box").addEventListener("click", function () {
//   console.log(scene.children);
// });

var intersects = [];
function animate() {
  requestAnimationFrame(animate);
  //kill if paused
  if (paused) {
    return;
  }
  //animate only balls

  scene.children.forEach((child) => {
    if (child.type == "Mesh") {
      if (child.position.z <= minZ && child.dead == false) {
        scene.remove(child);
        pv -= 1;
        step((3 - pv) * 75);
        console.log(pv);
        console.log((3 - pv) * 75);
        document.getElementById("vies").innerHTML = pv;
        if (pv <= 0) {
          clearInterval(intervalID);
          document.getElementById("vies").innerHTML =
            "OUPS, elle a été oubliée";
          document.getElementById("popup").style.display = "block";
          document.getElementById("endScore").innerHTML = score;
          gsap.from("#popup", {
            opacity: 0,
            duration: 1,
          });
        }
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
      if (intersects[i].object.dead == false) {
        score += 13;
        document.getElementById("score").innerHTML = score;
        intersects[i].object.dead = true;
        gsap.to(intersects[i].object.position, {
          x: randomMinMax(-10, 10),
          y: -10,
          z: 0,
          ease: "back.in(1.7)",
          duration: 0.35,
          onCompleteParams: [intersects[i].object],
          onComplete: deleteObject,
        });
      }
    }
    // );
    // const video = document.getElementById("video");
    // const box = document.getElementById("box").style;
    // let isVideo = false;
    // let model = null;
    // let topCalc = 0;
    // let leftCalc = 0;
    // let isloaded = false;

    // Ajouter un événement de chargement à la fenêtre
    // paramètres model
    // const modelParams = {
    //   flipHorizontal: true, // retourner l'image horizontalement
    //   imageScaleFactor: 0.5, // réduire la taille de l'image pour la détection
    //   maxNumBoxes: 1, // détecter une seule main
    //   iouThreshold: 0.5, // seuil de recouvrement pour la détection des boîtes englobantes
    //   scoreThreshold: 0.7, // seuil de confiance pour la détection des boîtes englobantes
    // };

    // window.addEventListener("load", () => {
    //   // Lancer la webcam
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true })
    //     .then((stream) => {
    //       // Assigner le flux vidéo à l'élément video
    //       video.srcObject = stream;
    //       isVideo = true;
    //       handTrack.load(modelParams).then((lmodel) => {
    //         // detect objects in the image.
    //         model = lmodel;
    //         console.log("Loaded Model!");
    //         //change text inside button to "Lancer une partie"
    //         document.getElementById("button").innerText = "Lancer une partie";
    //         isloaded = true;
    //       });
    //     })
    //     .catch((error) => {
    //       console.log("MyErreur :", error);
    //     });
    // });
    //end load hand model

    // window.addEventListener("load", () => {
    //   // Lancer la webcam
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true })
    //     .then((stream) => {
    //       // Assigner le flux vidéo à l'élément video
    //       video.srcObject = stream;
    //       isVideo = true;
    //       handTrack.load(modelParams).then((lmodel) => {
    //         // detect objects in the image.
    //         model = lmodel;
    //         console.log("Loaded Model!");
    //         //change text inside button to "Lancer une partie"
    //         document.getElementById("button").innerText =
    //           "Commencer une partie";
    //         isloaded = true;
    //       });
    //     })
    //     .catch((error) => {
    //       console.log("MyErreur :", error);
    //     });
    // });
    //end load hand model

    //move hand picture and get position
    // model.detect(video).then((predictions) => {
    //   if (predictions.length != 0 && predictions[0].label != "face") {
    //     // console.log(predictions);
    //     topCalc = Math.round(
    //       (window.innerHeight / 100) *
    //         (predictions[0].bbox[1] + predictions[0].bbox[2] / 2)
    //     );
    //     leftCalc = Math.round((window.innerWidth / 100) * predictions[0].bbox[0]);
    //     pointer.x = (leftCalc / window.innerWidth) * 2 - 1;
    //     pointer.y = (topCalc / window.innerHeight) * 2 + 1;
    //     // box.left = leftCalc;
    //     // box.top = topCalc;
    //     gsap.to("#box", {
    //       y: topCalc,
    //       x: leftCalc,
    //       // x: predictions[0].bbox[0],
    //       // y: predictions[0].bbox[1],
    //       duration: 0.2,
    //     });
    //     console.log(pointer.x, pointer.y);
    //   }
    //   // end move hand picture and get position
  });
  renderer.render(scene, camera);
}

animate();

function deleteObject(object) {
  scene.remove(object);
}

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
      createBall();
    }, 1500);
  } else {
    setTimeout(() => {
      document.getElementById("popup").style.display = null;
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
