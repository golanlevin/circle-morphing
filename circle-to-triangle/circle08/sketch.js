var radius;
var cx, cy;
var third;
var bShowDebug;
var nArcPoints = 30;
var angularAmount;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;
  third = TWO_PI / 3.0;
  bShowDebug = false;
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(3);
  strokeJoin(ROUND);

  angularAmount = pow(0.5 + 0.5 * sin(millis() / 2000.0), 2.0);

  beginShape();
  for (var j = 0; j < 3; j++) {
    for (var i = 0; i <= nArcPoints; i++) {
      var angCenter = (j + 0.5) * third;
      var angA = angCenter - angularAmount * 0.5 * third;
      var angB = angCenter + angularAmount * 0.5 * third;
      var t = map(i, 0, nArcPoints, angA, angB) + HALF_PI;
      var px = cx + radius * cos(t);
      var py = cy + radius * sin(t);
      vertex(px, py);
    }
  }
  endShape(CLOSE);

  drawDebug();
}

//-----------------------------------------
function keyPressed(){
  bShowDebug = !bShowDebug;
}

//-----------------------------------------
function drawDebug() {
  if (bShowDebug) {
    stroke(255, 0, 0, 64);
    strokeWeight(1);
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i <= nArcPoints; i++) {
        var angCenter = (j + 0.5) * third;
        var angA = angCenter - angularAmount * 0.5 * third;
        var angB = angCenter + angularAmount * 0.5 * third;
        var t = map(i, 0, nArcPoints, angA, angB) + HALF_PI;
        var px = cx + radius * cos(t);
        var py = cy + radius * sin(t);
        line(cx, cy, px, py);
      }
    }
  }
}