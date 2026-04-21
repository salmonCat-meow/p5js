let speed;
let ball_X_size, ball_Y_size;
let pad_X_size, pad_Y_size;
let ball_size;
let pad_size;
let ball_X, ball_Y;
let ball_X_speed, ball_Y_speed;

function setup() {
  createCanvas(900, 600);
  speed = prompt("speed of the ball");
  speed = int(speed);
  ball_size = prompt("size of the ball");
  ball_size = int(ball_size);
  ball_X_size = ball_size;
  ball_Y_size = ball_size;
  pad_size = prompt("size of the pad");
  pad_X_size = pad_size;
  pad_Y_size = 20;
  ball_X_speed = speed;
  ball_Y_speed = speed;
  ball_X = width/2;
  ball_Y = height/2;
}

function draw() {
  background(220);
  
  //패드
  fill('darkblue');
  if (mouseX <= (pad_X_size/2)){
    rect(0, height - pad_Y_size, pad_X_size, pad_Y_size);
  } else if (mouseX >= width - (pad_X_size/2)){
    rect(width - pad_X_size, height - pad_Y_size, pad_X_size, pad_Y_size);
  } else{
    rect(mouseX - (pad_X_size/2), height - pad_Y_size, pad_X_size, pad_Y_size);
  }
  
  //공
  fill('#00ff00');
  ellipse(ball_X, ball_Y, ball_X_size, ball_Y_size);
  ball_X += ball_X_speed;
  ball_Y += ball_Y_speed;
  
  //공 튕김
  if(ball_X - (ball_X_size/2) <= 0){
    ball_X_speed *= -1;
  }
  if(ball_X + (ball_X_size/2) >= width){
    ball_X_speed *= -1;
  }
  if(ball_Y - (ball_Y_size/2) <= 0){
    ball_Y_speed *= -1;
  }
  if(ball_Y + (ball_Y_size/2) >= height){
    ball_Y_speed *= -1;
  }
}