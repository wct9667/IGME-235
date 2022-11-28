

// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a,b){
  var ab = a.getBounds();
  var bb = b.getBounds();
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function CircleIntersect(x1,y1,rad1,x2,y2,rad2){
  var a;
  var x;
  var y;

  a = rad1 + rad2;
  x = x1 - x2;
  y = y1 - y2 ;

  if(x > 0){
    return false;
  }
  return(a*a > ((x*x) + (y*y)));
}

//random
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}


