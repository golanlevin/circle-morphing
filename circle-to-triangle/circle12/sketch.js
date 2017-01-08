// Convert a circle into a triangle, by:
// Always drawing six circular arcs: 
// three for the corners, and three for the sides.
// Golan Levin, January 2017

var radius;
var cx, cy;
var trianglePoints = [];
var bDrawDebug  = true; 

//-----------------------------------------
function setup() {
  createCanvas(400, 400);

  radius = width / 2 * 0.75;
  cx = width / 2;
  cy = height / 2;

  for (var i = 0; i < 3; i++) { // triangle vertices
    var x = cx + radius * cos(i * TWO_PI / 3.0 - HALF_PI);
    var y = cy + radius * sin(i * TWO_PI / 3.0 - HALF_PI);
    trianglePoints[i] = { x, y };
  }
}

//-----------------------------------------
function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(1);
  strokeJoin(ROUND);

  var wiggle = 0.5 + 0.5 * sin(millis() / 2000.0);
  var rad = (1.0 - wiggle)*radius; 
  
  for (var i = 0; i < 3; i++) {
  
    var tx1 = trianglePoints[((i+0)%3)].x;
    var ty1 = trianglePoints[((i+0)%3)].y;
    var tx2 = trianglePoints[((i+1)%3)].x;
    var ty2 = trianglePoints[((i+1)%3)].y;
    
    var px1 = lerp(cx, tx1, wiggle); 
    var py1 = lerp(cy, ty1, wiggle); 
    var px2 = lerp(cx, tx2, wiggle); 
    var py2 = lerp(cy, ty2, wiggle); 
    
    //var mina = map(mouseX, 0,width, 1,59); 
    var cornerArcAng = map(wiggle, 0, 1, 30.0, 59.999); 
    var sa1 = ((i+0)%3) * TWO_PI / 3.0 - HALF_PI - radians(cornerArcAng);
    var ea1 = ((i+0)%3) * TWO_PI / 3.0 - HALF_PI + radians(cornerArcAng);
    var sa2 = ((i+1)%3) * TWO_PI / 3.0 - HALF_PI - radians(cornerArcAng);
    var ea2 = ((i+1)%3) * TWO_PI / 3.0 - HALF_PI + radians(cornerArcAng);
    
    var x1 = px1 + rad * cos(ea1); 
    var y1 = py1 + rad * sin(ea1); 
    var x2 = x1 - 0.5*rad * sin(ea1); 
    var y2 = y1 + 0.5*rad * cos(ea1); 
    
    var x3 = px2 + rad * cos(sa2); 
    var y3 = py2 + rad * sin(sa2); 
    var x4 = x3 + 0.5*rad * sin(sa2); 
    var y4 = y3 - 0.5*rad * cos(sa2); 
    
    if (bDrawDebug){
      strokeWeight(1); 
      stroke(255,0,0, 128*wiggle); 
      ellipse (px1,py1, rad*2, rad*2);
    }
    
    // construct perpendiculars
    var bigR = 10000000; 
    var ppx = x1 - bigR*(y2-y1); 
    var ppy = y1 + bigR*(x2-x1); 
    var pqx = x3 - bigR*(y3-y4); 
    var pqy = y3 + bigR*(x3-x4); 
    
    if (bDrawDebug){
      // line (x1,y1, x2,y2); 
      // line (x3,y3, x4,y4); 
      // line (cx,cy, x1,y1); 
      // line (cx,cy, x3,y3);
      // line (x1,y1, ppx,ppy); 
      // line (x3,y3, pqx,pqy);
    }
    
    // compute the intersection of (x1,y1, ppx,ppy) and (x3,y3, pqx,pqy)
    // Bourke: http://paulbourke.net/geometry/pointlineplane/
    var numer = (pqx - x3)*(y1 - y3)  - (pqy - y3)*(x1 - x3);
    var denom = (pqy - y3)*(ppx - x1) - (pqx - x3)*(ppy - y1); 
    if (denom > 0){
      var u = numer / denom; 
      var acx = x1 + u*(ppx - x1); 
      var acy = y1 + u*(ppy - y1); 
      var arcD = 2.0*dist(acx,acy, x1,y1); 
      var arcSa = atan2(y1-acy, x1-acx); 
      var arcEa = atan2(y3-acy, x3-acx); 
      
      if (bDrawDebug){
        strokeWeight(1); 
        stroke(255,0,0, 128*(1.0-wiggle)); 
        ellipse (acx,acy, arcD, arcD);
      }
      
      stroke(0); 
      strokeWeight(3); 
      arc (acx,acy, arcD, arcD, arcSa, arcEa);
    }
    
    stroke(0); 
    strokeWeight(3); 
    arc(px1,py1, rad*2, rad*2, sa1, ea1); 
  }
}

function keyPressed(){
  bDrawDebug = !bDrawDebug;
}
