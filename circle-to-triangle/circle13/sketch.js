// Convert a circle into a triangle
// By progressively subdividing it into 
// a 3-gon, 6-gon, 12-gon, 24-gon, etc., 
// with smooth interpolations.
// Golan Levin, January 2017

var radius;
var trianglePoints = [];
var nCirclePoints = 3;
var period = 2500;
var nPows = 5;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;
}

//-----------------------------------------
function draw() {
  background(255);
  push();
  translate(width / 2, height / 2);

  var t = int(millis() / period); // 0,1,2,3,4,5,6,7...
  var tupow = 3 * floor(pow(2, 0 + (t % nPows))); // 3,6,12,24,48...
  var utpow = 3 * floor(pow(2, 0 + (nPows - (t % nPows) - 1))); // 48,24,12,6,3...
  print(tupow + " " + utpow);
  var direction = (int(millis() / (period * nPows))) % 2; // 0,1,0,1...
  var bitupow = (direction === 0) ? tupow : utpow; // 

  var frac = (millis() % period) / float(period);
  var tfrac = (direction === 0) ? frac : (1.0 - frac);
  tfrac = pow(tfrac, 3.0);

  noFill();
  stroke(0);
  strokeWeight(3);
  strokeJoin(MITER);

  beginShape();
  nCirclePoints = 2 * bitupow; 
  for (var i = 0; i <= (nCirclePoints + 1); i++) { // for good shape closure
    if (i % 2 === 0) {
      // the corner vertices
      var theta = map(i, 0, nCirclePoints, 0, TWO_PI)  - HALF_PI;
      var px = radius * cos(theta);
      var py = radius * sin(theta);
      vertex(px, py);

    } else {
      // the halfway vertices
      var thetaA = map(i - 1, 0, nCirclePoints, 0, TWO_PI) - HALF_PI;
      var thetaB = map(i + 0, 0, nCirclePoints, 0, TWO_PI) - HALF_PI;
      var thetaC = map(i + 1, 0, nCirclePoints, 0, TWO_PI) - HALF_PI;

      var pxA = radius * cos(thetaA);
      var pyA = radius * sin(thetaA);
      var pxB = radius * cos(thetaB);
      var pyB = radius * sin(thetaB);
      var pxC = radius * cos(thetaC);
      var pyC = radius * sin(thetaC);

      var pxAC = (pxA + pxC) / 2; // points halfway between flanking vertices
      var pyAC = (pyA + pyC) / 2;

      var px = map(tfrac, 0, 1, pxAC, pxB);
      var py = map(tfrac, 0, 1, pyAC, pyB);
      vertex(px, py);
    }
  }
  endShape(CLOSE);

  pop();
}