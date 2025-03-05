/* VARIATION OPPORTUNITIES
    - circle radius
    - number of lines
    - line thickness
    - color palette
    - animation properties
    - dots / dust
    - texture
*/

let tumbleweedSketch = function(t) {

  t.ang;
  t.count = 0;
  t.rgtAng = 1.57;
  t.turn = 0.2;

  t.PALETTE;
  t.BG_PALETTE;
  t.TW_PALETTE;
  t.FG_PALETTE;
  t.RADIUS;
  t.ANGVOL;
  t.ROOTED;

  t.setup = function() {

    console.log("running!");

    t.pw = t.windowWidth / 2;
    t.ph = t.windowHeight / 2;
    t.pd = Math.min(t.pw, t.ph);
    //t.mainCanvas = t.createCanvas(t.pd, t.pd);
    t.mainCanvas = t.createCanvas(1000, 1000);
    t.mainCanvas.parent("tumbleweed_container");
    t.mainCanvas.id("tumbleweed_canvas");

    // Variations
    //t.PALETTE = ["#3A2923", "#684F44", "#7D5F60", "#A6624B", "#C59D7A", "#F1B87D", "#D17F76", "#6D918F", "#8C9687"];
    //t.PALETTE = ["#767A34", "#FBA570", "#490B32", "#F49579", "#F3AF9B", "#FEE581", "#FCCFC7", "#F3DDF0", "#C4CBE6"];
    //t.PALETTE = ["#A86F45", "#B0A24F", "#FAE8E2", "#D2664F", "#EFC39E", "#F7CA82", "#FDA684", "#D2664F", "#A1ACA7"];
    //t.PALETTE = ["#997B66", "#797D62", "#E4B074", "#D08C60", "#F8D488", "#E5C59E", "#F1DCA7", "#D9AE94", "#9B9B7A"];
    t.PALETTE = ["#264653", "#287271", "#8AB17D", "#732c2c", "#F4A261", "#EFB366", "#EE8959", "#2A9D8F", "#E9C46A"];
    t.BG_PALETTE = [t.PALETTE[0], t.PALETTE[1], t.PALETTE[2]]; // background element colors
    
    //t.TW_PALETTE = ["#7E3B10", "#bc6c25", "#dda15e"]; // BROWNS
    t.TW_PALETTE = ["#6B0F1A", "#F4A261", "#EFB366"]; // REDS
    
    //t.TW_PALETTE = [t.PALETTE[3], t.PALETTE[4], t.PALETTE[5]]; // tumbleweed colors
    t.FG_PALETTE = [t.PALETTE[6], t.PALETTE[7], t.PALETTE[8]]; // foreground element colors
    
    if (CHEESE_PILLED) {
      t.RADIUS = t.random(0.6, 0.7);
    } else {
      t.RADIUS = t.random(0.7, 0.8);
    }
    
    
    t.ANGVOL = t.PI * 0.08; // volatility of angle change: 0.04 - 0.08
    
    
    t.ROOTED = VALID_HORSE; // if the tumbleweed's lines all originate from one position
    
    
    //SEED = 101; // consistently display tumbleweed
    //randomSeed(SEED);

    // Globals
    t.cnv2 = t.createGraphics(t.width, t.height);
    t.twCanvas = t.createGraphics(t.width, t.height);
    t.dotCanvas = t.createGraphics(t.width, t.height);
    t.frame = t.width * 0.05; // frame of undrawable space within the canvas
    t.edgeBuff = t.width * 0.05; // how far away lines will stay away from of window
    t.lineLength = t.height * 0.001;

    t.background(255, 0);
    t.alphaCircle();
    //t.blobMaker(30, 150);
    //t.lineMaker(20000, 8, 0.05, 1); // numLines, stroke, alpha, color index
    t.lineMaker(20000, 12, 0.1, 1); // numLines, stroke, alpha, color index
    //t.dotMaker(100, 1, 125);
    t.lineMaker(30000, 4, 0.1, 2);
    //t.dotMaker(200, 0.4, 180);
    //t.blobMaker(20, 8);
    //t.dotMaker(300, 0.3, 255);
    t.lineMaker(50000, 1, 1, 3);
    
    t.image(t.twCanvas, 0, 0);
    t.image(t.dotCanvas, 0, 0);
  }

  t.alphaCircle = function() {
    t.cnv2.rectMode(t.CENTER);
    t.cnv2.background(255);
    t.cnv2.background(0);
    t.cnv2.noStroke();
    t.minDim = Math.min(t.height, t.width);
    t.cnv2.circle(t.width / 2, t.height / 2, t.minDim * t.RADIUS);
  }

  t.lineMaker = function(numLines, swScale, alpha, index) {

    t.c = t.color(t.TW_PALETTE[index-1]);
    t.twCanvas.colorMode(t.RGB, 255);
    t.cstr = `rgba(${t.red(t.c)}, ${t.green(t.c)}, ${t.blue(t.c)}, ${alpha})`;
    t.twCanvas.stroke(t.cstr);

    t.newLine();
    for (var i = 0; i < numLines; i++) {
      t.ang = t.ang + t.random(-t.ANGVOL, t.ANGVOL);
      t.x = t.lineLength * t.sin(t.ang) + t.x;
      t.y = t.lineLength * t.cos(t.ang) + t.y;
      if (t.random(100) < 5) {
        t.edges();
      }
      //t.edges();
      t.sw += t.width * t.random(-0.00003, 0.00003);
      t.sw = t.constrain(t.sw, t.width * 0.0001, t.width * 0.009);
      t.twCanvas.strokeWeight(t.sw*swScale);
      t.twCanvas.line(t.prevX, t.prevY, t.x, t.y);
      t.prevX = t.x;
      t.prevY = t.y;
      if (t.random(1000) < 1) {
        t.newLine();
      }
    }
  }

  t.newLine = function() {
    //random start ang
    t.newXY();
    t.ang = t.random(t.PI * 2);
    t.sw = t.width * t.random(0.0002, 0.005);
    t.prevX = t.x;
    t.prevY = t.y;
  }

  t.newXY = function() {
    if (t.ROOTED) {
      t.minDim = Math.min(t.height, t.width);
      t.x = (t.width / 2) - (t.minDim * (t.RADIUS / 4));
      t.y = (t.height / 2) - (t.minDim * (t.RADIUS / 4));
    } else {
      t.count = 0;
      while (t.count < 40) {
        t.x = t.round(t.random(t.frame, t.width - t.frame));
        t.y = t.round(t.random(t.frame, t.height - t.frame));
        t.check = t.cnv2.get(t.x, t.y);
        if (t.check[0] != 0) {
          break;
        }
        t.count++;
      }
    }

  }

  t.edges = function() {
    t.front = t.cnv2.get(t.edgeBuff * t.sin(t.ang) + t.x, t.edgeBuff * t.cos(t.ang) + t.y);
    if (t.front[0] == 0) {
      t.rgt = t.cnv2.get(
        t.round(t.edgeBuff * t.sin(t.ang + t.rgtAng) + t.x),
        t.round(t.edgeBuff * t.cos(t.ang + t.rgtAng) + t.y)
      );

      t.lft = t.cnv2.get(
        t.round(t.edgeBuff * t.sin(t.ang - t.rgtAng) + t.x),
        t.round(t.edgeBuff * t.cos(t.ang - t.rgtAng) + t.y)
      );

      if (t.rgt[0] == 0 && t.lft[0] == 0 && t.random(20) < 19) {
        t.newLine();
      } else if (t.random(20) < 19) {
        t.ang += t.turn;
      }
    }
    if (t.random(150) < 1) {
      t.turn *= -1;
    }
  }

  t.draw = function() {

  }

  t.windowResized = function() {
    t.resizeCanvas(t.windowWidth, t.windowHeight);
  }

}

