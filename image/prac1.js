let img;

function preload(){
  img = loadImage('assets/cat.png');
}

function setup(){
  createCanvas(1600, 900);
}

function draw(){
  background(255);
  image(img, 0, 0);
}