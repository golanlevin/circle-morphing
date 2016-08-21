// Convert a circle into a square
// by using a 'superellipse' formula
// See: http://mathworld.wolfram.com/Superellipse.html
// Golan Levin, August 2016

var nPoints = 90;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  noFill();
  push(); 
  translate(width/2, height/2);
  rotate(PI*0.25); 
  
  var radius = width / 2 * 0.75;
  var frac = map(sin(millis() / 2000.0), -1,1, 1,2); 
  stroke(0);
  strokeWeight(3);
  strokeJoin(ROUND);
  beginShape(); 
  for (var i = 0; i <= nPoints; i++) {
    var t = map(i, 0, nPoints, 0, HALF_PI);
    var px = radius * pow(cos(t), frac);
    var py = radius * pow(sin(t), frac);
    vertex(px, py); 
  }
  for (var i = 0; i <= nPoints; i++) {
    var t = map(i, 0, nPoints, 0, HALF_PI);
    var px = radius * pow(cos(t), frac);
    var py = 0 - radius * pow(sin(t), frac);
    vertex(py, px); 
  }
  for (var i = 0; i <= nPoints; i++) {
    var t = map(i, 0, nPoints, 0, HALF_PI);
    var px = 0 - radius * pow(cos(t), frac);
    var py = 0 - radius * pow(sin(t), frac);
    vertex(px, py); 
  }
  for (var i = 0; i <= nPoints; i++) {
    var t = map(i, 0, nPoints, 0, HALF_PI);
    var px = 0 - radius * pow(cos(t), frac);
    var py = radius * pow(sin(t), frac);
    vertex(py, px); 
  }
  endShape(CLOSE); 
  pop();
}