let backgroundSketch = function(b) {

  b.BG_PALETTE = ["#264653", "#287271", "#8AB17D"];

  b.setup = function() {

    b.mainCanvas = b.createCanvas(b.windowWidth, b.windowHeight);
    b.mainCanvas.style("position", "absolute");
    b.mainCanvas.parent(document.body);
    b.mainCanvas.id("tumbleweed_background");

    b.dotCanvas = b.createGraphics(b.width, b.height);
  }

  b.drawBlob = function(alpha) {
    b.x = b.random(b.width);
    b.y = b.random(b.height);
    b.push();
    b.translate(b.x, b.y);
    b.rotate(b.random(b.PI * 2));
    b.r = (b.startR = b.height * b.random(0.1, 0.3));
    b.vertices = [];

    for (var i = 0; i < b.PI * 2; i += 0.3) {
      b.x = b.cos(i) * b.r;
      b.y = b.sin(i) * b.r;
      b.vertices.push({x: b.x, y: b.y});
      b.r += b.random(-b.r / 10, b.r / 10);
      if (i > b.PI * 1.5) {
        b.r = b.r + (b.startR - b.r) / 3;
      } else if (i > b.PI * 1.75) {
        b.r = b.r + (b.startR - b.r) / 7;
      }
    }
    b.c = b.color(b.random(b.BG_PALETTE));
    b.c.setAlpha(alpha);
    b.fill(b.c);
    b.noStroke();
    //b.drawingContext.filter = "blur(40px)";
    b.beginShape();
    b.curveVertex(b.vertices[b.vertices.length-1].x, b.vertices[b.vertices.length-1].y);
    b.vertices.forEach(v => b.curveVertex(v.x, v.y));
    b.curveVertex(b.vertices[0].x, b.vertices[0].y);
    b.curveVertex(b.vertices[1].x, b.vertices[1].y);
    b.endShape();
    //b.drawingContext.filter = "none";
    b.pop();
  }

  b.blobMaker = function(numBlobs, alpha) {
    for (var i = 0; i < numBlobs; i++) {
      b.drawBlob(alpha);
    }
  }

  b.draw = function() {
    let numBlobs = b.floor(0.000123 * (b.width * b.height));
    b.background(255, 0);
    b.blobMaker(numBlobs, 50); // num blobs, alpha
    b.image(b.dotCanvas, 0, 0);
    b.noLoop();
  }

  b.windowResized = function() {
    b.resizeCanvas(b.windowWidth, b.windowHeight);
  }
}

