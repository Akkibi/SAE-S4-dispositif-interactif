//import 8 my paintings

console.log("start");

let rotateValue = 0;
let bgValue = 0;
let pv = 3;
const backgroundPainting = document.getElementById("background-painting").style;
const background = [
  "tableau1",
  "tableau2",
  "tableau3",
  "tableau4",
  "tableau5",
  "tableau6",
  "tableau7",
  "tableau8",
];

// console.log(background);

function randomMinMax(min, max) {
  return min + Math.random() * (max - min);
}
setBackground();

function setBackground() {
  bgValue = background[Math.round(randomMinMax(0, 7))];
  // console.log("random: " + bgValue);
  backgroundPainting.backgroundImage = "url(../public/tableaux/" + bgValue + ".jpg)";
}

function step(number) {
  rotateValue = randomMinMax(-number, number);
  gsap.to("#background-painting", {
    rotation: rotateValue,
    y: number * 3,
    x: 0,
    duration: 1,
    ease: "bounce.out",
  });
  return rotateValue;
}
