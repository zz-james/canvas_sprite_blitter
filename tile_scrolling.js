/**
 * Project:
 * User: james
 * Date: 11/06/13
 * Time: 14:42
 */
"use strict";

var TILE_SHEET;
var TILE_MAP = new Uint8Array(
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,4,4,1,2,3,4,4,4,0,0,0,0,0,0,0,0,0,0,0,4,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,5,4,4,4,5,4,4,4,4,0,0,0,0,0,0,4,6,4,0,0,0,0,4,5,4,4,1,2,2,3,4,4,1,2,3,4,4,0,0,0,0,0,0,4,6,4,5,5,5,4,6,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,1,2,2,3,4,4,4,4,4,6,4,4,4,4,4,6,4,4,4,5,4,5,4,4,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,4,4,4,4,4,4,6,4,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0
    ]
    );
var NUM_TILES = 1;

var TILE_COLS = 132;
var TILE_ROWS = 3;

var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;


var POS; // the position of the tile layer
var done = 0;
/**
 * This routine draws the parallax layers. The order of the
 * functions determines the z-ordering of the layers
 */
var drawLayers = function()
{
    opaqueBlt(BACK_POS);
    drawTiles(POS,104);
};



// M A I N ////////////////////////////////////////////////////////////////////

var main = function()
{

    // load in background cells
    TILE_SHEET = pictureFactory();    // now background.buffer exists
    pictureLoad(TILE_SHEET, "ROBOPUNK.png", returnToMain1 );

}; // end main

var returnToMain1 = function()
{
    var index;

    // create a object to hold the tile images
    TILES = tileFactory();

    // extract background cells
    for (index=0; index<8; index++)
    {
        tileGrabBitmap(TILE_SHEET,TILES,index,index,1);
    } // end for index

    // free picture object
    pictureDelete(TILE_SHEET);

    // readTileMap(); done - will have to look into generalising this
    // readTiles(); done -- will have to look into generalising this



    BG = pictureFactory();
    pictureLoad(BG, "background.png", returnToMain2 );


};

var returnToMain2 = function()
{
    // save pointer to bitmap
    BACKGROUND_BUFFER = BG.rgb_view.buffer;
    drawLayers();
    //Show Buffer
    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);

    // call main event loop
    requestAnimFrame(mainLoop);

};

/**
 * this is the game loop
 */
var mainLoop = function() {

    // has the user pressed a key?
    if(Object.keys(pressed).length)
    {
        // test what key was pressed
        if(pressed[39]){
            POS  += 8;
            if(POS > TOTAL_SCROLL)
            {
                POS = TOTAL_SCROLL;
            } else {
            BACK_POS -= 1;						// scroll BACK_POS left
            // one pixel
            if(BACK_POS < 1) 	   				// did we read the end??
                BACK_POS += SCREEN_WIDTH;		// yes, wrap around
            }
        }

        if(pressed[37]) {
            POS  -= 8;
            if(POS < 0)
            {
                POS = 0;
            } else {
            BACK_POS += 1;						// scroll BACK_POS right
            // one pixel
            if(BACK_POS > SCREEN_WIDTH - 1)		// reach end??
                BACK_POS -= SCREEN_WIDTH;		// yes, wrap around
            }
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
    {requestAnimFrame(mainLoop);}
    else
    {/* exit loop */ console.log("done");}

};

// go!!
main();