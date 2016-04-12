var radius;
var cx, cy;
var trianglePoints = []; // the 3 vertices of the triangle
var third; 

//-----------------------------------------
function setup() {
  createCanvas(400, 400);
  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;
  third = TWO_PI / 3.0;

  for (var i = 0; i < 3; i++) { // triangle vertices
    var x = cx + radius * cos(i * third - HALF_PI);
    var y = cy + radius * sin(i * third - HALF_PI);
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
  
  var amount = pow(0.5 + 0.5*sin(millis()/2000.0), 2.0);
  var nArcPoints = 30; 
  
  beginShape();
  for (var j = 0; j < 3; j++) {
    for (var i = 0; i <= nArcPoints; i++) {
      var angCenter = (j+0.5) * third;
      var angA = angCenter - amount * 0.5 * third;
      var angB = angCenter + amount * 0.5 * third;
      var t = map(i, 0, nArcPoints, angA, angB) + HALF_PI;
      var px = cx + radius * cos(t);
      var py = cy + radius * sin(t);
      vertex(px, py);
    }
  }
  endShape(CLOSE);
}