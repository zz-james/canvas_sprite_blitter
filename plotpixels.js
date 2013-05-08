/**
 * User: james
 * Date: 29/04/13
 * Time: 17:14
 */
"use strict";

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var SCREEN_WIDTH = 320;       /* width in pixels of mode 0x13  */
var SCREEN_HEIGHT = 200;        /* height in pixels of mode 0x13 */
var NUM_COLORS = 256;        /* number of colors in mode 0x13 */

// grab element info from HTML doc
var canvas = document.getElementById('canvas'); // should really create canvas & attach
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

/* this sets up a video buffer. */
var videoBuffer = new ArrayBuffer(SCREEN_WIDTH * SCREEN_HEIGHT * 4); // 4 byes per pixel (32bit)

/* create 2 aligned views of data */
var canvasView = new Uint8ClampedArray(videoBuffer); // 8 bit aligned for assigning to canvas
var RGBView = new Uint32Array(videoBuffer); // 32 bit aligned for quick 32bit RGB writes

/* determine endianness */
var littleEndian = new Int8Array(new Int16Array([1]).buffer)[0] > 0;


// ## like an ifdef we generate 2 different functions for the endianneess ## //
    if (littleEndian) {

    var plotPixelFast = function(x,y,color) {
        RGBView[y * SCREEN_WIDTH + x] = 0xff0000ff;
        imageData.data.set(canvasView);
        ctx.putImageData(imageData, 0, 0);
    }

    } else {

    var plotPixelFast = function(x,y,color) {
        RGBView[y * SCREEN_WIDTH + x] = 0xffff0000;
        imageData.data.set(canvasView);
        ctx.putImageData(imageData, 0, 0);
    }

    }
// ## end like an ifdef we generate 2 different functions for the endianneess ## //



    var x,y,color;
    var i = 0;
    var start = (Date.now());
    window.mainloop = function(event) /* randomly plot 50000 pixels. */
    {
        event.stopPropagation();
        x = Math.random() * SCREEN_WIDTH << 0;
        y = Math.random() * SCREEN_HEIGHT << 0;
        color=Math.random() * NUM_COLORS << 0;
        plotPixelFast(x,y,color);
        i++;
        if(i < 50000)
            { window.postMessage("*", "*"); }
        else
            {var end = (Date.now()); console.log(end-start);}
    };


window.addEventListener("message", mainloop, true);

window.postMessage("*", "*");
