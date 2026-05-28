// =========================================================================
// screen_3_stage.js
// =========================================================================

function drawStageSelectScreen() {
  background(255, 200, 150);
  textAlign(CENTER, CENTER);
  
  textSize(40);
  fill(0);
  text("스테이지 선택", windowWidth/2, 100);

  let btnW = 300;
  let btnH = 60;
  let gapX = 40;
  let gapY = 30;
  let startX = windowWidth/2 - btnW - (gapX / 2);
  let startY = 180;

  for (let i = 1; i <= 6; i++) {
    let col = (i - 1) % 2;
    let row = Math.floor((i - 1) / 2);
    let bx = startX + col * (btnW + gapX);
    let by = startY + row * (btnH + gapY);

    fill(255); stroke(0); strokeWeight(2);
    rect(bx, by, btnW, btnH, 15);
    
    fill(0); noStroke(); textSize(20);
    text(`스테이지 ${i}`, bx + btnW/2, by + btnH/2);
  }

  let returnBy = startY + 3 * (btnH + gapY) + 20;
  fill(200, 220, 255); stroke(0); strokeWeight(2);
  rect(windowWidth/2 - 150, returnBy, 300, 50, 15);
  fill(0); noStroke(); textSize(18);
  text("🔙 로비로 돌아가기 (역할 변경)", windowWidth/2, returnBy + 25);
}

function mousePressedStage(mx, my) {
  let btnW = 300;
  let btnH = 60;
  let gapX = 40;
  let gapY = 30;
  let startX = windowWidth/2 - btnW - (gapX / 2);
  let startY = 180;

  for (let i = 1; i <= 6; i++) {
    let col = (i - 1) % 2;
    let row = Math.floor((i - 1) / 2);
    let bx = startX + col * (btnW + gapX);
    let by = startY + row * (btnH + gapY);

    if (mx > bx && mx < bx + btnW && my > by && my < by + btnH) {
      enterStage(i);
    }
  }

  let returnBy = startY + 3 * (btnH + gapY) + 20;
  if (mx > windowWidth/2 - 150 && mx < windowWidth/2 + 150 && my > returnBy && my < returnBy + 50) {
    sharedSignal.currentGameState = 2; 
  }
}

function enterStage(stageNum) {
  sharedSignal.selectedStage = stageNum;
  
  // ⭐️ 진입 시 좌표 리셋도 20x16 맵 기준 좌표로 수정
  sharedPos.px = 0.125; 
  sharedPos.py = 0.15625;
  
  sharedSignal.isDead = false;
  sharedSignal.isSuccess = false;
  sharedSignal.currentDir = "NONE";
  sharedSignal.speedMode = "NORMAL";
  sharedSignal.currentGameState = 4; 
}