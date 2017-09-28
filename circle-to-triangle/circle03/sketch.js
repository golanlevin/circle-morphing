// Transform a circle to a triangle
// by approximating a circle with three circular arcs 
// whose radii lengthen to infinity

var radius;
var cx, cy;
var trianglePoints = [];
var bShowDebug = true;

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

  var wiggle = max(0.00001, (0.5 * (1.0 + sin(millis() / 2000.0))));
  var amount = 1.0 / wiggle - 1.0;

  for (var i = 0; i < 3; i++) {
    var p0x = trianglePoints[i].x;
    var p0y = trianglePoints[i].y;
    var p1x = trianglePoints[(i + 1) % 3].x;
    var p1y = trianglePoints[(i + 1) % 3].y;
    var pcx = cx - amount * ((p0x + p1x) / 2 - cx);
    var pcy = cy - amount * ((p0y + p1y) / 2 - cy);

    if (bShowDebug) {
      // draw control points
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
}

function keyPressed(){
  bShowDebug = !bShowDebug;
}