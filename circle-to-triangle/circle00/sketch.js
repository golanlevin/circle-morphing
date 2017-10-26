// Convert a circle into a triangle, 
// by sampling a circle into many segments, 
// and then locally averaging each point with its neighbors, 
// except for the three special corner vertices.
// Golan Levin, January 2017

var radius;
var cx, cy;
var nCirclePoints = 120;
var circlePoints = [];

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;

  for (var i = 0; i < nCirclePoints; i++) {
    var t = map(i, 0, nCirclePoints, 0, TWO_PI) - HALF_PI;
    var x = cx + radius * cos(t);
    var y = cy + radius * sin(t);
    circlePoints[i] = {
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

  beginShape();
  for (var i = 0; i < nCirclePoints; i++) {
    if (i % (nCirclePoints / 3) !== 0) {
      var h = (i - 1 + nCirclePoints) % nCirclePoints;
      var j = (i + 1 + nCirclePoints) % nCirclePoints;
      circlePoints[i].x = (circlePoints[h].x + circlePoints[i].x + circlePoints[j].x) / 3.0;
      circlePoints[i].y = (circlePoints[h].y + circlePoints[i].y + circlePoints[j].y) / 3.0;
    }
    vertex(circlePoints[i].x, circlePoints[i].y);
  }
  endShape(CLOSE);
}

