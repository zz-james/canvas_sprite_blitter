/**
 * Project: Canvas Sprite Blitter
 * User: james
 * Date: 06/05/13
 * Time: 18:17
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

/* REMEMBER WE NEED  THESE
IMAGE_DATA.data.set(CANVAS_VIEW);
CTX.putImageData(IMAGE_DATA, 0, 0);
*/