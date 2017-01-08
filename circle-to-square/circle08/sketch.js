// Transform a circle into a square
// by gradually flattening the circle on four sides.
// Golan Levin, January 2017

var radius;
var cx, cy;
var quarter;
var nSquarePoints = 4;
var nArcPoints = 30;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;
  quarter = TWO_PI / nSquarePoints;
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(3);
  strokeJoin(ROUND);

  var amount = pow(0.5 + 0.5 * sin(millis() / 2000.0), 2.0);

  beginShape();
  for (var j = 0; j < nSquarePoints; j++) {
    for (var i = 0; i <= nArcPoints; i++) {
      var angCenter = (j + 0.5) * quarter;
      var angA = angCenter - amount * 0.5 * quarter;
      var angB = angCenter + amount * 0.5 * quarter;
      var t = map(i, 0, nArcPoints, angA, angB) + HALF_PI;
      var px = cx + radius * cos(t);
      var py = cy + radius * sin(t);
      vertex(px, py);
    }
  }
  endShape(CLOSE);
}