// Convert a circle into a square
// by approximating a circle with 4 circular arcs
// whose radii lengthen to infinity
// Golan Levin, August 2016


var radius;
var squarePoints = [];
var nSquarePoints = 4;
var bDrawDebug = false;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;

  for (var i = 0; i < nSquarePoints; i++) { // square vertices
    var x = radius * cos(i * TWO_PI / nSquarePoints - HALF_PI);
    var y = radius * sin(i * TWO_PI / nSquarePoints - HALF_PI);
    squarePoints[i] = {
      x, y
    };
  }
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  push();
  translate(width / 2, height / 2);
  rotate(PI * 0.25);

  var wiggle = max(0.00001, (0.5 * (1.0 + sin(millis() / 2000.0))));
  var amount = 1.0 / wiggle - 1.0;

  for (var i = 0; i < nSquarePoints; i++) {
    var p0x = squarePoints[i].x;
    var p0y = squarePoints[i].y;
    var p1x = squarePoints[(i + 1) % nSquarePoints].x;
    var p1y = squarePoints[(i + 1) % nSquarePoints].y;
    var pcx = 0 - amount * ((p0x + p1x) / 2);
    var pcy = 0 - amount * ((p0y + p1y) / 2);

    if (bDrawDebug) {
      stroke(255, 0, 0, 64);
      strokeWeight(1);
      line(pcx, pcy, p0x, p0y);
      line(pcx, pcy, p1x, p1y);
    }

    var dx = p0x - pcx;
    var dy = p0y - pcy;
    var dh = sqrt(dx * dx + dy * dy);
    var angle0 = atan2(p0y - pcy, p0x - pcx);
    var angle1 = atan2(p1y - pcy, p1x - pcx);

    stroke(0);
    strokeWeight(3);
    arc(pcx, pcy, dh * 2, dh * 2, angle0, angle1, OPEN);
  }

  pop();
}