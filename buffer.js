/**
 * Project: Canvas Sprite Blitter
 * User: james
 * Date: 06/05/13
 * Time: 18:17
 *
 * This file sets up quite a few globals which someday I will
 * package nicely.
 *
 *
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
"use strict";

// G L O B A L S /////////////////////////////////////////////////////////////
var SCREEN_WIDTH = 320; // canvas dimensions
var SCREEN_HEIGHT = 200;

var CANVAS = document.getElementById('canvas'); // should really create canvas & attach
var CTX = CANVAS.getContext('2d');
var IMAGE_DATA = CTX.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

/* this sets up a video buffer. */
var VIDEO_BUFFER = new ArrayBuffer(SCREEN_WIDTH * SCREEN_HEIGHT * 4); // 4 byes per pixel (32bit)

// V I E W S /////////////////////////////////////////////////////////////
var CANVAS_VIEW = new Uint8ClampedArray(VIDEO_BUFFER); // 8 bit aligned for assigning to canvas
var RGB_VIEW = new Uint32Array(VIDEO_BUFFER); // 32 bit aligned for quick 32bit RGB writes

/* determine endianness */
var LITTLE_ENDIAN = new Int8Array(new Int16Array([1]).buffer)[0] > 0;

// F U N C T I O N S /////////////////////////////////////////////////////////////
// ## like an ifdef we generate 2 different functions for the endianneess ## //
if (LITTLE_ENDIAN) {

    var plotPixelFast = function(x,y,color) {
        // console.log(y);
        RGB_VIEW[y * SCREEN_WIDTH + x] = color;
    }

} else {

    var plotPixelFast = function(x,y,color) {
        RGB_VIEW[y * SCREEN_WIDTH + x] = color;
    }

}
// ## end like an ifdef we generate 2 different functions for the endianneess ## //

/**
 * this is a utility function - we using it to blit image data
 * @param dst
 * @param dstOffset in bytes!
 * @param src
 * @param srcOffset in bytes!
 * @param length in bytes!
 */
var memcpy = function(dst, dstOffset, src, srcOffset, length) {
    var dstU8 = new Uint8Array(dst, dstOffset, length);
    var srcU8 = new Uint8Array(src, srcOffset, length);
    dstU8.set(srcU8);
};

var cls = function() {
    CTX.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
};

var kwikShowBuffer = function(buffer) {
    var  canvas_buf = new Uint8Array(buffer);
    CANVAS_VIEW.set(buffer);
    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);
};

/* REMEMBER WE NEED  THESE
IMAGE_DATA.data.set(CANVAS_VIEW);
CTX.putImageData(IMAGE_DATA, 0, 0);
*/