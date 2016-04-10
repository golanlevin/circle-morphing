var nPoints;
var radius;
var cx, cy;
var trianglePoints = []; // the 3 vertices of the triangle
var srcPoints = []; // points along the circle
var dstPoints = []; // points along the triangle
var curPercents = []; // percentages of interpolation
var durPercents = [];

//-----------------------------------------
function setup() {
  createCanvas(400, 400);

  nPoints = 60;
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

  resetCurPercents();

  // compute srcPoints: points on the circle
  for (var j = 0; j < nPoints; j++) {
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var srcx = cx + radius * cos(t);
    var srcy = cy + radius * sin(t);
    var x = srcx;
    var y = srcy;
    srcPoints[j] = {
      x, y
    };
  }

  // compute dstPoints: points along the triangle
  for (var j = 0; j < nPoints; j++) {
    var i = (floor((j + nPoints - 6) / (nPoints / 3)) + 1) % 3;
    var p1x = trianglePoints[i].x;
    var p1y = trianglePoints[i].y;
    var p2x = trianglePoints[(i + 1) % 3].x;
    var p2y = trianglePoints[(i + 1) % 3].y;

    var p3x = cx;
    var p3y = cy;
    var p4x = srcPoints[j].x;
    var p4y = srcPoints[j].y;

    // http://paulbourke.net/geometry/pointlineplane/ 
    var numea = (p4x - p3x) * (p1y - p3y) - (p4y - p3y) * (p1x - p3x);
    var numeb = (p2x - p1x) * (p1y - p3y) - (p2y - p1y) * (p1x - p3x);
    var denom = (p4y - p3y) * (p2x - p1x) - (p4x - p3x) * (p2y - p1y);
    var ua = numea / denom;
    var ub = numeb / denom;
    var u = 1.0;
    if ((ua >= 0) && (ua <= 1)) {
      u = ua;
    } else if ((ub >= 0) && (ub <= 1)) {
      u = ub;
    }
    var dstx = p1x + u * (p2x - p1x);
    var dsty = p1y + u * (p2y - p1y);

    var x = dstx;
    var y = dsty;
    dstPoints[j] = {
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

  for (var j = 0; j < nPoints; j++) {
    curPercents[j] += 0.01 * (noise(j * 10 + millis() / 1000.0) - 0.2);
    curPercents[j] = constrain(curPercents[j], 0, 1);
    durPercents[j] = curPercents[j];
  }
  var A = 0.98;
  var B = (1.0 - A) / 2.0;
  var errorSum = 0;
  for (var j = 0; j < nPoints; j++) {
    var i = ((j - 1) + nPoints) % nPoints;
    var k = (j + 1) % nPoints;
    curPercents[j] = B * durPercents[i] + A * durPercents[j] + B * durPercents[k];
    errorSum += 1.0 - curPercents[j];
  }


  if (errorSum < 0.1) {
    beginShape();
    for (var i = 0; i < 3; i++) {
      px = trianglePoints[i].x;
      py = trianglePoints[i].y;
      vertex(px, py);
    }
    endShape(CLOSE); 
    
  } else {
    for (var i = 0; i < 3; i++) {
      var third = (nPoints / 3);
      var begin = (i * third);
      var end = ((i + 1) * third) - 1;
      var px, py;

      stroke(0);
      beginShape(); {
        px = trianglePoints[(i + 1) % 3].x;
        py = trianglePoints[(i + 1) % 3].y;
        vertex(px, py);
        vertex(px, py);
        for (var j = begin; j < end; j++) {
          var k = ((j + 6) + nPoints) % nPoints;
          px = map(curPercents[k], 0, 1, srcPoints[k].x, dstPoints[k].x);
          py = map(curPercents[k], 0, 1, srcPoints[k].y, dstPoints[k].y);
          curveVertex(px, py);
        }
        px = trianglePoints[(i + 2) % 3].x;
        py = trianglePoints[(i + 2) % 3].y;
        vertex(px, py);
        vertex(px, py);
      }
      endShape();
    }
  }


}

//-----------------------------------------
function resetCurPercents() {
  for (var j = 0; j < nPoints; j++) {
    curPercents[j] = 0.0;
    durPercents[j] = 0.0;
  }
}

function keyPressed() {
  noiseSeed(millis());
  resetCurPercents();
}