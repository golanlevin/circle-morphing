// Convert a circle into a square
// by gradually shrinking the circle's radius, 
// revealing square corners within.
// Golan Levin, August 2016

var radius;
var squarePoints = []; // the vertices of the square
var nSquarePoints = 4;
var quarter;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;
  quarter = TWO_PI / nSquarePoints;

  for (var i = 0; i < nSquarePoints; i++) { // triangle vertices
    var x = radius * cos(i * quarter - HALF_PI);
    var y = radius * sin(i * quarter - HALF_PI);
    squarePoints[i] = {
      x, y
    };
  }
}

//-----------------------------------------
function draw() {
  background(255);
  push();
  translate(width / 2, height / 2);
  rotate(PI * 0.25);

  strokeJoin(ROUND);
  noFill();
  stroke(0);
  strokeWeight(3);

  var minpct = sqrt(2.0) / 2.0;
  var amount = map(sin(millis() / 2000.0), -1, 1, minpct, 1.0);
  var rad = amount * radius;
  var nPts = 60;

  // http://mathworld.wolfram.com/Circle-LineIntersection.html
  for (var i = 0; i < nSquarePoints; i++) {
    var x1 = squarePoints[(i + 0) % nSquarePoints].x;
    var y1 = squarePoints[(i + 0) % nSquarePoints].y;
    var x2 = squarePoints[(i + 1) % nSquarePoints].x;
    var y2 = squarePoints[(i + 1) % nSquarePoints].y;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dr = sqrt(dx * dx + dy * dy);
    var D = (x1 * y2) - (x2 * y1);

    var discriminant = rad * rad * dr * dr - D * D;
    if (discriminant <= 0) {
      line(x1 + cx, y1 + cy, x2 + cx, y2 + cy);
    } else {
      var px = (D * dy + ((dy < 0) ? -1 : 1) * dx * sqrt(discriminant)) / (dr * dr);
      var py = (-D * dx + abs(dy) * sqrt(discriminant)) / (dr * dr);
      var qx = (D * dy - ((dy < 0) ? -1 : 1) * dx * sqrt(discriminant)) / (dr * dr);
      var qy = (-D * dx - abs(dy) * sqrt(discriminant)) / (dr * dr);
      var pAng = atan2(py, px);
      var qAng = atan2(qy, qx);

      if (i > 1) {
        var tmp = pAng;
        pAng = qAng;
        qAng = tmp;
      }

      beginShape();
      vertex(x2, y2);
      for (var j = 0; j <= nPts; j++) {
        var t = map(j, 0, nPts, pAng, qAng);
        var tx = rad * cos(t);
        var ty = rad * sin(t);
        vertex(tx, ty);
      }
      vertex(x1, y1);
      endShape();
    }
  }
  pop();
}