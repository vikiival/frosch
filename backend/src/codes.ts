export const code = `const DEFAULT_HASH =
"0x175adf5fc058830a6319b8238ecc911db6e1b8dd40965629b5f0c5bee655598c";
let wid, hgt, sw2, dotSpace, strokeCol, x3, j, hash;
let pd = 1;
let fromMain = false;
let toPrint = false;

function setup() {
const params = getURLParams();
hash = params.hash || DEFAULT_HASH;
//seed = floor(random(99999999)); 
seed = hashToSeed(hash);
restart();
}

function restart() {
start2 = Date.now();
randomSeed(seed);
noiseSeed(seed);
palette = floor(random(19));
additionalSeed = 0; //for random seed
countIncrement = 9999; //for random seed
skipNow = 1;
dir = 1;
alph = 100;
fromLine = false;
fromMain = false;
phase = 0;
objectAttempts = 0;
noiseAttempts = 0;
wid = min(windowWidth, windowHeight);
hgt = wid;
wid3 = 1000; //buffer & noise canvases
hgt3 = (wid / hgt) * wid3;
scl = wid3 / wid; //scale for checking buffer & noise canvases
createCanvas(wid, hgt);
pixelDensity(pd);
colorMode(HSB, 360, 100, 100, 255);
cnv0 = createGraphics(wid, hgt);
cnv0.colorMode(HSB, 360, 100, 100, 255);
dataCanvases();
cnv0.noFill();
segWid = wid * 0.004;
len = wid * 0.01;
rez = 0.003;
objectsMade = 0;
countMin = 10; //10
countMax = 21; //21
objectsToMake = floor(random(countMin,countMax+1));
arcMade = false;
noiseCount = 0;
swMin = wid * 0.001;
swMax = wid * 0.011;
sw4 = wid * 0.00025; //actual line strokeWeight
sizeInc = 3; //for makeDot
prevAngle = PI * 0.25 * floor(random(8));
makeBackground();
randomSeed(seed);
noiseSeed(seed);
skip = wid3 * 0.03; //20 x 20 grid for noise
}

function draw() {
if (phase == 1) {
  addTexture();
  randomSeed(seed);
  noiseSeed(seed);
}
if (phase == 2) {
  checkNoise();
}
if (phase == 3 && objectsMade < objectsToMake) {
  mainDrawing();
  objectAttempts++;
  phase--;
  image(cnv0, 0, 0);
}
if (phase == 5) {
  image(cnv0, 0, 0);
  postMessageKoda();
}
if (phase == 6) {
  image(cnv0, 0, 0);
  if (toPrint == true) {
    save("Enough-StevesMakerspace.png");
  }
  noLoop();
  secs = round((Date.now() - start2) / 1000, 2);
  print("palette: " + palette);
  print("seed: " + seed);
  //print("object attempts: " + objectAttempts);
  // print("objectsMade: " + objectsMade);
  // print("seconds: " + secs);
  //  print("noiseSpace:" + noiseSpace);
  //  print("noise attempts: " + noiseAttempts);
   //cnvNoise.save("noise.jpg");
  // cnvArc.save("arcs.jpg");
  // cnvLin.save("lines.jpg");
  // cnvDot.save("dot.jpg");
}
if (phase > 6) {
  image(cnv0, 0, 0);
}
phase++;
}

function mainDrawing() {
//print(noiseCount);
cnv0.stroke(cols[palette][1]);
x = wid * random(0.2, 0.8);
y = hgt * random(0.2, 0.8);
n = noise(x * scl * rez, y * scl * rez, noiseCount);
if (n < 0.4 || n > 0.6 || objectAttempts >= 50) {
  //end parts of noise
  dir = 1;
  type = random(10.5);
  if (objectsMade == objectsToMake-1 && arcMade == false) {
    type = 0;
  }
  if (type < 3.5) {
    //arcs
    x = constrain(x, wid * 0.25, wid * 0.75);
    y = constrain(y, hgt * 0.25, hgt * 0.75);
    checkCol = cnvArc.get(x * scl, y * scl);
    checkCol[0] = 1;
    if (checkCol[0] == 0) {
      return;
    }
    multipleArcs();
  } else if (type < 10) {
    //lines
    sw = random(swMin, swMax * 0.75);
    sw2 = sw;
    makeLine();
    makeLine();
    if (random(5) < 1) {
      makeLine();
    }
  } else {
    //dots
    dotSpace = true;
    fromMain = true;
    sw = random(swMin, swMax * 0.75);
    makeDot(hgt * sizeInc * random(0.003, 0.008)); // radius of dot
    fromMain = false;
  }
}
}

function multipleArcs() {
diam = wid * random(0.15, 0.35);
x4 = x;
y4 = y;
makeArc();
x = x4;
y = y4;
if ((random(2) < 1 && diam > wid * 0.2) || diam > wid * 0.25) {
  // make another arc here
  diam = random(wid * 0.15, diam * 0.8); //go smaller
} else {
  diam = random(diam * 1.2, wid * 0.35); //go larger
}
makeArc();
x = x4;
y = y4;
if (random(5) < 1) {
  if ((random(2) < 1 && diam > wid * 0.2) || diam > wid * 0.25) {
    // make another arc here
    diam = random(wid * 0.15, diam * 0.8); //small
  } else {
    diam = random(diam * 1.2, wid * 0.35); //large
  }
  makeArc();
}
}

function makeDot(rad) {
//receive radius
cnv0.strokeWeight(sw4);
if (fromLine === true) {
  checkCol = cnvDot.get((x3 + x) * scl, (y3 + y) * scl);
  checkCol[0] = 1;
} else if (fromMain == true) {
  checkCol = cnvDot.get(x * scl, y * scl);
  checkCol2 = cnvArc.get(x * scl, y * scl);
  checkCol3 = cnvLin.get(x * scl, y * scl);
  checkCol[0] = 1;
  checkCol2[0] = 1;
  checkCol3[0] = 1;
  if (checkCol[0] == 0 || checkCol2[0] == 0 || checkCol3[0] == 0) {
    dotSpace = false;
    return;
  }
} else {
  //from arc
  checkCol = cnvDot.get(x * scl, y * scl);
  checkCol[0] = 1;
}
if (checkCol[0] == 0) {
  dotSpace = false;
  return;
}
cnv0.noFill();
alph2 = 180;
if (random(20) < 1 || objectsMade == 5) {
  strokeCol = color(
    cols[palette][2][0],
    cols[palette][2][1],
    cols[palette][2][2],
    alph2
  );
} else {
  strokeCol = color(
    cols[palette][1][0],
    cols[palette][1][1],
    cols[palette][1][2],
    alph2
  );
}
cnv0.stroke(strokeCol);
cnv0.push();
cnv0.translate(x, y);
let startR = rad;
numCircles = (rad / width) * 7000;
for (k = 0; k < numCircles; k++) {
  cnv0.circle(
    random(-rad * 0.18, rad * 0.18),
    random(-rad * 0.18, rad * 0.18),
    random(rad * 2)
  );
}
// additionalSeed += countIncrement;
// randomSeed(seed + additionalSeed);
// noiseSeed(seed + additionalSeed);
cnv0.pop();
cnv0.noFill();

if (fromLine == true) {
  cnvDot.push();
  cnvDot.rotate(rotAngle);
  cnvDot.point(x * scl, y * scl);
  cnvDot.pop();
} else {
  cnvDot.point(x * scl, y * scl);
}
objectsMade++;
}

function makeLine() {
sw = sw2; //this ensures that two connected lines will start with the same strokeWeight
alph = 210; //180
if (random(20) < 1 || objectsMade == 5) {
  strokeCol = color(
    cols[palette][2][0],
    cols[palette][2][1],
    cols[palette][2][2],
    alph
  );
} else {
  strokeCol = color(
    cols[palette][1][0],
    cols[palette][1][1],
    cols[palette][1][2],
    alph
  );
}
cnv0.stroke(strokeCol);
cnv0.push();
cnv0.translate(x, y);
cnvLin.push();
cnvLin.translate(x * scl, y * scl);
if (fromLine == true) {
  cnvDot.push();
  cnvDot.translate(x * scl, y * scl);
}
rotateLine();
segments = floor(random(30, 65));
fullLineLength = segments * segWid; //length of entire line
open = true;
checkLineSpace();
cnvLin.pop();
swArray = [];
if (open == true) {
  if (fromLine == false) {
    cnvDot.push();
    cnvDot.translate(x * scl, y * scl);
  }
  let newLineVary, prevLineVary;
  sw = random(swMin, swMax);
  for (k = 0; k < 120; k++) {
    shift = width * random(0.012); //variation in where the line starts
    for (i = 0; i < segments; i++) {
      //one long line
      //for the first long line, record all the thicknesses to be used by all the lines
      if (k == 0) {
        sw += random(wid * 0.0005) * dir;
        sw = constrain(sw, swMin, swMax);
        swChange(0.2); //chance the strokeWidth change will switch between positive and negative change
        swArray.push(sw);
      } else {
        sw = swArray[i];
      }
      if (i == 0) {
        //first segment in line
        newLineVary = random(-sw, sw);
        prevLineVary = newLineVary;
      }
      cnv0.strokeWeight(sw4);
      //skipNow = 1;
      newlineVary = prevLineVary + sw * random(-0.05, 0.05);
      newLineVary = constrain(newLineVary, -sw, sw);
      if (skipNow == 1) {
        cnv0.line(
          i * segWid + shift,
          prevLineVary,
          (i + 1) * segWid + shift,
          newLineVary
        );
      }
      prevLineVary = newLineVary;
      if (random(12) < 2) {
        //turn line drawing on and off
        skipNow *= -1;
      }
    }
    // objectsMade2 += countIncrement;
    // randomSeed(seed + additionalSeed);
    // noiseSeed(seed + additionalSeed);
  }
  objectsMade++;
  if (random(10) < 2.5) {
    //chance a dot added to line
    x3 = x;
    y3 = x;
    newR = hgt * sizeInc * random(0.003, 0.008); //radius of new dot
    x = random(i * segWid);
    y = sw * 0.5 + newR * (wid / 1000) * random(1.1, 2);
    if (random(2) < 1) {
      // above or below line?
      y = -y;
    }
    fromLine = true;
    makeDot(newR);
    fromLine = false;
    x = x3;
    y = y3;
  }
  cnvDot.pop();
}
cnv0.pop();

//cnvLin.pop();
}

function checkLineSpace() {
// get does not translate, so we need to calculate the x and y
x1 = cos(rotAngle) * fullLineLength * 0.5 + x;
y1 = sin(rotAngle) * fullLineLength * 0.5 + y;
checkCol = cnvLin.get(x1 * scl, y1 * scl);
//print(checkCol[0]);
if (checkCol[0] == 0) {
  open = false;
  return;
}
x1 = cos(rotAngle) * fullLineLength * 0.3 + x;
y1 = sin(rotAngle) * fullLineLength * 0.3 + y;
checkCol = cnvLin.get(x1 * scl, y1 * scl);
//checkCol[0] = 1;
if (checkCol[0] == 0) {
  open = false;
  return;
}
x1 = cos(rotAngle) * fullLineLength * 0.75 + x;
y1 = sin(rotAngle) * fullLineLength * 0.75 + y;
checkCol = cnvLin.get(x1 * scl, y1 * scl);
//checkCol[0] = 1;
if (checkCol[0] == 0) {
  open = false;
  return;
}
x1 = cos(rotAngle) * fullLineLength + x;
y1 = sin(rotAngle) * fullLineLength + y;
checkCol = cnvLin.get(x1 * scl, y1 * scl);
//checkCol[0] = 1;
if (checkCol[0] == 0) {
  open = false;
  return;
}
cnvLin.line(0, 0, fullLineLength * scl, 0);
//cnvLin.ellipse(fullLineLength * scl*0.5, 0,fullLineLength*scl,wid3 * 0.11);

cnvDot.strokeWeight(wid3 * 0.06);
cnvDot.push();
cnvDot.translate(x * scl, y * scl);
cnvDot.rotate(rotAngle);
cnvDot.line(0, 0, fullLineLength * scl, 0);
cnvDot.pop();
cnvDot.strokeWeight(wid3 * 0.15);
}

function rotateLine() {
angArray = [0, 1, 2, 3, 4, 5, 6, 7];
if (x > wid * 0.75) {
  remov = angArray.indexOf(0);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
  remov = angArray.indexOf(1);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
  remov = angArray.indexOf(7);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
}
if (x < wid * 0.25) {
  remov = angArray.indexOf(3);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
  remov = angArray.indexOf(4);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
  remov = angArray.indexOf(5);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
}
if (y < hgt * 0.25) {
  remov = angArray.indexOf(5);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
  remov = angArray.indexOf(6);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
  remov = angArray.indexOf(7);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
}
if (y > hgt * 0.75) {
  remov = angArray.indexOf(1);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
  remov = angArray.indexOf(2);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
  remov = angArray.indexOf(3);
  if (remov > -1) {
    angArray.splice(remov, 1);
  }
}
rotAngle = PI * 0.25 * random(angArray);
if (angArray.includes(round(prevAngle / (PI * 0.25))) && random(4) < 2) {
  rotAngle = prevAngle;
}
cnv0.rotate(rotAngle);
cnvLin.rotate(rotAngle);
prevAngle = rotAngle;
}

function makeArc() {
sw = random(swMin * 1.5, swMax * 0.99);
sw2 = sw; //saving the starting strokeWeight so if we add a line to the start, it will be the same strokeWeight at its start
maxLineVary = swMax * 1.0;
alph2 = 200;
if (random(20) < 1 || objectsMade == 5) {
  strokeCol = color(
    cols[palette][2][0],
    cols[palette][2][1],
    cols[palette][2][2],
    alph2
  );
} else {
  strokeCol = color(
    cols[palette][1][0],
    cols[palette][1][1],
    cols[palette][1][2],
    alph2
  );
}
cnv0.stroke(strokeCol);
start = random(PI * 2);
end = start + PI * random(0.4, 1.3);
swArray = [];
cnv0.push();
cnv0.translate(x, y);
lineVary = sw * random(-1, 1);
for (k = 0; k < 150; k++) {
  //make this many little arc lines
  prevX5 = cos(start) * ((diam + sw) * 0.5 + lineVary * sw * 0.07);
  prevY5 = sin(start) * ((diam + sw) * 0.5 + lineVary * sw * 0.07);
  cnt = 0;
  shift = random(0.06);
  lineVary = sw * random(-1, 1);
  for (i = start + shift; i < end + shift; i += 0.03) {
    if (k == 0) {
      //first arc line strokeWeight gets saved
      swArray.push(sw);
      sw += random(wid * 0.0005) * dir; //gradual change in strokeWeight
      sw = constrain(sw, swMin, swMax * 0.9);
      swChange(0.3); //chance the strokeWeight change will change direction
    } else {
      sw = swArray[cnt];
      cnt++;
    }
    cnv0.strokeWeight(sw4);
    lineVary += sw * random(-0.04, 0.04); //gradual "strokeWeight" change of this line
    lineVary = constrain(lineVary, -sw, sw);
    x5 = cos(i + 0.06) * (diam + sw) * 0.5 + lineVary;
    y5 = sin(i + 0.06) * (diam + sw) * 0.5 + lineVary;
    if (skipNow == 1 && i != start + shift) {
      cnv0.line(prevX5, prevY5, x5, y5);
    }
    prevX5 = x5;
    prevY5 = y5;
    if (random(12) < 1) {
      skipNow *= -1;
    }
  }
  // additionalSeed += countIncrement;
  // randomSeed(seed + additionalSeed);
  // noiseSeed(seed + additionalSeed);
  arcMade = true;
}
cnv0.pop();
cnvArc.strokeWeight(wid3 * 0.06);
cnvArc.arc(
  x * scl,
  y * scl,
  diam * scl,
  diam * scl,
  start + shift,
  end + shift
);
cnvArc.strokeWeight(wid3 * 0.15);
cnvArc.point(x * scl, y * scl);
objectsMade++;
//cnvDot.arc(x,y,diam,diam,start,end);
if (random(10) < 1) {
  // chance to add a line from center of arc
  makeLine();
}

if (random(10) < 1.7) {
  // chance of line or dot added to arc edge
  type2 = random(10); //line or dot?
  ang3 = random(start, end); //where along arc will dot or line be made
  if (type2 < 8) {
    //make dot
    newR = hgt * sizeInc * random(0.003, 0.008);
    let sw3;
    if (random(2) < 1) {
      //above or below arc?
      sw3 = newR * random(1.5, 2.5);
    } else {
      sw3 = -newR * random(1.2, 2.5);
    }
    x = cos(ang3) * (diam * 0.5 + sw3) + x;
    y = sin(ang3) * (diam * 0.5 + sw3) + y;
    makeDot(newR);
  } else {
    x = cos(ang3) * diam * 0.5 + x;
    y = sin(ang3) * diam * 0.5 + y;
    makeLine();
  }
}
}

function swChange(chance) {
//sw += random(wid * 0.0005) * dir;
if (random(10) < chance) {
  dir *= -1;
}
if (sw < swMin * 1.05 && random(10) < 3) {
  dir = 1; //prevent it from staying skinny
}
if (sw <= swMin) {
  dir = 1;
}
if (sw > swMax * 0.9 && random(10) < 3) {
  dir = -1; //prevent it from staying thick
}
if (sw >= swMax) {
  dir = -1;
}
}

function windowResized() {
loop();
newWid = min(windowWidth, windowHeight);
toPrint = false;
phase = 0;
resizeCanvas(newWid, newWid);
restart();
}

function keyTyped() {
// Allows user to press 1 - 5 to get different sized outputs
if (key > 0 && key < 9) {
  pd = int(key);
  loop();
  toPrint = true;
  phase = 0;
  restart();
}
if (key == "s") {
  save("Enough-StevesMakerspace.png");
}
}

// KODA(HASH) UTILITY FUNCTIONS
// ----------------------------

// You can use your own function to convert the hash to a seed
function hashToSeed(hash) {
let _seed = 0;
for (let hl = 0; hl < 60; hl = hl + 12) {
  _seed += parseInt(hash.substring(hl, hl + 12), 16);
}
return _seed;
}

function postMessageKoda() {
console.log("Talking");
const canvas = document.querySelector("canvas");
const message = {
  id: Date.now(),
  type: "kodahash/render/completed",
  payload: {
    hash: hash,
    type: "image/png",
    image: canvas ? canvas.toDataURL("image/png") : null,
    search: location.search,
    attributes: [],
  },
};
console.log("Sending", message);

window.parent.postMessage(message, "*");
}
`


