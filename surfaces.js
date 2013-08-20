var PIX = (function() {
    /**
     * Project: Pix_Elf
     * User: james
     * Date: 19/08/13
     * Time: 20:35
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

    var my = {};
    var error = ''; // error message string
    /* boolean to determine endianness */
    var _little_endian = new Int8Array(new Int16Array([1]).buffer)[0] > 0;
    var _ctx; // holds context object
    var _imageData; // typed array holding context image data
    var _byteSurfaceWidth; // surface width in bytes is 4 x width in pixels as each pixel is 4 bytes
    var _surfaceHeight; // surface height in pixels

    /**
     * initialises the pix_elf library
     * runs compatability tests returns true
     * if the browser is compatable
     * set the shared ctx variable to point to the canvas context
     * the typed array image_data:Uint8ClampedArray is created
     * @param canvas :dom  //a reference to the canvas DOM object
     * @param w :number //the width of the main surface
     * @param h :number // the height of the main surface
     * @returns {boolean}
     */
    my.PIX_Init = function(canvas, w ,h) {
        // test if we can do this
        // if not return false
        // otherwise
        _ctx = canvas.getContext('2d');
        _imageData = _ctx.getImageData(0, 0, w, h);
        _byteSurfaceWidth = w << 2; // w * 4
        _surfaceHeight = h;
        // and return true
        return true;

    };


    /**
     * gets a pionter to the video buffer. this data will sync to canvas
     * when PIX_updateRect is called
     * @returns {ArrayBuffer}
     */
    my.PIX_GetMainSurface = function() {
        return new ArrayBuffer(_byteSurfaceWidth * _surfaceHeight);
    };

    /*
    // V I E W S /////////////////////////////////////////////////////////////
    var CANVAS_VIEW = new Uint8ClampedArray(VIDEO_BUFFER); // 8 bit aligned for assigning to canvas
    var RGB_VIEW = new Uint32Array(VIDEO_BUFFER); // 32 bit aligned for quick 32bit RGB writes
    */


    my.ERR = function() {
        return error;
    }









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

}());