let dotSketch = function(d) {

  d.FG_PALETTE = ["#EE8959", "#2A9D8F", "#E9C46A"];

  d.setup = function() {

    d.mainCanvas = d.createCanvas(d.windowWidth, d.windowHeight);
    d.mainCanvas.style("position", "absolute");
    //d.mainCanvas.parent("tumbleweed_container");
    d.mainCanvas.parent(document.body);
    d.mainCanvas.id("tumbleweed_foreground");

    d.dotCanvas = d.createGraphics(d.width, d.height);
  }

  d.drawDot = function(size, alpha) {
    
    d.dotCanvas.push();
    d.dotCanvas.translate(d.random(d.width), d.random(d.height));
    d.dotCanvas.rotate(d.random(d.PI * 2));
    d.sizeInc = size;
    d.r = (d.startR = d.height * d.sizeInc * d.random(0.003, 0.011));
    d.vertices = [];
    

    for (k = 0; k < d.PI * 2; k += 0.3) {
      d.r += d.r * d.random(-0.25, 0.25);
      if (k > d.PI * 1.5) {
        d.r = d.r + (d.startR - d.r) / 3;
      } else if (k > d.PI * 1.75) {
        d.r = d.r + (d.startR - d.r) / 7;
      }
      d.x2 = d.cos(k) * d.r;
      d.y2 = d.sin(k) * d.r;
      d.vertices.push({x: d.x2, y: d.y2});
    }

    d.c = d.color(d.random(d.FG_PALETTE));
    d.c.setAlpha(alpha);
    d.dotCanvas.fill(d.c);
    d.dotCanvas.noStroke();
    d.dotCanvas.beginShape();
    d.dotCanvas.curveVertex(d.vertices[d.vertices.length-1].x, d.vertices[d.vertices.length-1].y);
    d.vertices.forEach(v => d.dotCanvas.curveVertex(v.x, v.y));
    d.dotCanvas.curveVertex(d.vertices[0].x, d.vertices[0].y);
    d.dotCanvas.curveVertex(d.vertices[1].x, d.vertices[1].y);
    d.dotCanvas.endShape();
    d.dotCanvas.pop();
  }

  d.dotMaker = function(numDots, size, alpha) {
    for (var i = 0; i < numDots; i++) {
      d.drawDot(size, alpha);
    }
  }

  d.draw = function() {
    d.frameRate(3);

    d.clear();
    d.dotCanvas.remove();

    d.dotCanvas = d.createGraphics(d.width, d.height);

    let numDots = d.floor(0.0008 * (d.width * d.height));
    d.dotMaker(numDots, 0.2, 75);
    d.dotMaker(numDots, 0.2, 75);
    d.dotMaker(numDots, 0.2, 75);
    d.image(d.dotCanvas, 0, 0);
    //d.noLoop(); 
  }

  d.windowResized = function() {
    d.resizeCanvas(d.windowWidth, d.windowHeight);
  }

}

