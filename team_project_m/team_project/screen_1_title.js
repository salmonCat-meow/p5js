// =========================================================================
// screen_1_title.js
// =========================================================================

function drawTitleScreen() {
  background(100, 150, 255);
  textAlign(CENTER, CENTER);
  
  textSize(50);
  fill(255);
  text("남탓금지!!!", windowWidth/2, windowHeight/2 - 50);
  
  textSize(20);
  if (frameCount % 60 < 30) {
    fill(255, 255, 0);
    text("- 화면을 클릭하여 시작하세요 -", windowWidth/2, windowHeight/2 + 50);
  }
}

function mousePressedTitle(mx, my) {
  sharedSignal.currentGameState = 2; 
}