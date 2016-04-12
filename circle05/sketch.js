var nPoints, third, offset;
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
  third = (nPoints / 3);
  offset = nPoints / 12;
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

  // compute srcPoints: points on the circle. Also reset curPercents.
  for (var j = 0; j < nPoints; j++) {
    durPercents[j] = curPercents[j] = 0.0;
    var t = map(j, 0, nPoints, 0, TWO_PI);
    var x = cx + radius * cos(t);
    var y = cy + radius * sin(t);
    srcPoints[j] = {
      x, y
    };
  }

  // compute dstPoints: points along the triangle
  for (var j = 0; j < nPoints; j++) {
    var i = (floor((j + nPoints - offset) / third) + 1) % 3;
    var p1x = trianglePoints[(i + 0) % 3].x;
    var p1y = trianglePoints[(i + 0) % 3].y;
    var p2x = trianglePoints[(i + 1) % 3].x;
    var p2y = trianglePoints[(i + 1) % 3].y;

    var jt = (j + nPoints - (offset - 0)) % third;
    var x = map(jt, 0, third, p1x, p2x);
    var y = map(jt, 0, third, p1y, p2y);
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

  for (var j = 0; j < nPoints; j++) { // move the curPercents inward, randomly
    curPercents[j] += 0.01 * (noise(j * 10 + millis() / 1000.0) - 0.15);
    curPercents[j] = constrain(curPercents[j], 0, 1);
    durPercents[j] = curPercents[j];
  }
  var A = 0.98;
  var B = (1.0 - A) / 2.0;
  var errorSum = 0;
  for (var j = 0; j < nPoints; j++) { // blur the boundary
    var i = ((j - 1) + nPoints) % nPoints;
    var k = (j + 1) % nPoints;
    curPercents[j] = B * durPercents[i] + A * durPercents[j] + B * durPercents[k];
    errorSum += 1.0 - curPercents[j];
  }

  if (errorSum < 0.0001) { // reset if it's close to being a triangle. 
    noiseSeed(millis());
    for (var j = 0; j < nPoints; j++) {
      curPercents[j] = 0.0;
    }
  }

  for (var i = 0; i < 3; i++) {
    var begin = (i * third);
    var end = ((i + 1) * third) - 1;
    var px, py;
    beginShape(); {
      px = trianglePoints[(i + 1) % 3].x;
      py = trianglePoints[(i + 1) % 3].y;
      vertex(px, py);
      vertex(px, py);
      for (var j = begin; j < end; j++) {
        var k = ((j + offset) + nPoints) % nPoints;
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