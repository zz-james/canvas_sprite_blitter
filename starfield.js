/**
 * draw star field
 * User: james
 * Date: 05/05/13
 * Time: 10:55
 * To change this template use File | Settings | File Templates.
 */
"use strict";

/* DEFINES - COME BACK TO THESE
#define NUM_STARS   75
#define PLANE_1     1
#define PLANE 2     2
#define PLANE_3     3

#define SCREEN_WIDTH UINT 320
#define SCREEN_HEIGHT UINT 200
 */
var NUM_STARS = 275, SCREEN_WIDTH = 960, SCREEN_HEIGHT = 512;
var PLANE_1 = 1, PLANE_2 = 2, PLANE_3 = 3;

/* PROTOTYPES - NOT NECESSARY BUT HEY */

// blitChar(int xc, int yc, char c, int color, int trans_flag)
// plotPixel(int x, int y, color)
// initStars()
// delay() // probably don't need!


/* STRUCT MAKERS - USE VALUE ONLY OBJECTS */

// returns data strucure for a single star
// n.b. abandoned odd idea to use bitwise OR as a typehinter for jitter...
var star = function(){ return {x: 0,  y: 0, plane: 0, color: 0xffffffff} };

/* GLOBALS AND DOM SETUP SHIT */

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
       // console.log(y);
        RGBView[y * SCREEN_WIDTH + x] = color;
    }

} else {

    var plotPixelFast = function(x,y,color) {
        RGBView[y * SCREEN_WIDTH + x] = color;
    }

}
// ## end like an ifdef we generate 2 different functions for the endianneess ## //

//@int
var starFirst = 1;

/**
 * arrayFill returns an array full something you send.
 * still working out the deets.
 */
var arrayFill = function(object, length) {
    for (var i = 0, array=[]; i < length; i++) {
        array[i] = object(); // works with those struct making funcs only.
    }
    return array;
};

/* star stars[NUM_STARS];*/
var stars = arrayFill(star,NUM_STARS);

var velocity_1 = 2, velocity_2 = 4, velocity_3 = 6;

/**
 * this function initialises the star field
 */
var initStars = function() {
    var index;
    for(index=0;index<NUM_STARS;index++)
    {
        stars[index].x = Math.random() * SCREEN_WIDTH << 0;
        stars[index].y = Math.random() * 580 << 0; // why not.

        // decide which plane the star is in
        switch (Math.random() * 3 << 0)
        {
            case 0:   // plane 1 the farthest star plane
                // set the velocity and colour
                stars[index].plane = 1;
                stars[index].color = 0xffffffff;
                break;
            case 1:  // plane 2 the mid distance star plane
                stars[index].plane = 2;
                stars[index].color = 0xffffffff;
                break;
            case 2:  // plane 3 the nearest star plane
                stars[index].plane = 3;
                stars[index].color = 0xffffffff;
                break;
        }
    }
};

var notdone = 1, index;

var pressed={};
document.onkeydown=function(e){
    e = e || window.event;
    pressed[e.keyCode] = true;
};

document.onkeyup=function(e){
    e = e || window.event;
    delete pressed[e.keyCode];
};


initStars();

window.mainloop = function(event) /* randomly plot 50000 pixels. */
{
    event.stopPropagation();
    /* main loop body */

    if(Object.keys(pressed).length)
    {
        if(pressed[37]){
            // slow starfield down
            velocity_1 -= 1;
            velocity_2 -= 2;
            velocity_3 -= 3;
        }

        if(pressed[39]) {
            // increase the velocity of each plane
            velocity_1 += 1;
            velocity_2 += 2;
            velocity_3 += 3;
        }

        if(pressed[81]) {
            // the user is exciting
            console.log('quitting');
            notdone = 0;
        }
    }


    for(index=0;index<NUM_STARS;index++) {
        // erase the star
        plotPixelFast(stars[index].x,stars[index].y,0x000000ff);

        switch(stars[index].plane) {
            case PLANE_1:
                stars[index].x += velocity_1;
                break;
            case PLANE_2:
                stars[index].x += velocity_2;
                break;
            case PLANE_3:
                stars[index].x += velocity_3;
                break;
        }

        // test if star went offscreen
        if(stars[index].x > 959) // off the right edge?
            stars[index].x = (stars[index].x - 960);
        if(stars[index].x < 0) // off the left edge
            stars[index].x = (960 + stars[index].x); // wrap

        // draw the star at the new position
        plotPixelFast(stars[index].x, stars[index].y, stars[index].color);

    }

    imageData.data.set(canvasView);
    ctx.putImageData(imageData, 0, 0);

    /* end main loop body */
    if(notdone)
    { window.postMessage("*", "*"); }
    else
    {/* exit loop */ console.log("done");}
};

window.addEventListener("message", mainloop, true);
window.postMessage("*", "*");