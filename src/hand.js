// const video = document.getElementById("video");
// const box = document.getElementById("box").style;
// let isVideo = false;
// let model = null;
// let topCalc = 0;
// let leftCalc = 0;
// let isloaded = false;

// Ajouter un événement de chargement à la fenêtre
//paramètres model
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
