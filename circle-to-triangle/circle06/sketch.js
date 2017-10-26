var radius;
var cx, cy;
var trianglePoints = [];
var currentRadii01;
var bShowDebug = false;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);

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
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(3);
  strokeJoin(ROUND);

  currentRadii01 = 0.5 + 0.5 * sin(millis() / 2000.0);
  var rad = currentRadii01 * radius;

  beginShape();
  for (var i = 0; i < 3; i++) {
    var px = map(currentRadii01, 0, 1, trianglePoints[i].x, cx);
    var py = map(currentRadii01, 0, 1, trianglePoints[i].y, cy);

    var ang1 = (i + 1) * TWO_PI / 3.0 + HALF_PI;
    var ang2 = (i + 2) * TWO_PI / 3.0 + HALF_PI;
    var dang = (ang2 - ang1) / 60.0;
    for (var t = ang1; t <= ang2; t += dang) {
      var ax = px + rad * cos(t);
      var ay = py + rad * sin(t);
      vertex(ax, ay);
    }
  }
  endShape(CLOSE);

  drawDebug();
}

//-----------------------------------------
function keyPressed() {
  bShowDebug = !bShowDebug;
}

//-----------------------------------------
function drawDebug() {
  if (bShowDebug) {
    strokeWeight(1);
    stroke(255, 0, 0, 64);
    for (var i = 0; i < 3; i++) {
      var px = map(currentRadii01, 0, 1, trianglePoints[i].x, cx);
      var py = map(currentRadii01, 0, 1, trianglePoints[i].y, cy);
      var ang1 = (i + 1) * TWO_PI / 3.0 + HALF_PI;
      var ang2 = (i + 2) * TWO_PI / 3.0 + HALF_PI;
      var dang = (ang2 - ang1) / 60.0;
      for (var t = ang1; t <= ang2; t += dang) {
        var ax = px + currentRadii01 * radius * cos(t);
        var ay = py + currentRadii01 * radius * sin(t);
        line(px, py, ax, ay);
      }
    }
  }
}