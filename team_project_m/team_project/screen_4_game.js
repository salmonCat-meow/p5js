// =========================================================================
// screen_4_game.js
// =========================================================================

let localPx = 0.125; 
let localPy = 0.15625;

// 맵 크기 2배 확장 (20 x 16)
const COLS = 20;
const ROWS = 16;

// 시작 위치 (행 2, 열 2 기준)
const START_PX = 2.5 / COLS;   // 0.125
const START_PY = 2.5 / ROWS;   // 0.15625

function getCurrentMap() {
  if (sharedSignal.selectedStage === 1) return MAZE_MAP_1;
  if (sharedSignal.selectedStage === 2) return MAZE_MAP_2;
  if (sharedSignal.selectedStage === 3) return MAZE_MAP_3;
  if (sharedSignal.selectedStage === 4) return MAZE_MAP_4;
  if (sharedSignal.selectedStage === 5) return MAZE_MAP_5;
  if (sharedSignal.selectedStage === 6) return MAZE_MAP_6;
  return MAZE_MAP_1; 
}

function drawGameScreen() {
  background(240);

  let cellW = windowWidth / COLS;
  let cellH = windowHeight / ROWS;
  let currentMap = getCurrentMap();

  // 1. 미로 배경 및 방해 아이템 그리기
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (currentMap[r][c] === 1) {
        fill(60, 70, 90); 
        rect(c * cellW, r * cellH, cellW, cellH);
      } else if (currentMap[r][c] === 3) {
        fill(255, 215, 0); 
        rect(c * cellW, r * cellH, cellW, cellH);
      } else if (currentMap[r][c] === 2) {
        fill(150, 255, 150); 
        rect(c * cellW, r * cellH, cellW, cellH);
      } else if (currentMap[r][c] === 4) {
        fill(255, 130, 0); 
        rect(c * cellW, r * cellH, cellW, cellH);
        fill(255); textAlign(CENTER, CENTER); textSize(cellH * 0.5);
        text("⚡", c * cellW + cellW/2, r * cellH + cellH/2);
      } else if (currentMap[r][c] === 5) {
        fill(150, 90, 230); 
        rect(c * cellW, r * cellH, cellW, cellH);
        fill(255); textAlign(CENTER, CENTER); textSize(cellH * 0.5);
        text("🐢", c * cellW + cellW/2, r * cellH + cellH/2);
      }
    }
  }

  // 2. 이동 엔진 및 충돌/아이템 감지 (방장 전용)
  if (partyIsHost() && !sharedSignal.isDead && !sharedSignal.isSuccess) { 
    let speedMode = sharedSignal.speedMode || "NORMAL";
    let currentSpeedX = MOVE_SPEED_X;
    let currentSpeedY = MOVE_SPEED_Y;

    if (speedMode === "FAST") {
      currentSpeedX = MOVE_SPEED_X * 2; 
      currentSpeedY = MOVE_SPEED_Y * 2;
    } else if (speedMode === "SLOW") {
      currentSpeedX = MOVE_SPEED_X * 0.6; 
      currentSpeedY = MOVE_SPEED_Y * 0.6;
    }

    if (sharedSignal.currentDir === "UP")    sharedPos.py -= currentSpeedY;
    if (sharedSignal.currentDir === "DOWN")  sharedPos.py += currentSpeedY;
    if (sharedSignal.currentDir === "LEFT")  sharedPos.px -= currentSpeedX;
    if (sharedSignal.currentDir === "RIGHT") sharedPos.px += currentSpeedX;

    // 히트박스 축소 (칸이 좁아졌으므로 12 -> 8로 변경)
    let hitboxX = 8 / windowWidth; 
    let hitboxY = 8 / windowHeight;

    let checkCell = (px, py) => {
      let c = Math.floor(px * COLS);
      let r = Math.floor(py * ROWS);
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) return currentMap[r][c];
      return 1; 
    };

    let tl = checkCell(sharedPos.px - hitboxX, sharedPos.py - hitboxY);
    let tr = checkCell(sharedPos.px + hitboxX, sharedPos.py - hitboxY);
    let bl = checkCell(sharedPos.px - hitboxX, sharedPos.py + hitboxY);
    let br = checkCell(sharedPos.px + hitboxX, sharedPos.py + hitboxY);

    if (tl === 1 || tr === 1 || bl === 1 || br === 1) {
      sharedSignal.isDead = true;
      sharedSignal.currentDir = "NONE";
    }
    else if (tl === 3 || tr === 3 || bl === 3 || br === 3) {
      sharedSignal.isSuccess = true;
      sharedSignal.currentDir = "NONE";
    }

    let centerC = Math.floor(sharedPos.px * COLS);
    let centerR = Math.floor(sharedPos.py * ROWS);
    if (centerR >= 0 && centerR < ROWS && centerC >= 0 && centerC < COLS) {
      let currentCell = currentMap[centerR][centerC];
      if (currentCell === 4) sharedSignal.speedMode = "FAST"; 
      else if (currentCell === 5) sharedSignal.speedMode = "SLOW"; 
    }

    sharedPos.px = constrain(sharedPos.px, hitboxX, 1.0 - hitboxX);
    sharedPos.py = constrain(sharedPos.py, hitboxY, 1.0 - hitboxY);
  }

  // 3. 캐릭터 그리기
  localPx = lerp(localPx, sharedPos.px, 0.2);
  localPy = lerp(localPy, sharedPos.py, 0.2);

  let drawX = localPx * windowWidth;
  let drawY = localPy * windowHeight;

  if (sharedSignal.isDead) fill(150); 
  else fill(255, 100, 100);
  
  // 캐릭터 크기 축소 (30 -> 20)
  stroke(0); strokeWeight(1.5);
  ellipse(drawX, drawY, 20, 20); 
  
  fill(0); noStroke();
  ellipse(drawX - 3, drawY - 3, 3, 3);
  ellipse(drawX + 3, drawY - 3, 3, 3);
  
  textAlign(CENTER); textSize(10); fill(0);
  text(sharedSignal.isDead ? "사망" : "토리", drawX, drawY + 20);

  // 4. 상단 UI
  fill(220); rect(0, 0, windowWidth, 60);
  textAlign(LEFT, CENTER); textSize(18); fill(0);
  text("스테이지 " + sharedSignal.selectedStage, 20, 30);
  
  let statusText = partyIsHost() ? "👑 방장(Host)" : "👤 게스트(Guest)";
  let speedText = "보통";
  if (sharedSignal.speedMode === "FAST") speedText = "⚡ 초고속 (제어 불가!!)";
  if (sharedSignal.speedMode === "SLOW") speedText = "🐢 초슬로우 (답답함!!)";
  
  text(statusText + " | 신호: " + sharedSignal.currentDir + " | 상태: " + speedText, 180, 30);

  // 5. 결과 오버레이 화면
  if (sharedSignal.isDead) {
    fill(0, 0, 0, 180); rect(0, 0, windowWidth, windowHeight);
    textAlign(CENTER, CENTER); fill(255, 50, 50); textSize(50);
    text("💀 게임 오버! 벽에 부딪혔습니다 💀", windowWidth/2, windowHeight/2 - 100);

    fill(255); stroke(0); strokeWeight(2);
    rect(windowWidth/2 - 180, windowHeight/2, 160, 60, 10);
    fill(0); noStroke(); textSize(20); 
    text("🔄 다시 하기", windowWidth/2 - 100, windowHeight/2 + 30);

    fill(200); stroke(0); strokeWeight(2);
    rect(windowWidth/2 + 20, windowHeight/2, 160, 60, 10);
    fill(0); noStroke(); textSize(18); 
    text("🔙 스테이지 선택", windowWidth/2 + 100, windowHeight/2 + 30);
  } 
  else if (sharedSignal.isSuccess) {
    fill(255, 255, 255, 200); rect(0, 0, windowWidth, windowHeight);
    textAlign(CENTER, CENTER); fill(50, 150, 255); textSize(50);
    text("🎉 스테이지 클리어! 🎉", windowWidth/2, windowHeight/2 - 100);

    if (sharedSignal.selectedStage < 6) {
      fill(150, 200, 255); stroke(0); strokeWeight(2);
      rect(windowWidth/2 - 180, windowHeight/2, 160, 60, 10);
      fill(0); noStroke(); textSize(18); 
      text("▶️ 다음 스테이지", windowWidth/2 - 100, windowHeight/2 + 30);

      fill(200, 255, 200); stroke(0); strokeWeight(2);
      rect(windowWidth/2 + 20, windowHeight/2, 160, 60, 10);
      fill(0); noStroke(); textSize(18); 
      text("🔙 스테이지 선택", windowWidth/2 + 100, windowHeight/2 + 30);
    } else {
      fill(200, 255, 200); stroke(0); strokeWeight(2);
      rect(windowWidth/2 - 100, windowHeight/2, 200, 60, 10);
      fill(0); noStroke(); textSize(20); 
      text("🔙 스테이지 선택", windowWidth/2, windowHeight/2 + 30);
    }
  }
}

