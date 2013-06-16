/**
 * Project: Canvas Sprite Blitter
 * User: James
 * Date: 08/05/13
 * Time: 20:18
 */
"use strict";

// G L O B A L S  ////////////////////////////////////////////////////////////

// reusable dom objects
var DOM_IMAGE_OBJECT = new Image();
var OFFSCREEN_CANVAS = document.createElement('canvas');
var OFFSCREEN_CONTEXT = OFFSCREEN_CANVAS.getContext('2d');

OFFSCREEN_CANVAS.width = SCREEN_WIDTH;
OFFSCREEN_CANVAS.height = SCREEN_HEIGHT;

// F U N C T I O N S ///////////////////////////////////////////////////////


/**
 * this function allocates the buffer region needed to load a pcx file
 * and returns an object with 2 views, an 8 bit view for canvas and
 * a 32 bit view for pixel manipulation. the buffer is the same dimensions
 * as the canvas area.
 */
var pictureFactory = function() {
    var buffer = new ArrayBuffer(SCREEN_WIDTH * SCREEN_HEIGHT * 4);
    return {
        filename : 'UNINTIALISED',
        cnv_view : new Uint8ClampedArray(buffer), // 8 bit aligned for assigning to canvas
        rgb_view : new Uint32Array(buffer)
    };
};


/**
 * this function loads a png file into a picture object, the actual image
 * data for the png file is stored in a secondary buffer within the picture structure,
 * the separate images can be grabbed from this buffer later.
 * remember image loading is asynch and so we need a handler &
 * a callback to jump back in to main.
 *
 * uses global DOM_IMAGE_OBJECT which is a shared DOM object for loading images
 *
 * @param picture - picture object created with pictureFactory method
 * @param filename - filename of image obs.
 * @param callback - function object to jump back to when image loaded
 */
var pictureLoad = function( picture, filename, callback ) {
    DOM_IMAGE_OBJECT.onload = function(e) {
       putImageDataInBuffer(picture);
       callback(picture);
    };

    DOM_IMAGE_OBJECT.src = filename;
    picture.filename = filename;
};

/**
 * this function works with pictureLoad to put the image data into the
 * picture object buffer
 *
 * uses the global OFFSCREEN_CONTEXT which is a shared DOM object
 *
 * @param picture - picture object created with pictureFactory
 */
var putImageDataInBuffer = function(picture) {
    OFFSCREEN_CONTEXT.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    OFFSCREEN_CONTEXT.drawImage(DOM_IMAGE_OBJECT,0,0);
    var imageData = OFFSCREEN_CONTEXT.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    picture.cnv_view.set(imageData.data); // data is a Uint8ClampedArray
};

/**
 * this just a function to display whatever is in the buffer of a
 * picture object not usually used in a game
 * @param picture
 */
var pictureShowBuffer = function(picture) {
    CANVAS_VIEW.set(picture.cnv_view);
    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);
};

/**
 * clear the picture buffer of a picture object
 * todo: probs can just clear the buffer and maybe
 * this could be used again in a object pool
 * @param picture
 */
var pictureDelete = function(picture) {
    picture.buffer = null;
};

