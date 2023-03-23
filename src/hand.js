console.log("start");

const video = document.getElementById("video");
const box = document.getElementById("box").style;
let pause = false;
let isVideo = false;
let model = null;
let topCalc = 0;
let leftCalc = 0;

// Ajouter un événement de chargement à la fenêtre
//paramètres model
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
        runDetection();
      });
    })
    .catch((error) => {
      console.log("MyErreur :", error);
    });
});

// Initialiser le détecteur de main

//detection de la main et modification de la position
function runDetection() {
  if (pause) {
    return;
  }
  model.detect(video).then((predictions) => {
    if (predictions.length != 0 && predictions[0].label != "face") {
      // console.log(predictions);
      topCalc = Math.round(
        (window.innerHeight / 100) *
          (predictions[0].bbox[1] + predictions[0].bbox[2] / 2)
      );
      leftCalc = Math.round((window.innerWidth / 100) * predictions[0].bbox[0]);
      gsap.to("#box", {
        y: topCalc,
        x: leftCalc,
        duration: 0.2,
      });
    }
    requestAnimationFrame(runDetection);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    if (pause == true) {
      pause = false;
      console.log("c'est repartis");
      runDetection();
    } else {
      pause = true;
      console.log("pause");
    }
  }
});
