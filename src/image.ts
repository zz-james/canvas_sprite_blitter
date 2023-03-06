import { Surface } from "./surfaces";

type BufferData = { buffer: Surface; image: HTMLImageElement };

let bufferDataContainer: BufferData[] = []; // array [{surface object, image object},...]
let numImgs: number;
// let numLoadedImgs: number = 0;
// let callback;
// let tmpImg: HTMLImageElement = new Image(); // just have this image pointer in heap

export const queueImage = (surface: Surface, url: string) => {
  //check if 'surface' is actually a valid
  if (!surface.hasOwnProperty("surface")) {
    throw "not a valid surface object please ensure the surface is properly initialised using SURF_NewSurface";
  }

  const img = new Image();

  img.id = url; // when we load we'll set src = id
  bufferDataContainer.push({ buffer: surface, image: img });
  numImgs = bufferDataContainer.length;
  console.log("queueing image " + numImgs); // debug
};

/**
 * itterate over list of buffer objects setting the src
 * property of the image objects which will trigger the download
 * @param callback ; the function to call when all the images are loaded
 */
export const loadImages = async () => {
  const finalResults = await Promise.all(
    bufferDataContainer.map(
      async (bufferData) => await loadImage(bufferData) // loader function that retuns a promise
    ) // this will return an array of promises
  ).then((results) => {
    return results;
  });
  return finalResults;
};

const loadImage = async (bufferData: BufferData) => {
  return new Promise((resolve, reject) => {
    const img = bufferData.image;
    img.onload = () => {
      console.log("completed loading image " + img.id);
      putImageDataInBuffer(bufferData);
      resolve(bufferData);
    };
    img.onerror = function (event: Event | string) {
      if (typeof event === "string") reject(`there was an error ${event}`);
      reject("there was an error loading " + (event as Event).currentTarget);
    };

    img.src = img.id; // trigger the actual loading of the image
    console.log("started loading image " + img.id);
  });
};

const putImageDataInBuffer = (bufferData: BufferData) => {
  var offscreen_canvas = document.createElement("canvas");
  var offscreen_context = offscreen_canvas.getContext("2d")!;

  const tmpImg = bufferData.image;
  var width = tmpImg.width;
  var height = tmpImg.height;
  offscreen_canvas.width = width;
  offscreen_canvas.height = height;
  offscreen_context.drawImage(tmpImg, 0, 0);
  // bufferData.buffer.img = tmpImg;
  bufferData.buffer.surface = offscreen_context.getImageData(
    0,
    0,
    width,
    height
  );
};
