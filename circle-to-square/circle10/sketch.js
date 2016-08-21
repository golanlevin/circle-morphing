// Convert a circle into a square
// by treating points along the perimeter as a series of springy particles
// Golan Levin, August 2016

var nPoints, quarter, offset;
var radius;
var nSquarePoints = 4;
var squarePoints = []; // the vertices of the square
var srcPoints = []; // points along the circle
var dstPoints = []; // points along the triangle
var targetPts = [];
var particles = [];
var target = 1;
var DAMPING = 0.97;
var MASS = 10;
var NEIGHBOR = 0.5;
var SWITCHTHRESH = 15;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);

  nPoints = 60;
  quarter = (nPoints / nSquarePoints);
  offset = 0;
  radius = width / 2 * 0.75;

  for (var i = 0; i < nSquarePoints; i++) { // triangle vertices
    var x = radius * cos(i * TWO_PI / nSquarePoints - HALF_PI);
    var y = radius * sin(i * TWO_PI / nSquarePoints - HALF_PI);
    squarePoints[i] = {
      x, y
    };
  }

  // compute srcPoints: points on the circle. 
  for (var j = 0; j < nPoints; j++) {
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var x = radius * cos(t);
    var y = radius * sin(t);
    srcPoints[j] = {
      x, y
    };
  }

  // compute dstPoints: points along the square
  for (var j = 0; j < nPoints; j++) {
    var i = (floor((j + nPoints - offset) / quarter) + 1) % nSquarePoints;
    var p1x = squarePoints[(i + 0) % nSquarePoints].x;
    var p1y = squarePoints[(i + 0) % nSquarePoints].y;
    var p2x = squarePoints[(i + 1) % nSquarePoints].x;
    var p2y = squarePoints[(i + 1) % nSquarePoints].y;

    var jt = (j + nPoints - (offset - 0)) % quarter;
    var x = map(jt, 0, quarter, p1x, p2x);
    var y = map(jt, 0, quarter, p1y, p2y);
    dstPoints[j] = {
      x, y
    };
    targetPts[j] = {
      x, y
    }
  }

  for (var j = 0; j < nPoints; j++) {
    var px = srcPoints[j].x;
    var py = srcPoints[j].y;
    particles[j] = new Particle(px, py, 0, 0);
  }
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  push(); 
  translate(width/2, height/2); 
  rotate(PI * 0.25); 
  
  stroke(0);
  strokeWeight(3);
  strokeJoin(ROUND);

  var error = 0;
  for (var j = 0; j < nPoints; j++) {
    var px = particles[j].px;
    var py = particles[j].py;
    var tx = targetPts[j].x;
    var ty = targetPts[j].y;
    var dx = tx - px;
    var dy = ty - py;
    var dh = sqrt(dx * dx + dy * dy);
    error += dh;
    if (dh > 0) {
      var fx = dx / dh;
      var fy = dy / dh;
      particles[j].applyForce(fx, fy);
    }
  }
  print(error); 
  if (error < SWITCHTHRESH) {
    flipTarget();
  }

  for (var j = 0; j < nPoints; j++) {
    var ix = particles[(j - 1 + nPoints) % nPoints].px;
    var iy = particles[(j - 1 + nPoints) % nPoints].py;
    var jx = particles[(j + 0 + nPoints) % nPoints].px;
    var jy = particles[(j + 0 + nPoints) % nPoints].py;
    var kx = particles[(j + 1 + nPoints) % nPoints].px;
    var ky = particles[(j + 1 + nPoints) % nPoints].py;
    var ijdx = ix - jx;
    var ijdy = iy - jy;
    var ijdh = sqrt(ijdx * ijdx + ijdy * ijdy);
    if (ijdh > 0) {
      var ifx = ijdx / ijdh * NEIGHBOR;
      var ify = ijdy / ijdh * NEIGHBOR;
      particles[j].applyForce(ifx, ify);
    }
    var kjdx = kx - jx;
    var kjdy = ky - jy;
    var kjdh = sqrt(kjdx * kjdx + kjdy * kjdy);
    if (kjdh > 0) {
      var kfx = kjdx / kjdh * NEIGHBOR;
      var kfy = kjdy / kjdh * NEIGHBOR;
      particles[j].applyForce(kfx, kfy);
    }
  }

  for (var j = 0; j < nPoints; j++) {
    particles[j].update();
  }

  var ofs = 2;
  beginShape(); // render particles
  var px = particles[(0 + ofs) % nPoints].px;
  var py = particles[(0 + ofs) % nPoints].py;
  curveVertex(px, py);
  for (var j = 0; j < nPoints; j++) {
    px = particles[(j + ofs) % nPoints].px;
    py = particles[(j + ofs) % nPoints].py;
    curveVertex(px, py);
  }
  endShape(CLOSE);
}

//-----------------------------------------
function flipTarget() {
  for (var j = 0; j < nPoints; j++) {
    x = (target === 1) ? dstPoints[j].x : srcPoints[j].x;
    y = (target === 1) ? dstPoints[j].y : srcPoints[j].y;
    targetPts[j] = {
      x, y
    }
  }
  target = 1 - target;
}

//-----------------------------------------
function Particle(px, py, vx, vy) {
  this.px = px;
  this.py = py;
  this.vx = vx;
  this.vy = vy;

  this.applyForce = function(fx, fy) {
    this.vx += fx / MASS;
    this.vy += fy / MASS;
  }
  this.update = function() {
    this.vx *= DAMPING;
    this.vy *= DAMPING;
    this.px += this.vx;
    this.py += this.vy;
  }
}