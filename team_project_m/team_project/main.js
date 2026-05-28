// =========================================================================
// main.js
// =========================================================================

let sharedPos;    
let sharedSignal; 
let me;           
let participants; 

let myGameState = 1; 

const ROLES = ["W (위쪽 ⬆️)", "A (왼쪽 ⬅️)", "S (아래쪽 ⬇️)", "D (오른쪽 ➡️)"];
let MOVE_SPEED_X; 
let MOVE_SPEED_Y; 

const MAX_STAGES = 6; 

function preload() {
  // 방 이름 변경 (이전 데이터와 겹치지 않도록)
  partyConnect("wss://demoserver.p5party.org", "tori_coop_maze_6stages_v2", "main_room");
  
  // ⭐️ 시작 위치를 20x16 맵 기준 좌표로 수정 (0.15 -> 0.125, 0.3125 -> 0.15625)
  sharedPos = partyLoadShared("position", { px: 0.125, py: 0.15625 });
  
  sharedSignal = partyLoadShared("signal", { 
    currentDir: "NONE",
    currentGameState: 1, 
    selectedStage: 0,
    isDead: false,     
    isSuccess: false,
    speedMode: "NORMAL" 
  });
  
  me = partyLoadMyShared({ role: -1 });
  participants = partyLoadParticipantShareds();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  MOVE_SPEED_X = 0.001; 
  MOVE_SPEED_Y = 0.001;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (myGameState !== sharedSignal.currentGameState) {
    myGameState = sharedSignal.currentGameState;
  }

  if (myGameState === 1) drawTitleScreen();
  else if (myGameState === 2) drawLobbyScreen();
  else if (myGameState === 3) drawStageSelectScreen();
  else if (myGameState === 4) drawGameScreen();
}

function mousePressed() {
  if (myGameState === 1) mousePressedTitle(mouseX, mouseY);
  else if (myGameState === 2) mousePressedLobby(mouseX, mouseY);
  else if (myGameState === 3) mousePressedStage(mouseX, mouseY);
  else if (myGameState === 4) mousePressedGame(mouseX, mouseY);
}

function keyPressed() {
  if (myGameState === 4) keyPressedGame();
}