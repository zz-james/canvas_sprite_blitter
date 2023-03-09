/**
 * CANVAS: is the DOM object of type canvas
 * CTX: is the canvas controlling object
 *
 * IMAGE_DATA: is the canvas data area sort of image buffer for the canvas the
 * statement CTX.putImageData(IMAGE_DATA, 0, 0); copies the buffer to screen
 *
 * VIDEO_BUFFER: is a working buffer which we copy into IMAGE_DATA before we update the screen
 *
 * CANVAS_VIEW: in order for VIDEO_BUFFER and IMAGE_DATA to be compatable
 * we need to set an Uint8ClampedArray view into VIDEO_BUFFER as IMAGE_DATA
 * is a Uint8ClampedArray type. This view is called CANVAS_VIEW. We copy data from
 * the working buffeer (VIDEO_BUFFER) to the canvas buffer (IMAGE_DATA) with the statement
 * IMAGE_DATA.data.set(CANVAS_VIEW)
 *
 * RGB_VIEW: in order to work with 32 bit pixel values directly we also
 * need a Uint32Array view into video buffer, this is RGB_VIEW
 *
 * LITTLE_ENDIAN: as boolean which is true is the hardware is little endian
 * otherwise it is false
 */

export type Surface = {
  data: Uint8ClampedArray;
  height: number;
  width: number;
};

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Coord = {
  x: number;
  y: number;
};

let error: string = ""; // error message string
/* boolean to determine endianness */
export const little_endian: boolean =
  new Int8Array(new Int16Array([1]).buffer)[0] > 0;

let ctx: CanvasRenderingContext2D; // holds context object
let imageData: ImageData; // typed array holding context image data

let surfaceWidth: number; // surface width in pixels
let surfaceHeight: number; // surface height in pixels
let mainBuffer: ArrayBuffer; // surface that we can flip to canvas
let tix: number = new Date().getTime();

/**
 * initialises the pix_elf library
 * runs compatability tests returns true
 * if the browser is compatable
 * set the shared ctx variable to point to the canvas context
 * the ArrayBuffer mainBuffer is created
 * @param canvas :dom  //a reference to the canvas DOM object
 * @param w :number //the width of the main surface
 * @param h :number // the height of the main surface
 * @returns {boolean}
 */
export const init = (
  canvas: HTMLCanvasElement,
  w: number,
  h: number
): boolean => {
  if (!canvas.getContext("2d")) {
    error = "could not get context";
    return false;
  }

  ctx = canvas.getContext("2d")!;

  imageData = ctx.getImageData(0, 0, w, h); // the whole image data for the canvas
  const byteSurfaceWidth = w * 4; // 4 bytes (32 bits) per pixel
  surfaceHeight = h;
  surfaceWidth = w;
  mainBuffer = new ArrayBuffer(byteSurfaceWidth * surfaceHeight);
  return true;
};

export const contextToBuffer = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number
): Uint8ClampedArray => {
  const tmpImageData: ImageData = context.getImageData(0, 0, width, height);
  return tmpImageData.data;
};

// /**
//  * returns number of milliseconds since the library was initialised
//  */
// my.SURF_GetTicks = function () {
//   return new Date().getTime() - _tix;
// };

// /**
//  * gets a pionter to the video buffer. this data will sync to canvas
//  * when PIX_updateRect is called
//  * @returns {ArrayBuffer}
//  */
// my.SURF_GetMainSurface = function () {
//   return _imageData;
// };

// /**
//  * creates an empty unitialised surface object
//  * @returns {{surface: undefined}}
//  */
// export const newSurface = (): Surface => {
//   return { data: undefined };
// };

// /* -------- blitting using context methods --------- */

/**
 * copy a surface's data to screen
 * @param src_surface
 * @param src
 * @param dest
 * @constructor
 */
