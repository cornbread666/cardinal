/* VARIATION OPPORTUNITIES
    - circle radius
    - number of lines
    - line thickness
    - color palette
    - animation properties
    - dots / dust
    - texture
*/

let startAng, startAng2, startAng3, ang, textureElement, count;
let rgtAng = 1.57;
let turn = 0.2;

function setup() {

  mainCanvas = createCanvas(windowWidth, windowHeight);
  frameRate(12);

  p5grain.setup();
  textureElement = document.getElementById("texture_overlay");

  // Variations
  //PALETTE = ["#3A2923", "#684F44", "#7D5F60", "#A6624B", "#C59D7A", "#F1B87D", "#D17F76", "#6D918F", "#8C9687"];
  //PALETTE = ["#767A34", "#FBA570", "#490B32", "#F49579", "#F3AF9B", "#FEE581", "#FCCFC7", "#F3DDF0", "#C4CBE6"];
  //PALETTE = ["#A86F45", "#B0A24F", "#FAE8E2", "#D2664F", "#EFC39E", "#F7CA82", "#FDA684", "#D2664F", "#A1ACA7"];
  //PALETTE = ["#997B66", "#797D62", "#E4B074", "#D08C60", "#F8D488", "#E5C59E", "#F1DCA7", "#D9AE94", "#9B9B7A"];
  PALETTE = ["#264653", "#287271", "#8AB17D", "#E76F51", "#F4A261", "#EFB366", "#EE8959", "#2A9D8F", "#E9C46A"];
  BG_PALETTE = [PALETTE[0], PALETTE[1], PALETTE[2]]; // background element colors
  TW_PALETTE = [PALETTE[3], PALETTE[4], PALETTE[5]]; // tumbleweed colors
  FG_PALETTE = [PALETTE[6], PALETTE[7], PALETTE[8]]; // foreground element colors
  RADIUS = 0.8; // radius of tumbleweed: 0.6 - 0.8
  ANGVOL = PI * 0.04; // volatility of angle change: 0.02 - 0.06
  ROOTED = false; // if the tumbleweed's lines all originate from one position
  SEED = 99; // consistently display tumbleweed
  randomSeed(SEED);

  // Globals
  cnv2 = createGraphics(width, height);
  twCanvas = createGraphics(width,height);
  frame = width * 0.05; // frame of undrawable space within the canvas
  edgeBuff = width * 0.05; // how far away lines will stay away from of window
  lineLength = height * 0.001;

  background(BG_PALETTE[0]);
  alphaCircle();
  blobMaker(30, 150);
  lineMaker(20000, 6, 0.05, 1);
  dotMaker(400, 1, 125);
  lineMaker(20000, 3, 0.1, 2);
  dotMaker(700, 0.4, 180);
  blobMaker(20, 8);
  lineMaker(50000, 1, 1, 3);
  dotMaker(800, 0.3, 255);
  //image(twCanvas, 0, 0);
}

function alphaCircle() {
  cnv2.rectMode(CENTER);
  cnv2.background(255);
  cnv2.background(0);
  cnv2.noStroke();
  let minDim = Math.min(height, width);
  cnv2.circle(width / 2, height / 2, minDim * RADIUS);
}

function drawBlob(alpha) {
  x = random(width);
  y = random(height);
  push();
  translate(x, y);
  rotate(random(PI * 2));
  let r = (startR = height * random(0.1, 0.3));
  var vertices = [];

  for (var i = 0; i < PI * 2; i += 0.3) {
    x = cos(i) * r;
    y = sin(i) * r;
    vertices.push({x: x, y: y});
    r += random(-r / 10, r / 10);
    if (i > PI * 1.5) {
      r = r + (startR - r) / 3;
    } else if (i > PI * 1.75) {
      r = r + (startR - r) / 7;
    }
  }
  let c = color(random(BG_PALETTE));
  c.setAlpha(alpha);
  fill(c);
  noStroke();
  drawingContext.filter = "blur(40px)";
  beginShape();
  curveVertex(vertices[vertices.length-1].x, vertices[vertices.length-1].y);
  vertices.forEach(v => curveVertex(v.x, v.y));
  curveVertex(vertices[0].x, vertices[0].y);
  curveVertex(vertices[1].x, vertices[1].y);
  endShape();
  drawingContext.filter = "none";
  pop();
}

