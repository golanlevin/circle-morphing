// Transform a circle into a square
// by approximating a circle with 4 circular arcs
// whose radii lengthen to infinity
// Golan Levin, January 2017

var radius;
var vertexPoints = [];
var nVertices = 4; // i.e. in a square
var bDrawDebug = false;

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;

  for (var i = 0; i < nVertices; i++) { // square vertices
    var x = radius * cos(i * TWO_PI / nVertices - HALF_PI);
    var y = radius * sin(i * TWO_PI / nVertices - HALF_PI);
    vertexPoints[i] = {x, y};
  }
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  push();
  translate(width / 2, height / 2);
  rotate(PI * 0.25);

  var backAndForth = max(0.00001, (0.5 * (1.0 + sin(millis() / 2000.0))));
  var amount = 1.0 / backAndForth - 1.0;

  for (var i = 0; i < nVertices; i++) {
    var p0x = vertexPoints[i].x;
    var p0y = vertexPoints[i].y;
    var p1x = vertexPoints[(i + 1) % nVertices].x;
    var p1y = vertexPoints[(i + 1) % nVertices].y;
    var pcx = 0 - amount * ((p0x + p1x) / 2);
    var pcy = 0 - amount * ((p0y + p1y) / 2);

    if (bDrawDebug) {
      if (i===0){
        stroke(255, 0, 0, 64);
        strokeWeight(1);
        line(pcx, pcy, p0x, p0y);
        line(pcx, pcy, p1x, p1y);
      }
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

function keyPressed(){
  bDrawDebug = !bDrawDebug; 
}