export const blitCanvas = (
  src_surface: Uint8ClampedArray,
  src: Rect,
  dest: Coord
) => {
  const imageData = new ImageData(src_surface, src.w);

  ctx.putImageData(
    imageData,
    dest.x, // Horizontal position (x coordinate) at which to place the image data in the destination canvas
    dest.y, // Vertical position (y coordinate) at which to place the image data in the destination canvas.
    src.x, // Horizontal position (x coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0
    src.y, // Vertical position (y coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0
    surfaceWidth, // Width of the rectangle to be painted. Defaults to the width of the image data.
    surfaceHeight // Height of the rectangle to be painted. Defaults to the height of the image data.
  );
};

export const createSurface = (image: HTMLImageElement): Surface => {
  const offscreen_canvas = document.createElement("canvas");
  offscreen_canvas.height = image.height;
  offscreen_canvas.width = image.width;
  const offscreen_context = offscreen_canvas.getContext("2d")!;
  offscreen_context.drawImage(image, 0, 0);
  return {
    width: image.width,
    height: image.height,
    data: offscreen_context.getImageData(0, 0, image.width, image.height).data, // extract typedArray
  };
};

// /**
//  * kind of a blitter using drawimage
//  * seems sort of pointless wrapper but we'll see
//  * @param src_surface
//  * @param src
//  * @param dest
//  * @constructor
//  */
// my.SURF_DrawToCanvas = function (src_surface, src, dest) {
//   _ctx.drawImage(
//     src_surface,
//     src.x,
//     src.y,
//     src.w,
//     src.h,
//     dest.x,
//     dest.y,
//     dest.w,
//     dest.h
//   );
// };

// /* --------- quickly dump buffer on screen ------------- */

/**
 * this just a function to display whatever is in the buffer of a
 * picture object not usually used in a game
 * @param surface
 */
export const showImageData = function (surface: ImageData) {
  console.log(surface.width);
  ctx.putImageData(surface, 0, 0);
};

// /**
//  * sort of unnecessary wrapper on drawImage
//  */
// my.SURF_DrawImage = function (surface) {
//   _ctx.drawImage(surface, 0, 0);
// };

// /**
//  * copy main buffer to canvas
//  */
// my.SURF_Flip = function () {
//   _ctx.putImageData(_mainBuffer, 0, 0);
// };

// /**
//  * frees up a surface's memory
//  * @param image_buf
//  */
export const freeSurface = (image_buf: Surface) => {
  image_buf = { surface: undefined };
};

// /**
//  * makes buffer go black
//  */
// my.SURF_ClearScreen = function () {
//   _ctx.clearRect(0, 0, _surfaceHeight, _surfaceWidth);
// };

/**
 * retrieves any error string
 * @constructor
 */
export const getError = (): string => {
  return error;
};

/**
 * this is a utility function - we using it to custom blit image data
 * @param dst
 * @param dstOffset *in bytes!*
 * @param src
 * @param srcOffset *in bytes!*
 * @param length *in bytes!*
 */
var memcpy = (
  dst: ArrayBuffer,
  dstOffset: number,
  src: ArrayBuffer,
  srcOffset: number,
  length: number
) => {
  var dstU8 = new Uint8Array(dst, dstOffset, length);
  var srcU8 = new Uint8Array(src, srcOffset, length);
  dstU8.set(srcU8);
};

// /*
//     var kwikShowBuffer = function(buffer) {
//         var  canvas_buf = new Uint8Array(buffer);
//         CANVAS_VIEW.set(buffer);
//         IMAGE_DATA.data.set(CANVAS_VIEW);
//         CTX.putImageData(IMAGE_DATA, 0, 0);
//     };
//     */

// /* REMEMBER WE NEED  THESE
//     IMAGE_DATA.data.set(CANVAS_VIEW);
//     CTX.putImageData(IMAGE_DATA, 0, 0);
//     */

// /*
//      // V I E W S /////////////////////////////////////////////////////////////
//      var CANVAS_VIEW = new Uint8ClampedArray(VIDEO_BUFFER); // 8 bit aligned for assigning to canvas
//      var RGB_VIEW = new Uint32Array(VIDEO_BUFFER); // 32 bit aligned for quick 32bit RGB writes
//      */

// return my;
