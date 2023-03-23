//import 8 my paintings
import tableau1 from "../public/tableau1.jpg";
import tableau2 from "../public/tableau2.jpg";
import tableau3 from "../public/tableau3.jpg";
import tableau4 from "../public/tableau4.jpg";
import tableau5 from "../public/tableau5.jpg";
import tableau6 from "../public/tableau6.jpg";
import tableau7 from "../public/tableau7.jpg";
import tableau8 from "../public/tableau8.jpg";

console.log("start");

let rotateValue = 0;
let bgValue = 0;
let pv = 3;
const backgroundPainting = document.getElementById("background-painting").style;
const background = [
  tableau1,
  tableau2,
  tableau3,
  tableau4,
  tableau5,
  tableau6,
  tableau7,
  tableau8,
];

function randomMinMax(min, max) {
  return min + Math.random() * (max - min);
}
setBackground();

function setBackground() {
  bgValue = background[Math.round(randomMinMax(0, 7))];
  console.log("random: " + bgValue);
  backgroundPainting.backgroundImage = "url(" + bgValue + ")";
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
