// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
const file = document.getElementById("image-input");
const form = document.getElementById("generate-meme");
const canvas = document.getElementById("user-image");
const ctx = canvas.getContext("2d");
var buttonGroup = document.getElementById("button-group");
var voiceSelected = document.getElementById("voice-selection");
var voiceOption = document.querySelector("option");
const buttons = buttonGroup.querySelectorAll("button");
var volumeGroup = document.getElementById("volume-group");
var volImg = document.querySelector("img");
var volume = volumeGroup.querySelector("input");
var reset = buttons[0];
var read = buttons[1];
var synth = window.speechSynthesis;
var topText = document.getElementById("text-top");
var bottomText = document.getElementById("text-bottom");
var generate = form.querySelector("button");
var ops = [];
var startx;
var starty;
var width;
var height;

volume.addEventListener("change", () => {
  if(volume.value >= 34 && volume.value <= 66){
    volImg.src = "icons/volume-level-2.svg";
    volImg.alt = "Volume Level 2";
  }else if(volume.value >= 1 && volume.value <= 33){
    volImg.src = "icons/volume-level-1.svg";
    volImg.alt = "Volume Level 1";
  }else if(volume.value == 0){
    volImg.src = "icons/volume-level-0.svg";
    volImg.alt = "Volume Level 0";
  }
});

read.addEventListener("click", () => {
  let utteranceTop = new SpeechSynthesisUtterance(topText.value);
  let utteranceBottom = new SpeechSynthesisUtterance(bottomText.value);
  let selectedOption = voiceSelected.selectedOptions[0].getAttribute("data-name");
  for(let i = 0; i < ops.length; i ++){
    if(ops[i].name === selectedOption){
      utteranceBottom.voice = ops[i];
      utteranceTop.voice = ops[i];
    }
  }
  utteranceTop.volume = volume.value / 100;
  utteranceBottom.volume = volume.value / 100;
  synth.speak(utteranceTop);
  synth.speak(utteranceBottom);
});

reset.addEventListener("click", ()=>{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  file.value = "";
  reset.disabled = true;
  read.disabled = true;
  topText.value = "";
  bottomText.value = "";
  generate.disabled = true;
});

form.addEventListener('submit', () => {
  ctx.fillStyle = "white";
  ctx.font = '50px serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(topText.value, 200,0);
  ctx.textBaseline = "bottom";
  ctx.fillText(bottomText.value,200,400);
  event.preventDefault();
  generate.disabled = true;
});

form.addEventListener("change", () =>{
  reset.disabled = false;
  read.disabled = false;
  generate.disabled = false;
  voiceSelected.disabled = false;
  if(ops.length == 0){
      ops = synth.getVoices();
      for(let i = 0; i < ops.length; i ++){
        var option = document.createElement("option");
        option.textContent = ops[i].name + ' (' + ops[i].lang + ')';
        if(ops[i].default) {
          option.textContent += ' -- DEFAULT';
        }
        option.setAttribute('data-lang', ops[i].lang);
        option.setAttribute('data-name', ops[i].name);
        voiceSelected.appendChild(option);
        if(i == ops.length - 1){
          voiceSelected.remove(0);
        }
    }
  }
});

file.addEventListener("change", () =>{
  let link = URL.createObjectURL(file.files[0]);
  img.src = link;
  img.alt = file.files[0].name;
});



// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log(canvas.width);
  // console.log(canvas.height);
  // console.log(img.width);
  // console.log(img.height);
  buttons[0].disabled = false;
  buttons[1].disabled = false;
  let temp = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  startx = temp.startX;
  starty = temp.startY;
  width = temp.width;
  height = temp.height;
  ctx.drawImage(img, startx, starty, width, height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
};


