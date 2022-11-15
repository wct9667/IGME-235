//sources
//https://kayillustrations.itch.io/parallax-sunset-mountains/download/eyJpZCI6MTA3NDkwMiwiZXhwaXJlcyI6MTY2ODQ4OTg1OX0%3d.OCJYnPETBg8gmX8CpsJkK5241ho%3d


//method for checking collisions
//will account for the state
function CheckCollision(){}






// we use this to keep the ship on the screen
function clamp(val, min, max){
  return val < min ? min : (val > max ? max : val);
}

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

  return(a*a > ((x*x) + (y*y)));
}



