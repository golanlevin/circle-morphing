var cx, cy;
var radius;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(3);

  var maxSides = 60;
  var minSides = 3;
  var t = 0.5 + 0.5 * sin(millis() / 2000.0);
  t = pow(t, 0.33333);
  var nSidesf = constrain(map(t, 0, 1, maxSides, (minSides - 0.25)), minSides, maxSides);
  var nSidesi = ceil(nSidesf);
  var dang = TWO_PI / nSidesf;
  var ang = HALF_PI + (TWO_PI - (((nSidesi - 1) * dang))) / 2.0;
  if (nSidesi % 2 === 0) {
    ang -= dang / 2.0;
  }

  beginShape();
  for (var i = 0; i < nSidesi; i++) {
    var px = cx + radius * cos(ang);
    var py = cy + radius * sin(ang);
    vertex(px, py);
    ang += dang;
  }
  endShape(CLOSE);
}