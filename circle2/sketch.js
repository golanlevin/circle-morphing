var radius;
var cx, cy;
var trianglePoints = [];

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

  var wiggle = 0.5 * (1 + sin(millis() / 2000.0));
  var amount = 0.77 * wiggle;
  for (var i = 0; i < 3; i++) {
    var p0x = trianglePoints[i].x; 
    var p0y = trianglePoints[i].y; 
    var p3x = trianglePoints[(i+2)%3].x; 
    var p3y = trianglePoints[(i+2)%3].y; 
    var p1x = p0x + (amount * (p0y - cy));
    var p1y = p0y - (amount * (p0x - cx));
    var p2x = p3x - (amount * (p3y - cy));
    var p2y = p3y + (amount * (p3x - cx));
    
    // draw control points
    //stroke(255, 0, 0, 64);
    //strokeWeight(1);
    //line (p0x,p0y, p1x,p1y); 
    //line (p3x,p3y, p2x,p2y); 
    
    stroke(0);
    strokeWeight(3);
    bezier(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
  }

  //stroke(255, 0, 0);
  //strokeWeight(1);
  //ellipse(width / 2, height / 2, radius * 2, radius * 2);
}