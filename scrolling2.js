/**
 * Project:
 * User: james
 * Date: 11/06/13
 * Time: 14:42
 */
"use strict";

var BACKGROUND_WIDTH = 320;
var BG;					    // bitmap loader object
var BACKGROUND_BUFFER;	    // pointer to background bit map buffer
var BACK_POS = 300;			// left-half position in background
var done = 0;

/**
 * this routine draws a scrolling bit map layer
 * @param scrollSplit (int) defines the column that splits the bit map into two halves
 */
var opaqueBlt = function(scrollSplit)
{

    // PROBLEM WITH RANGE 290 - 320       // 3840 - 1280  = 2560

    var dstOffset = 0;
    var srcOffset = 0;
    scrollSplit = scrollSplit * 4; // we're in 4 byte per pixel world

    for(var counter = 0;  counter < SCREEN_HEIGHT;  counter++)
    {
        // draw the left bit map half in the right half of the memory buffer
        memcpy(VIDEO_BUFFER, (dstOffset * 4) + scrollSplit , BACKGROUND_BUFFER , (srcOffset * 4) , (SCREEN_WIDTH * 4) - scrollSplit );

        // draw the right bit map half in the left half of the memory buffer
        memcpy(VIDEO_BUFFER, (dstOffset * 4) , BACKGROUND_BUFFER, (srcOffset * 4) + (SCREEN_WIDTH * 4) - scrollSplit  , scrollSplit );

        srcOffset += SCREEN_WIDTH;
        dstOffset += SCREEN_WIDTH;
    }
};

/**
 * this function draws the parallax layers. The order of
 * the functions determines the z-ordering of the layers
 */
var drawLayers = function()
{
    opaqueBlt(BACK_POS);
};




var main = function()
{
    //  load bitmap resources
    BG = pictureFactory();
    pictureLoad(BG, "background.png", returnToMain1 );

};

var returnToMain1 = function()
{
    // save pointer to bitmap
    BACKGROUND_BUFFER = BG.rgb_view.buffer;
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
        if(pressed[37]){
            BACK_POS -= 1;						// scroll BACK_POS left
                                                // two pixels
            if(BACK_POS < 1) 	   				// did we read the end??
                BACK_POS += SCREEN_WIDTH;		// yes, wrap around
        }

        if(pressed[39]) {
            BACK_POS += 1;						// scroll BACK_POS right
                                                // two pixels
            if(BACK_POS > SCREEN_WIDTH - 1)		// reach end??
                BACK_POS -= SCREEN_WIDTH;		// yes, wrap around
        }

        if(pressed[81]) {
            // the user is exiting
            console.log('quitting');
            done = 1;
        }
    }

    drawLayers(); // draw parallax layer(s) in RGB_VIEW

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