let grainSketch = function(g) {

  g.vert = `
  precision highp float;
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec2 vVertTexCoord;

  void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vVertTexCoord = aTexCoord;
  }
  `;

  g.frag = `
  precision highp float;
  varying vec2 vVertTexCoord;

  uniform sampler2D source;
  uniform float noiseSeed;
  uniform float noiseAmount;

  // Noise functions
  // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  void main() {
    // GorillaSun's grain algorithm
    vec4 inColor = texture2D(source, vVertTexCoord);
    gl_FragColor = clamp(inColor + vec4(
      mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 1234.5678))),
      mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 876.54321))),
      mix(-noiseAmount, noiseAmount, fract(noiseSeed + rand(vVertTexCoord * 3214.5678))),
      0.
    ), 0., 1.);
  }
  `;

  g.grainBuffer;
  g.grainShader;
  g.mainCanvas;

  g.setup = function() {

    g.mainCanvas = g.createCanvas(g.windowWidth, g.windowHeight);
    g.mainCanvas.style("position", "absolute");
    g.mainCanvas.parent(document.body);
    g.mainCanvas.id("tumbleweed_grain");

    g.grainBuffer = g.createGraphics(g.width, g.height, g.WEBGL);
    g.grainBuffer.setAttributes({ alpha: true});
    g.grainShader = g.grainBuffer.createShader(g.vert, g.frag);

    g.image(g.grainBuffer, 0, 0);
  }

  g.applyGrain = function() {
    
    g.grainBuffer.clear()
    g.grainBuffer.reset()
    g.grainBuffer.push()
    g.grainBuffer.shader(g.grainShader)
    g.grainShader.setUniform('noiseSeed', g.random()) // to make the grain change each frame
    g.grainShader.setUniform('source', g.mainCanvas)
    g.grainShader.setUniform('noiseAmount', 0.5)
    g.grainBuffer.rectMode(g.CENTER)
    g.grainBuffer.noStroke()
    g.grainBuffer.rect(0, 0, g.width, g.height)
    g.grainBuffer.pop()
    
    g.clear()
    g.push()
    g.image(g.grainBuffer, 0, 0)
    g.pop()
    
  }

  g.draw = function() {
    g.background(255);
    g.frameRate(6);
    g.applyGrain();
    //g.noLoop();
  }

  g.windowResized = function() {
    g.resizeCanvas(g.windowWidth, g.windowHeight);
  }
}

