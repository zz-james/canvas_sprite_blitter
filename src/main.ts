import "./style.css";
// import { setupCounter } from "./counter";
import * as SURF from "./surfaces";
import { Surface } from "./surfaces";
import * as IMG from "./image";

console.log(SURF.little_endian);

// hmm can all this be encapsulated somehow?
let image_buf: Surface = SURF.newSurface(); // pixelf surface object (buffer)
let counter: number = 0;
let dirX: number = 5;
let dirY: number = 5;
let quit: boolean = false;
// let keystate; // keyboard shizzle
// let mouseLoc; // mouse shizzle
// let src, dest; // source and destination rect we hold up here for now.

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

console.log(images);
/* Save the screen pointer for later use. */
// dscreen = PIX.SURF_GetMainSurface();

/* Load the game's data into globals. */
// LoadGameData(); //hmmmm tail call.....

// document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
//   <div>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `;

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
