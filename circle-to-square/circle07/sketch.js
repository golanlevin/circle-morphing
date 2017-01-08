// Transform a circle into a square
// by treating it as a multisided polygon
// whose number of sides gradually decreases to 4.
// Golan Levin, January 2017
var radius;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  push(); 
  translate(width/2, height/2); 
  rotate(PI * -0.25); 

  var maxSides = 90;
  var minSides = 4;
  var t = 0.5 + 0.5 * sin(millis() / 2000.0);
  t = pow(t, 0.2); // shape the animation slightly
  var nSidesf = constrain(map(t, 0, 1, maxSides, (minSides - 0.25)), minSides, maxSides);
  var nSidesi = ceil(nSidesf);
  var dang = TWO_PI / nSidesf;
  var ang = HALF_PI + (TWO_PI - (((nSidesi - 1) * dang))) / 2.0;
  if (nSidesi % 2 === 0) {
    ang -= dang / 2.0;
  }

  stroke(0);
  strokeWeight(3);
  beginShape();
  for (var i = 0; i < nSidesi; i++) {
    var px = radius * cos(ang);
    var py = radius * sin(ang);
    vertex(px, py);
    ang += dang;
  }
  endShape(CLOSE);
  pop(); 
}