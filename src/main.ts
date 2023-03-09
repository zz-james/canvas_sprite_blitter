import "./style.css";
// import { setupCounter } from "./counter";
import * as SURF from "./surfaces";
import { Surface } from "./surfaces";
import * as IMG from "./image";
import * as KEY from "./keys";

type Rect = {
  x: number;
  y: number;
  w?: number;
  h?: number;
};

const requestAnimFrame = window.requestAnimationFrame;

// hmm can all this be encapsulated somehow?
let image_buf: Surface = SURF.newSurface(); // pixelf surface object (buffer)
let counter: number = 0;
let dirX: number = 5;
let dirY: number = 5;
let quit: boolean = false;
let keystate; // keyboard shizzle
// let mouseLoc; // mouse shizzle
let src: Rect, dest: Rect; // source and destination rect we hold up here for now.

/* Fire up PIX. */
if (
  SURF.init(
    document.getElementById("canvas")! as HTMLCanvasElement,
    1400,
    750
  ) !== true
) {
  throw "Unable to initialize Pixelf" + SURF.getError();
}

let images;
// load 100 images from slices folder
for (var i = 0; i < 4; i++) {
  IMG.queueImage(image_buf, "slices/image" + i + ".jpg"); // this goes into a loading list
}

try {
  images = await IMG.loadImages(); // this can be a promise.all()
} catch (e) {
  throw new Error(e);
}

const mainLoop = () => {
  if (!quit) {
    keystate = KEY.getKeyState();
    if (keystate["q"] || keystate["Escape"]) quit = true; // 'q' or 'esc'  --

    dirX = 0;
    dirY = 0;

    // ArrowUp
    if (keystate["ArrowLeft"]) dirX = -5; /* left arrow */
    if (keystate["ArrowRight"]) dirX = 5; /* right arrow */
    if (keystate["ArrowUp"]) dirY = -5; /* up arrow */
    if (keystate["ArrowDown"]) dirY = 5; /* down arrow */

    let y = src.y + dirY;
    let x = src.x + dirX;

    if (y > 9126 || y < 0) {
      dirY = 0;
      y = ((y / 9125) >> 0) * 9125;
    }
    if (x > 24462 || x < 0) {
      dirX = 0;
      x = ((x / 24462) >> 0) * 24462;
    }

    src = {
      x: x,
      y: y,
      w: 1350,
      h: 750,
    }; // width and height are constant, they are the screenfull

    dest = {
      x: dest.x - dirX,
      y: dest.y - dirY,
    };

    if (image_buf.surface) {
      SURF.blitCanvas(image_buf.surface, src, dest);
      requestAnimFrame(mainLoop);
    }
    console.log("hello");
  } else {
    console.log("Quitted at " + counter);
    // free up memory allocated to the bitmap
    SURF.freeSurface(image_buf);
  }
};

if (image_buf.surface) {
  src = { x: 0, y: 0, w: 1350, h: 750 };
  dest = { x: 0, y: 0 };
  SURF.blitCanvas(image_buf.surface, src, dest);
  // requestAnimFrame(mainLoop);
  requestAnimFrame(mainLoop);
}

/* Save the screen pointer for later use. */
// dscreen = PIX.SURF_GetMainSurface();

/* Load the game's data into globals. */
// LoadGameData(); //hmmmm tail call.....

// src = { x: 0, y: 0, w: 1350, h: 750 };
// dest = { x: 0, y: 0 };

// SURF.blitCanvas(image_buf.surface, src, dest);

// requestAnimFrame(mainLoop);
