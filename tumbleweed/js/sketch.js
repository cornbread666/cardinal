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
    t.mainCanvas = t.createCanvas(t.pd, t.pd);
    t.mainCanvas.parent("tumbleweed_container");
    t.mainCanvas.id("tumbleweed_canvas");

    // Variations
    //PALETTE = ["#3A2923", "#684F44", "#7D5F60", "#A6624B", "#C59D7A", "#F1B87D", "#D17F76", "#6D918F", "#8C9687"];
    //PALETTE = ["#767A34", "#FBA570", "#490B32", "#F49579", "#F3AF9B", "#FEE581", "#FCCFC7", "#F3DDF0", "#C4CBE6"];
    //PALETTE = ["#A86F45", "#B0A24F", "#FAE8E2", "#D2664F", "#EFC39E", "#F7CA82", "#FDA684", "#D2664F", "#A1ACA7"];
    //PALETTE = ["#997B66", "#797D62", "#E4B074", "#D08C60", "#F8D488", "#E5C59E", "#F1DCA7", "#D9AE94", "#9B9B7A"];
    t.PALETTE = ["#264653", "#287271", "#8AB17D", "#E76F51", "#F4A261", "#EFB366", "#EE8959", "#2A9D8F", "#E9C46A"];
    t.BG_PALETTE = [t.PALETTE[0], t.PALETTE[1], t.PALETTE[2]]; // background element colors
    t.TW_PALETTE = [t.PALETTE[3], t.PALETTE[4], t.PALETTE[5]]; // tumbleweed colors
    t.FG_PALETTE = [t.PALETTE[6], t.PALETTE[7], t.PALETTE[8]]; // foreground element colors
    t.RADIUS = 0.8; // radius of tumbleweed: 0.6 - 0.8
    t.ANGVOL = t.PI * 0.08; // volatility of angle change: 0.04 - 0.08
    t.ROOTED = true; // if the tumbleweed's lines all originate from one position
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
    t.lineMaker(20000, 8, 0.05, 1);
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

  t.drawBlob = function(alpha) {
    t.x = random(t.width);
    t.y = random(t.height);
    t.push();
    t.translate(t.x, t.y);
    t.rotate(t.random(t.PI * 2));
    t.r = (t.startR = t.height * t.random(0.1, 0.3));
    t.vertices = [];

    for (var i = 0; i < t.PI * 2; i += 0.3) {
      t.x = cos(i) * t.r;
      t.y = sin(i) * t.r;
      t.vertices.push({x: t.x, y: t.y});
      t.r += random(-t.r / 10, t.r / 10);
      if (i > t.PI * 1.5) {
        t.r = t.r + (t.startR - t.r) / 3;
      } else if (i > t.PI * 1.75) {
        t.r = t.r + (t.startR - t.r) / 7;
      }
    }
    t.c = t.color(t.random(BG_PALETTE));
    t.c.setAlpha(alpha);
    t.fill(t.c);
    t.noStroke();
    t.drawingContext.filter = "blur(40px)";
    t.beginShape();
    t.curveVertex(t.vertices[t.vertices.length-1].x, t.vertices[t.vertices.length-1].y);
    t.vertices.forEach(v => t.curveVertex(v.x, v.y));
    t.curveVertex(t.vertices[0].x, t.vertices[0].y);
    t.curveVertex(t.vertices[1].x, t.vertices[1].y);
    t.endShape();
    t.drawingContext.filter = "none";
    t.pop();
  }

  t.blobMaker = function(numBlobs, alpha) {
    for (var i = 0; i < numBlobs; i++) {
      t.drawBlob(alpha);
    }
  }

  t.drawDot = function(size, alpha) {
    t.minDim = Math.min(t.height, t.width);
    t.dotCanvas.push();
    t.ranAng = t.random(t.PI * 2);
    t.dotRad = t.minDim / 2;
    t.ranRad = t.random(t.dotRad);
    t.dotX = t.ranRad * t.cos(t.ranAng);
    t.dotY = t.ranRad * t.sin(t.ranAng);
    t.dotCanvas.translate(t.width / 2, t.height / 2);
    t.dotCanvas.translate(t.dotX, t.dotY);
    t.dotCanvas.rotate(t.random(t.PI * 2));
    t.sizeInc = size;
    t.r = (t.startR = t.height * t.sizeInc * t.random(0.003, 0.011));
    t.vertices = [];

    for (k = 0; k < t.PI * 2; k += 0.3) {
      t.r += t.r * t.random(-0.25, 0.25);
      if (k > t.PI * 1.5) {
        t.r = t.r + (t.startR - t.r) / 3;
      } else if (k > t.PI * 1.75) {
        t.r = t.r + (t.startR - t.r) / 7;
      }
      t.x2 = t.cos(k) * t.r;
      t.y2 = t.sin(k) * t.r;
      t.vertices.push({x: t.x2, y: t.y2});
    }

    t.c = t.color(t.random(t.TW_PALETTE));
    t.c.setAlpha(alpha);
    t.dotCanvas.fill(t.c);
    t.dotCanvas.noStroke();
    t.dotCanvas.beginShape();
    t.dotCanvas.curveVertex(t.vertices[t.vertices.length-1].x, t.vertices[t.vertices.length-1].y);
    t.vertices.forEach(v => t.dotCanvas.curveVertex(v.x, v.y));
    t.dotCanvas.curveVertex(t.vertices[0].x, t.vertices[0].y);
    t.dotCanvas.curveVertex(t.vertices[1].x, t.vertices[1].y);
    t.dotCanvas.endShape();
    t.dotCanvas.pop();
  }

  t.dotMaker = function(numDots, size, alpha) {
    for (var i = 0; i < numDots; i++) {
      t.drawDot(size, alpha);
    }
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
      //edges();
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
  p.cols = 7;
  p.rows = 12;
  p.spacing;
  p.peachFont;
  p.startTime;
  p.mdu;
  p.plinking = true;

  p.preload = function () {
    p.peachFont = p.loadFont("css/assets/PeachDays.ttf");
  }

  p.setup = function() {

    p.startTime = p.millis();

    p.pw = p.windowWidth;
    p.ph = p.windowHeight;
    p.pd = Math.min(p.pw, p.ph);
    p.mainCanvas = p.createCanvas(p.pd * 0.6, p.pd * 0.8);
    p.mainCanvas.parent("plinko_container");
    p.mainCanvas.id("plinko_canvas");

    p.mdu = Math.min(p.height, p.width) / 100;

    for (let i = 0; i < p.cols; i++) {
      for (let j = 0; j < p.rows; j++) {
        var offset = (p.mdu * 8.15) * (j % 2);
        if (j % 2 === 1) {
          if (i < p.cols-1) {
            p.newPeg = new p.peg((p.mdu * 16.3 * i) + offset + p.mdu, (p.mdu * 9 * j) + (p.mdu * 10), p.mdu);
          }
        } else {
          p.newPeg = new p.peg((p.mdu * 16.3 * i) + offset + p.mdu, (p.mdu * 9 * j) + (p.mdu * 10), p.mdu);
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

    for (let i = 0; i < p.cols + 2; i++) {
      var x = i * p.spacing;
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
    x += p.random(-5, 5);
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
    var cliques = ["horse girls", "kids who brush their teeth after lunch",
                  "kids who paint their nails with whiteout", "theater kids", "kids who wear shorts in the winter",
                  "kids who've thrown up during a school play", "you and your friend sam"];
    for (let i = 0; i < p.cols; i++) {
      var y = (i * p.spacing + (p.spacing / 2)) - p.width/2;
      var x = -p.height/2 + 2*p.mdu;
      p.sidewaysText(cliques[i], x, y);
    }
  }

  p.sidewaysText = function(text, x, y) {
    p.push();
    p.textSize(p.width*0.03);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textLeading(p.width*0.03);
    p.translate(p.width/2, p.height/2);
    p.rotate(-p.HALF_PI);
    p.text(text, x, y, 20*p.mdu);
    p.pop();
  }

  p.checkFinished = function() { 
    console.log(p.Body.getSpeed(p.plinker.body));
    if (p.Body.getSpeed(p.plinker.body) < 0.005 && p.Collision.collides(p.bounds[0].body, p.plinker.body) != null) {
      p.plinking = false;
    }
  }

  p.draw = function() {

    p.background(p.color("#fbe9e4"));
    p.Engine.update(p.engine, 1000 / 30);

    if (p.plinking) {
      for (let i = 0; i < p.bounds.length; i++) {
        p.bounds[i].show();
      }
  
      p.drawText();
      p.drawOptions();
  
      for (let i = 0; i < p.pegs.length; i++) {
        p.pegs[i].show();
      }
  
      if (p.millis() - p.startTime >= 800) {
        if (p.plinker == null) {
          p.plinker = new p.plink(p.width/2, 0, 4*p.mdu);
        }
        p.plinker.show();
        p.checkFinished();
      }
    } else {
      console.log("done");
    }
    
  }

}