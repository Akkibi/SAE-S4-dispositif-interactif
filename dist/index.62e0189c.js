console.log("start");
let rotateValue = 0;
let bgValue = 0;
let pv = 3;
const backgroundPainting = document.getElementById("background-painting").style;
const background = [
    "tableau1.jpg",
    "tableau2.jpg",
    "tableau3.jpg",
    "tableau4.jpg",
    "tableau5.jpg",
    "tableau6.jpg",
    "tableau7.jpg",
    "tableau8.jpg"
];
function randomMinMax(min, max) {
    return min + Math.random() * (max - min);
}
setBackground();
function setBackground() {
    bgValue = background[Math.round(randomMinMax(0, 7))];
    console.log("random: " + bgValue);
    backgroundPainting.backgroundImage = "url(./" + bgValue + ")";
}
function step(number) {
    rotateValue = randomMinMax(-number, number);
    gsap.to("#background-painting", {
        rotation: rotateValue,
        y: number * 3,
        x: 0,
        duration: 1,
        ease: "bounce.out"
    });
    return rotateValue;
}

//# sourceMappingURL=index.62e0189c.js.map
