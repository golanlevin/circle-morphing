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
  strokeJoin(ROUND);
  noFill();
  stroke(0);
  strokeWeight(3);

  var amount = 0.745 + 0.255 * sin(millis() / 2000.0);
  var rad = amount * radius;
  var nPts = 30;

  // http://mathworld.wolfram.com/Circle-LineIntersection.html
  for (var i = 0; i < 3; i++) {
    var x1 = trianglePoints[(i + 0) % 3].x - cx;
    var y1 = trianglePoints[(i + 0) % 3].y - cy;
    var x2 = trianglePoints[(i + 1) % 3].x - cx;
    var y2 = trianglePoints[(i + 1) % 3].y - cy;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dr = sqrt(dx * dx + dy * dy);
    var D = (x1 * y2) - (x2 * y1);

    var discriminant = rad * rad * dr * dr - D * D;
    if (discriminant <= 0) {
      line(x1 + cx, y1 + cy, x2 + cx, y2 + cy);
    } else {
      var px = cx + (D * dy + ((dy < 0) ? -1 : 1) * dx * sqrt(discriminant)) / (dr * dr);
      var py = cy + (-D * dx + abs(dy) * sqrt(discriminant)) / (dr * dr);
      var qx = cx + (D * dy - ((dy < 0) ? -1 : 1) * dx * sqrt(discriminant)) / (dr * dr);
      var qy = cy + (-D * dx - abs(dy) * sqrt(discriminant)) / (dr * dr);
      var pAng = atan2(py - cy, px - cx);
      var qAng = atan2(qy - cy, qx - cx);

      if (i == 2) {
        var tmp = pAng;
        pAng = qAng;
        qAng = tmp;
        if (py > cy) {
          qAng -= TWO_PI;
        }
      }

      beginShape();
      vertex(x2 + cx, y2 + cy);
      for (var j = 0; j <= nPts; j++) {
        var t = map(j, 0, nPts, pAng, qAng);
        var tx = cx + rad * cos(t);
        var ty = cy + rad * sin(t);
        vertex(tx, ty);
      }
      vertex(x1 + cx, y1 + cy);
      endShape();
    }
  }
}