let plinkoSketch = function(p) {

  p.Engine = Matter.Engine;
  p.World = Matter.World;
  p.Events = Matter.Events;
  p.Bodies = Matter.Bodies;
  p.Body = Matter.Body;
  p.Collision = Matter.Collision;
  
  p.engine = p.Engine.create();
  p.world = p.engine.world;
  p.world.gravity.y = 0.5;
  p.plinker;
  p.pegs = [];
  p.bounds = [];
  p.cols = 11;
  p.rows = 22;
  p.spacing;
  p.optionSpacing;
  p.peachFont;
  p.startTime;
  p.mdu;
  p.plinking = true;
  p.active = false;
  p.startX;
  p.cliques = ["horse girls", "kids who brushed their teeth after lunch",
    "kids who painted their nails with whiteout", "theater kids", "kids who wore shorts in the winter",
    "kids who threw up during a school play", "kids who sat at the peanut allergy table"];
  p.finalChoice;

  p.preload = function () {
    p.peachFont = p.loadFont("css/assets/PeachDays.ttf");
  }

  p.setup = function() {

    p.startTime = p.millis();
    p.pw = Math.min(p.windowWidth * 0.95, p.windowHeight * 0.7143);
    p.ph = Math.min(p.windowHeight * 0.95, p.windowWidth * 1.2635);
    p.mainCanvas = p.createCanvas(p.pw, p.ph);
    p.mainCanvas.parent("plinko_container");
    p.mainCanvas.id("plinko_canvas");

    p.mdu = Math.min(p.height, p.width) / 100;

    for (let i = 0; i < p.cols; i++) {
      for (let j = 0; j < p.rows; j++) {
        var offset = (p.mdu * 4.9) * (j % 2);
        if (j % 2 === 1) {
          if (i < p.cols-1) {
            p.newPeg = new p.peg((p.mdu * 9.8 * i) + offset + p.mdu, (p.mdu * 4.9 * j) + (p.mdu * 10), p.mdu * 0.5);
          }
        } else {
          p.newPeg = new p.peg((p.mdu * 9.8 * i) + offset + p.mdu, (p.mdu * 4.9 * j) + (p.mdu * 10), p.mdu * 0.5);
        }
        p.pegs.push(p.newPeg);
      }
    }

    p.spacing = p.width / p.cols;

    var bottomB = new p.boundary(p.width/2, p.height + 5, p.width, 10, false, "bottomB");
    p.bounds.push(bottomB);
    
    var leftB = new p.boundary(-5, p.height/2, 10, p.height, false, "leftB");
    p.bounds.push(leftB);

    var rightB = new p.boundary(p.width + 5, p.height/2, 10, p.height, false, "rightB");
    p.bounds.push(rightB);

    p.optionSpacing = p.width / 7;

    for (let i = 0; i < p.cols + 2; i++) {
      var x = i * p.optionSpacing;
      var h = p.mdu * 10;
      var w = p.mdu;
      var y = p.height - h / 2;
      p.newB = new p.boundary(x, y, w, h, true, "post");
      p.bounds.push(p.newB);
    }
  }

  p.plink = function(x, y, r) {
    this.color = p.color("#f4c67f");
    var options = {
      restitution: 0.8,
      friction: 0,
      density: 1
    };
    //x += p.random(-5, 5);
    this.body = p.Bodies.circle(x, y, r, options);
    this.body.label = "plink";
    this.r = r;
    p.World.add(p.world, this.body);

    this.show = function() {
      p.fill(this.color);
      p.noStroke();
      p.push();
      p.translate(this.body.position.x, this.body.position.y);
      p.ellipse(0, 0, this.r * 2);
      p.pop();
    }
  }

  p.peg = function(x, y, r) {
    var options = {
      restitution: 1,
      friction: 0,
      isStatic: true
    };
    this.body = p.Bodies.circle(x, y, r, options);
    this.body.label = "peg";
    this.r = r;
    p.World.add(p.world, this.body);

    this.show = function() {
      p.noStroke();
      p.fill(0);
      p.push();
      p.translate(this.body.position.x, this.body.position.y);
      p.ellipse(0, 0, this.r * 2);
      p.pop();
    }
  }

  p.boundary = function(x, y, w, h, a, l) {
    var options = {
      restitution: 1,
      isStatic: true
    };
    this.body = p.Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    this.body.label = l;
    p.World.add(p.world, this.body);

    this.show = function() {
      if (a) {
        p.fill(0);
        p.stroke(0);
      } else {
        p.fill(0,0,0,0);
        p.stroke(0,0,0,0);
      }
      p.push();
      p.translate(this.body.position.x, this.body.position.y);
      p.rectMode(p.CENTER);
      p.rect(0, 0, this.w, this.h);
      p.pop();
    }
  }

  p.drawText = function() {
    p.push();
    p.textFont(p.peachFont);
    p.textSize(p.width*0.2);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.text("What's your school clique?", p.mdu, p.mdu, p.width);
    p.pop();
  }

  p.drawOptions = function() {
    for (let i = 0; i < p.cols; i++) {

      // sideways coordinates
      /*var y = (i * p.optionSpacing + (p.optionSpacing / 2)) - p.width/2;
      var x = -p.height/2 + 2*p.mdu;*/

      // normal coordinates
      var x = i * p.optionSpacing + p.mdu;
      var y = p.height - p.mdu;
      p.optionsText(p.cliques[i], x, y);
    }
  }

  p.optionsText = function(text, x, y) {
    // sideways styling
    /*
    p.push();
    p.textSize(p.width*0.03);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textLeading(p.width*0.03);
    p.translate(p.width/2, p.height/2);
    p.rotate(-p.HALF_PI);
    p.text(text, x, y, 20*p.mdu);
    p.pop();*/

    // normal styling
    p.push();
    p.textSize(p.width*0.025);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textLeading(p.width*0.025);
    p.text(text, x, y, p.mdu * 12);
    p.pop();
  }

  p.checkFinished = function() { 
    if (p.Body.getSpeed(p.plinker.body) < 0.01 && p.Collision.collides(p.bounds[0].body, p.plinker.body) != null) {
      p.plinking = false;
    }
  }

  p.finalChoice = function() {
    var xPos = p.plinker.body.position.x;
    var restingPlace = 0;

    for (let i = 1; i < p.cliques.length; i++) {
      if (xPos < (i+1) * p.optionSpacing && xPos > i * p.optionSpacing) {
        restingPlace = i;
      }
    }

    p.finalChoice = p.cliques[restingPlace];

    p.background("#f4c67f");
    p.push();
    p.textFont(p.peachFont);
    p.textSize(p.width*0.15);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.text(p.finalChoice, p.mdu, p.height/2, p.width-(2*p.mdu));
    p.pop();

    p.noLoop();
    setTimeout(p.endPlinko, 2000); 
  }

  p.mousePressed = function() {
    if (p.plinker == null && (p.mouseX > (4.9*p.mdu) && p.mouseX < p.width - (4.9*p.mdu))) {
      p.active = true;
      p.plinker = new p.plink(p.mouseX, 0, 2.45*p.mdu);
    }
    return false;
  }

  p.endPlinko = function() {
    finishPlinko(p.finalChoice);
  }

  p.draw = function() {

    p.background(p.color("#fbe9e4"));
    p.Engine.update(p.engine, 1000 / 30);

    if (p.plinking) {
      for (let i = 0; i < p.bounds.length; i++) {
        p.bounds[i].show();
      }
  
      for (let i = 0; i < p.pegs.length; i++) {
        p.pegs[i].show();
      }

      p.drawText();
  
      if (p.active) {
        p.plinker.show();
        p.checkFinished();
      }

      p.drawOptions();

    } else {
      p.finalChoice();
    }
    
  }

}