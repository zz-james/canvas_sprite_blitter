/**
 * draw star field
 * User: james
 * Date: 05/05/13
 * Time: 10:55
 * To change this template use File | Settings | File Templates.
 */
"use strict";

var NUM_STARS = 275, SCREEN_WIDTH = 960, SCREEN_HEIGHT = 512;
var PLANE_1 = 1, PLANE_2 = 2, PLANE_3 = 3;
//@int
var starFirst = 1;

/**
 * starFactory maxes a star object
 * @returns {{x: number, y: number, plane: number, color: number}}
 */
var starFactory = function(){
    return {x: 0,  y: 0, plane: 0, color: 0xffffffff}
};



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
var stars = arrayFill(starFactory,NUM_STARS);

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

initStars();

var mainloop = function()
{
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

    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);

    /* end main loop body */
    if(notdone)
    { requestAnimFrame(mainloop); }
    else
    {/* exit loop */ console.log("done");}
};

requestAnimFrame(mainloop);