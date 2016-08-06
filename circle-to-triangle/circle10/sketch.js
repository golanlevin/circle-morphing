var nPoints, third, offset;
var radius;
var cx, cy;
var trianglePoints = []; // the 3 vertices of the triangle
var srcPoints = []; // points along the circle
var dstPoints = []; // points along the triangle
var targetPts = [];
var particles = [];
var target = 1;
var DAMPING = 0.975;
var MASS = 10;
var NEIGHBOR = 0.5;
var SWITCHTHRESH = 14;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);

  nPoints = 60;
  third = (nPoints / 3);
  offset = nPoints / 12;
  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;

  for (var i = 0; i < 3; i++) { // triangle vertices
    var x = cx + radius * cos(i * TWO_PI / 3.0 - HALF_PI);
    var y = cy + radius * sin(i * TWO_PI / 3.0 - HALF_PI);
    trianglePoints[i] = {
      x, y
    };
  }

  // compute srcPoints: points on the circle. 
  for (var j = 0; j < nPoints; j++) {
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var x = cx + radius * cos(t);
    var y = cy + radius * sin(t);
    srcPoints[j] = {
      x, y
    };
  }

  // compute dstPoints: points along the triangle
  for (var j = 0; j < nPoints; j++) {
    var i = (floor((j + nPoints - offset) / third) + 1) % 3;
    var p1x = trianglePoints[(i + 0) % 3].x;
    var p1y = trianglePoints[(i + 0) % 3].y;
    var p2x = trianglePoints[(i + 1) % 3].x;
    var p2y = trianglePoints[(i + 1) % 3].y;

    var jt = (j + nPoints - (offset - 0)) % third;
    var x = map(jt, 0, third, p1x, p2x);
    var y = map(jt, 0, third, p1y, p2y);
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