function blobMaker(numBlobs, alpha) {
  for (var i = 0; i < numBlobs; i++) {
    drawBlob(alpha);
  }
}

function drawDot(size, alpha) {
  push();
  translate(random(width),random(height));
  rotate(random(PI * 2));
  sizeInc = size;
  let r = (startR = height * sizeInc * random(0.003, 0.011));
  var vertices = [];

  for (k = 0; k < PI * 2; k += 0.3) {
    r += r * random(-0.25, 0.25);
    if (k > PI * 1.5) {
      r = r + (startR - r) / 3;
    } else if (k > PI * 1.75) {
      r = r + (startR - r) / 7;
    }
    x2 = cos(k) * r;
    y2 = sin(k) * r;
    vertices.push({x: x2, y: y2});
  }

  let c = color(random(FG_PALETTE));
  c.setAlpha(alpha);
  fill(c);
  noStroke();
  beginShape();
  curveVertex(vertices[vertices.length-1].x, vertices[vertices.length-1].y);
  vertices.forEach(v => curveVertex(v.x, v.y));
  curveVertex(vertices[0].x, vertices[0].y);
  curveVertex(vertices[1].x, vertices[1].y);
  endShape();
  pop();
}

function dotMaker(numDots, size, alpha) {
  for (var i = 0; i < numDots; i++) {
    drawDot(size, alpha);
  }
}

function lineMaker(numLines, swScale, alpha, index) {

  let c = color(TW_PALETTE[index-1]);
  twCanvas.colorMode(RGB, 255);
  let cstr = `rgba(${red(c)}, ${green(c)}, ${blue(c)}, ${alpha})`;
  twCanvas.stroke(cstr);

  newLine();
  for (var i = 0; i < numLines; i++) {
    ang = ang + random(-ANGVOL, ANGVOL);
    x = lineLength * sin(ang) + x;
    y = lineLength * cos(ang) + y;
    if (random(100) < 5) {
      edges();
    }
    //edges();
    sw += width * random(-0.00003, 0.00003);
    sw = constrain(sw, width * 0.0001, width * 0.009);
    twCanvas.strokeWeight(sw*swScale);
    twCanvas.line(prevX, prevY, x, y);
    prevX = x;
    prevY = y;
    if (random(1000) < 1) {
      newLine();
    }
  }
}

function newLine() {
  //random start ang
  newXY();
  ang = random(PI * 2);
  sw = width * random(0.0002, 0.005);
  prevX = x;
  prevY = y;
}

function newXY() {
  if (ROOTED) {
    let minDim = Math.min(height, width);
    x = (width / 2) - (minDim * (RADIUS / 4));
    y = (height / 2) - (minDim * (RADIUS / 4));
  } else {
    count = 0;
    while (count < 40) {
      x = round(random(frame, width - frame));
      y = round(random(frame, height - frame));
      check = cnv2.get(x, y);
      if (check[0] != 0) {
        break;
      }
      count++;
    }
  }

}

function edges() {
  front = cnv2.get(edgeBuff * sin(ang) + x, edgeBuff * cos(ang) + y);
  if (front[0] == 0) {
    rgt = cnv2.get(
      round(edgeBuff * sin(ang + rgtAng) + x),
      round(edgeBuff * cos(ang + rgtAng) + y)
    );

    lft = cnv2.get(
      round(edgeBuff * sin(ang - rgtAng) + x),
      round(edgeBuff * cos(ang - rgtAng) + y)
    );

    if (rgt[0] == 0 && lft[0] == 0 && random(20) < 19) {
      newLine();
    } else if (random(20) < 19) {
      ang += turn;
    }
  }
  if (random(150) < 1) {
    turn *= -1;
  }
}

function draw() {

  background(255);

  count += 1;

  imageMode(CENTER);
  translate(width / 2, height / 2);
  rotate((count / 100) % (2 * PI));

  image(mainCanvas, 0, 0);
  image(twCanvas, 0, 0);

  textureAnimate(textureElement);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
