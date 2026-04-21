let faceMesh;
let video;
let faces = [];
// 1. maxFaces를 늘려 여러 명을 인식하게 합니다.
let options = { maxFaces: 10, refineLandmarks: false, flipHorizontal: true };

const magnifierRadius = 50; // 돋보기 크기를 살짝 줄였습니다 (여러 명일 때 겹침 방지)
const zoomLevel = 1.8;

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // 비디오 좌우 반전 그리기
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 2. 반복문을 사용하여 감지된 '모든' 얼굴에 효과 적용
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    // 확대할 주요 포인트 (눈, 코, 입)
    let spots = [
      face.keypoints[159], // 왼쪽 눈
      face.keypoints[386], // 오른쪽 눈
      face.keypoints[1],   // 코끝
      face.keypoints[13]   // 입 중앙
    ];

    for (let pt of spots) {
      drawMagnifier(pt.x, pt.y, magnifierRadius, zoomLevel);
    }
  }
}

function drawMagnifier(x, y, radius, zoom) {
  let sourceSize = (radius * 2) / zoom;
  let sourceX = x - sourceSize / 2;
  let sourceY = y - sourceSize / 2;

  // 현재 캔버스에서 해당 영역 복사
  let imgSection = get(sourceX, sourceY, sourceSize, sourceSize);

  // 원형 마스크 생성
  let maskGraphics = createGraphics(sourceSize, sourceSize);
  maskGraphics.fill(255);
  maskGraphics.noStroke();
  maskGraphics.ellipse(sourceSize / 2, sourceSize / 2, sourceSize, sourceSize);
  
  imgSection.mask(maskGraphics);

  // 확대해서 그리기
  imageMode(CENTER);
  image(imgSection, x, y, radius * 2, radius * 2);
  imageMode(CORNER);

  // 돋보기 테두리
  stroke(255, 255, 255, 180);
  strokeWeight(2);
  noFill();
  circle(x, y, radius * 2);
}

function gotFaces(results) {
  faces = results;
}