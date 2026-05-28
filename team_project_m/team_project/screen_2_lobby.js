// =========================================================================
// screen_2_lobby.js (화면 꽉 차는 카드형 UI 버전)
// =========================================================================

function drawLobbyScreen() {
  background(240);
  
  // 1. 상단 안내 텍스트 (화면 상단 중앙으로 큼직하게 배치)
  fill(0);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("🕹️ 당신의 담당 방향을 선택하세요", windowWidth / 2, windowHeight * 0.15);

  // -----------------------------------------------------------------
  // ⭐️ 화면을 꽉 채우는 동적 크기 계산
  // -----------------------------------------------------------------
  let margin = windowWidth * 0.1;  // 화면 양옆 10%를 여백으로 둡니다.
  let gap = 20;                    // 버튼(카드) 사이의 간격
  // (전체너비 - 양옆여백 - 간격3개)를 4등분 하여 카드의 너비를 구합니다.
  let bw = (windowWidth - (margin * 2) - (gap * 3)) / 4; 
  let bh = windowHeight * 0.4;     // 화면 높이의 40%를 카드 높이로 씁니다.
  let by = (windowHeight - bh) / 2; // 화면 세로 중앙에 오도록 Y좌표 계산

  // 2. 방향 선택 버튼 그리기
  for (let i = 0; i < 4; i++) {
    let bx = margin + i * (bw + gap);
    let taken = isRoleTaken(i);

    // 버튼 배경색 결정
    if (me.role === i) fill(46, 204, 113); // 내가 고른 것: 초록색
    else if (taken) fill(189, 195, 199);   // 남이 고른 것: 회색
    else fill(255);                        // 선택 가능: 흰색

    stroke(150);
    strokeWeight(3);
    rect(bx, by, bw, bh, 15); // 모서리가 둥근(15) 커다란 사각형

    // 버튼 안 텍스트 그리기
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24); // 카드가 커졌으니 글자도 큼직하게
    
    if (me.role === i) {
      text(ROLES[i] + "\n\n[내 방향]", bx + bw/2, by + bh/2);
    } else if (taken) {
      text(ROLES[i] + "\n\n[선택 불가]", bx + bw/2, by + bh/2);
    } else {
      text(ROLES[i] + "\n\n[선택 가능]", bx + bw/2, by + bh/2);
    }
  }

  // 3. 다음으로 넘어가는 하단 버튼 (이것도 가운데 예쁘게 정렬)
  let nextBtnW = 350;
  let nextBtnH = 60;
  let nextBtnX = (windowWidth - nextBtnW) / 2;
  let nextBtnY = windowHeight * 0.85;

  fill(255, 150, 150);
  stroke(0);
  strokeWeight(2);
  rect(nextBtnX, nextBtnY, nextBtnW, nextBtnH, 10);
  
  fill(0);
  noStroke();
  textSize(20);
  text("모두 골랐다면 여기 클릭 (스테이지 선택)", windowWidth/2, nextBtnY + nextBtnH/2);
}

// -----------------------------------------------------------------
// 마우스 클릭 판정 (draw에서 썼던 계산식을 똑같이 써야 클릭이 맞물립니다)
// -----------------------------------------------------------------
function mousePressedLobby(mx, my) {
  let margin = windowWidth * 0.1;
  let gap = 20;
  let bw = (windowWidth - (margin * 2) - (gap * 3)) / 4;
  let bh = windowHeight * 0.4;
  let by = (windowHeight - bh) / 2;

  // 1. 역할 선택 버튼 클릭 체크
  for (let i = 0; i < 4; i++) {
    let bx = margin + i * (bw + gap);

    if (mx > bx && mx < bx + bw && my > by && my < by + bh) {
      if (!isRoleTaken(i)) {
        me.role = i;
      }
    }
  }

  // 2. 하단 다음 화면 버튼 클릭 체크
  let nextBtnW = 350;
  let nextBtnH = 60;
  let nextBtnX = (windowWidth - nextBtnW) / 2;
  let nextBtnY = windowHeight * 0.85;

  if (mx > nextBtnX && mx < nextBtnX + nextBtnW && my > nextBtnY && my < nextBtnY + nextBtnH) {
    sharedSignal.currentGameState = 3; 
  }
}

// 중복 체크 함수 (변경 없음)
function isRoleTaken(roleIndex) {
  for (let p of participants) {
    if (p.role === roleIndex && p.role !== me.role) return true;
  }
  return false;
}