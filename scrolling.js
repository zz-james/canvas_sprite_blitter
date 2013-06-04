/**
 * Project:
 * User: james
 * Date: 04/06/13
 * Time: 18:14
 */
"use strict";

var SCROLL_WIDTH = 640;
var SCROLL_HEIGHT = 200;

var SCROLL_BUFFER; // pointer to scroll buffer
var SCROLL_BUFFER_RGB_VIEW; // 32 bit aligned for quick 32bit RGB writes

// exit flag and scroll viewport position
var done = 0, sx = 0;

// F U N C T I O N S /////////////////////////////////////////////////////////////
var showViewPort = function(buffer, pos) {
    // copy a portion of the scrolling buffer into the video buffer
    var y,scroll_off,screen_off;

    // there are 100 rows which must be moved
    // move the data row by row
    for(y=0; y<200; y++){

        // compute the starting offset into scroll buffer
        scroll_off = (y * SCROLL_WIDTH * 4) + pos * 4;

        // compute the starting offset in video_buffer's RGB_VIEW
        screen_off = (y * SCREEN_WIDTH * 4);

        // move the data
        memcpy(VIDEO_BUFFER, screen_off, buffer, scroll_off, SCREEN_WIDTH * 4);
    }
};

var plotPixelScroll = function(x,y,color) {
    // this function plots pixels into the scroll buffer
    // with our new virtual size of 640x100

    SCROLL_BUFFER_RGB_VIEW[(SCROLL_WIDTH*y)+x] = color;
};

var drawTerrain = function() {
    // this function draws the terrain into the scroll buffer
    // (which in this case is 640x100 pixels)
    var x, y=170, y1, index;

    // draw a few stars
    for(index=0; index<400; index++) {
        plotPixelScroll(Math.random() * 640 << 0, Math.random() * 170 << 0, 0xffffffff);
    }

    // draw some mountains
    for(x=0; x<640; x++) {
        // compute the offset
        y += -1 + (Math.random() * 3 << 0);

        // make sure the terrain stays within a boundary
        if(y>190) { y = 190; } else if(y<140) { y = 140; }

        // plot the dot in the double buffer
        plotPixelScroll(x,y,0xffff00ff);

        for(y1=y+1; y1<200; y1++){
            plotPixelScroll(x,y1,0xff0000ff);
        }
    }
};

// M A I N  /////////////////////////////////////////////////////////////
var main = function() {

    // allocate memory for the scrolling buffer
    SCROLL_BUFFER = new ArrayBuffer(SCROLL_WIDTH * SCROLL_HEIGHT * 4); // 4 byes per pixel (32bit)
    SCROLL_BUFFER_RGB_VIEW = new Uint32Array(SCROLL_BUFFER); // 32 bit aligned for quick 32bit RGB writes

    // draw the mountains
    drawTerrain();

    // show the initial view
    showViewPort(SCROLL_BUFFER, sx);

    // call main event loop
    window.postMessage("*", "*");
};

/**
 * this is the game loop
 */
window.mainLoop = function(event) {
    event.stopPropagation();
    // has the user pressed a key?
    if(Object.keys(pressed).length)
    {
        // test what key was pressed
        if(pressed[37]){ // move right but don't go too far
            sx -= 2;
            if(sx<0) {sx=0;}
        }

        if(pressed[39]) { // move left but don't go too far
            sx += 2;
            if(sx > 320) {sx=320;}
        }

        if(pressed[81]) {
            // the user is exiting
            console.log('quitting');
            done = 1;
        }

        // copy the viewport to the screen
        showViewPort(SCROLL_BUFFER,sx);
    }

    // update canvas buffer and write to screen
    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);

    /* end main loop body */
    if(!done)
    {window.postMessage("*", "*");}
    else
    {/* exit loop */ console.log("done");}

};

window.addEventListener("message", mainLoop, true);
main();