function mousePressedGame(mx, my) {
  if (sharedSignal.isDead) {
    if (mx > windowWidth/2 - 180 && mx < windowWidth/2 - 20 && my > windowHeight/2 && my < windowHeight/2 + 60) {
      sharedPos.px = START_PX; 
      sharedPos.py = START_PY;
      localPx = START_PX; 
      localPy = START_PY;
      sharedSignal.currentDir = "NONE";
      sharedSignal.isDead = false;
      sharedSignal.speedMode = "NORMAL";
    }
    if (mx > windowWidth/2 + 20 && mx < windowWidth/2 + 180 && my > windowHeight/2 && my < windowHeight/2 + 60) {
      sharedSignal.currentGameState = 3; 
    }
  }
  else if (sharedSignal.isSuccess) {
    if (sharedSignal.selectedStage < 6) {
      if (mx > windowWidth/2 - 180 && mx < windowWidth/2 - 20 && my > windowHeight/2 && my < windowHeight/2 + 60) {
        sharedSignal.selectedStage += 1; 
        sharedPos.px = START_PX;
        sharedPos.py = START_PY;
        localPx = START_PX;
        localPy = START_PY;
        sharedSignal.isDead = false;
        sharedSignal.isSuccess = false;
        sharedSignal.currentDir = "NONE";
        sharedSignal.speedMode = "NORMAL";
      }
      if (mx > windowWidth/2 + 20 && mx < windowWidth/2 + 180 && my > windowHeight/2 && my < windowHeight/2 + 60) {
        sharedSignal.currentGameState = 3; 
      }
    } else {
      if (mx > windowWidth/2 - 100 && mx < windowWidth/2 + 100 && my > windowHeight/2 && my < windowHeight/2 + 60) {
        sharedSignal.currentGameState = 3; 
      }
    }
  }
}

function keyPressedGame() {
  if (sharedSignal.isDead || sharedSignal.isSuccess) return; 
  let inputKey = key.toLowerCase();
  if (me.role === 0 && (inputKey === 'w' || key === 'ㅈ')) sharedSignal.currentDir = "UP";
  if (me.role === 1 && (inputKey === 'a' || key === 'ㅁ')) sharedSignal.currentDir = "LEFT";
  if (me.role === 2 && (inputKey === 's' || key === 'ㄴ')) sharedSignal.currentDir = "DOWN";
  if (me.role === 3 && (inputKey === 'd' || key === 'ㅇ')) sharedSignal.currentDir = "RIGHT";
}