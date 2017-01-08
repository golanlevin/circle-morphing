// Transform a circle into a square
// by approximating a circle with 4 Bézier cubic splines
// and modulating the spline control points. For magic numbers, 
// see: http://www.tinaja.com/glib/ellipse4.pdf
// Golan Levin, January 2017

var bDrawDebug = false;
var radius;
var magicNumber = 0.551784; 
var squarePoints = [];
var nSquarePoints = 4;

function setup() {
  createCanvas(400, 400);
  radius = (width / 2) * 0.75;

  for (var i = 0; i < nSquarePoints; i++) { // square vertices
    var x = radius * cos(i * TWO_PI / nSquarePoints - HALF_PI);
    var y = radius * sin(i * TWO_PI / nSquarePoints - HALF_PI);
    squarePoints[i] = { x, y };
  }
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  strokeJoin(ROUND);

  push(); 
  translate(width / 2, height/2);
  rotate(PI * 0.25);

  var backAndForth = -0.5 * (1 + sin(millis() / 2000.0));
  var amount = magicNumber * backAndForth;
  for (var i = 0; i < nSquarePoints; i++) {
    var p0x = squarePoints[i].x;
    var p0y = squarePoints[i].y;
    var p3x = squarePoints[(i + 1) % nSquarePoints].x;
    var p3y = squarePoints[(i + 1) % nSquarePoints].y;
    var p1x = p0x + (amount * p0y);
    var p1y = p0y - (amount * p0x);
    var p2x = p3x - (amount * p3y);
    var p2y = p3y + (amount * p3x);

    if (bDrawDebug) {
      stroke(255, 0, 0, 64);
      strokeWeight(1);
      line(p0x, p0y, p1x, p1y);
      line(p3x, p3y, p2x, p2y);
    }

    stroke(0);
    strokeWeight(3);
    bezier(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
  }

  if (bDrawDebug) {
    stroke(255, 0, 0, 64);
    strokeWeight(1);
    ellipse(0,0, radius * 2, radius * 2);
  }
  
  pop();
}

function keyPressed(){
  bDrawDebug = !bDrawDebug; 
}