export const magic = `const DEFAULT_HASH =
  '0x044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d'

let hash
let seed = 0
let bg = [] // background color

function setup() {
  canvasSize = min(windowWidth, windowHeight)

  createCanvas(canvasSize, canvasSize)

  const params = getURLParams()

  hash = params.hash || DEFAULT_HASH

  seed = hashToSeed(hash)
  randomSeed(seed) // ART is deterministic now
  noiseSeed(seed) // Perlin noise too  
  console.log(hash, seed)

  // using random to generate a random color
  bg = [random(255), random(255), random(255)]

  noLoop() // In case you need to draw only once
}

function draw() {
  background(bg)
  // Once the drawing is done, we can send the image to the parent window
  postMessageKoda()
}

function windowResized() {
  canvasSize = min(windowWidth, windowHeight)

  resizeCanvas(canvasSize, canvasSize)
}

// KODA(HASH) UTILITY FUNCTIONS
// ----------------------------

// You can use your own function to convert the hash to a seed
function hashToSeed(hash) {
  let _seed = 0
  for (let hl = 0; hl < 60; hl = hl + 12) {
    _seed += parseInt(hash.substring(hl, hl + 12), 16)
  }
  return _seed
}

function postMessageKoda() {
  console.log('Talking')
  const canvas = document.querySelector('canvas')
  const message = {
    id: Date.now(),
    type: 'kodahash/render/completed',
    payload: {
      hash: hash,
      type: 'image/png',
      image: canvas ? canvas.toDataURL('image/png') : null,
      search: location.search,
      attributes: [],
    },
  }
  console.log('Sending', message)

  window.parent.postMessage(message, '*')
}
`