/**
 * Project:
 * User: james
 * Date: 10/06/13
 * Time: 13:16
 */
"use strict";

// G L O B A L S  ////////////////////////////////////////////////////////////

var done = 0; // controls loop
var curr_screen=0; // whare are we?
var CELL_COLUMNS = 10; // size of cell based matrix
var CELL_ROWS = 6;

var CELL_WIDTH = 32;   // width of a cell in pixels
var CELL_HEIGHT = 32;  // height of a cell in pixels

var NUM_SCREENS = 6;   // number of screens in game

var ROBO_MOVE = 8;     // speed that the player moves at


var imagery;   // used to load in the imagery for robopunk


var back_cells,  // background cells sprite
    robopunk;    // robopunk

// use an array of 2-D matrices to hold the screens - define as null to begin with
var universe = [null,null,null,null,null,null];

// here is screen 1, note: it's 10x6 cells where each cell is represented
// by an ASCII character (makes it easier to draw each screen by hand).
// later the ASCII characters will be translated to bitmap id's so that
// the screen image can be drawn

var screen_1 = ["           ",
                "##*###*####",
                "###########",
                "<==========",
                "######:####",
                "####<=;=>##"];

var screen_2 = ["      ###  ",
                "      #:#  ",
                "#######:###",
                "=======;===",
                "#<==>######",
                "###########"];

var screen_3 = ["      ##<=>",
                "  #*##<==>#",
                "####*######",
                "===========",
                "###########",
                "###########"];

var screen_4 = ["###        ",
                "#<=>##     ",
                "####<==>###",
                "===========",
                "###########",
                "#<==>######"];

var screen_5 = ["   #<=>#   ",
                " #:#***#:##",
                "##:#####:##",
                "==;=====;==",
                "###########",
                "###########"];

var screen_6 = ["           ",
                "##         ",
                "#*#*##     ",
                "========>  ",
                "#########  ",
                "#########  "];

// F U N C T I O N S /////////////////////////////////////////////////////////


/**
 * this function fills in the double buffer with the sent color
 * @param color //rgb colour value i.e. 0xdeadbeef
 */
var fillDoubleBuffer = function(colour)
{
    var len = RGB_VIEW.length;
    for (var i=0; i<len; i++) {   // I want to do this without a for-loop
        RGB_VIEW[i] = colour; //;
    }

};

/**
 * this function draws a screen by using the data in the universe array
 * each element in the universe array is a 2-D matrix of cells, these
 * cells are ASCII characters that represent the requested bitmap that
 * should be placed in the cell location
 * @param screen - a string!
 */
var drawScreen = function(screen)
{
    var curr_row;
    var index_x, index_y, cell_number;

    // translation table for screen database used to convert the ASCII
    // characters into id numbers
    var back_cell_lookup =
   // SP ! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ?
     [ 0,0,0,4,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,7,1,2,3,0,
   //  @ A B C D E F G H I  J K L M  N O P Q R S T U  V W X Y Z [  \  ] ^ _
       0,0,0,0,0,0,0,0,0,0, 0,0,0,0, 0,0,0,0,0,0,0,0 ,0,0,0,0,0,0 ,0, 0,0,0];

    // clear out the double buffer
    fillDoubleBuffer(0x000000);

    // now draw the screen row by row
    for (index_y = 0; index_y<CELL_ROWS; index_y++)
    {
        // get the current row
        curr_row = screen[index_y];

        // do the row
        for (index_x = 0; index_x<CELL_COLUMNS; index_x++)
        {
            // extract cell out of data structure and blit it onto screen
            cell_number = back_cell_lookup[curr_row.charCodeAt(index_x)-32];

            // compute the screen x and y
            back_cells.x = index_x * SPRITE_WIDTH;
            back_cells.y = index_y * SPRITE_HEIGHT;

            // figure out which bitmap to draw
            back_cells.curr_frame = cell_number;

            // draw the bitmap
            drawSprite(back_cells);
        } // end for index_x
    } // end for index_y
}; // end drawScreen


// M A I N ////////////////////////////////////////////////////////////////////

var main = function()
{

    // load in background and animation cells
    imagery = pictureFactory();    // now background.buffer exists
    pictureLoad(imagery, "ROBOPUNK.png", returnToMain1 );
}; // end main

var returnToMain1 = function()
{
    var index;

    // initialize sprite size
    // declared in image.js
    SPRITE_WIDTH = 32;
    SPRITE_HEIGHT = 32;

    // create a sprite for robopunk
    robopunk = spriteFactory(0,0,0,0,0,0);

    // create a sprite to hold the background cells
    back_cells = spriteFactory(0,0,0,0,0,0);

    // extract animation cells for robopunk
    pictureGrabBitmap(imagery,robopunk,0,3,0);
    pictureGrabBitmap(imagery,robopunk,1,5,0);
    pictureGrabBitmap(imagery,robopunk,2,4,0);
    pictureGrabBitmap(imagery,robopunk,3,5,0);
    pictureGrabBitmap(imagery,robopunk,4,6,0);
    pictureGrabBitmap(imagery,robopunk,5,1,0);
    pictureGrabBitmap(imagery,robopunk,6,2,0);
    pictureGrabBitmap(imagery,robopunk,7,1,0);
    pictureGrabBitmap(imagery,robopunk,8,0,0);

    // extract background cells
    for (index=0; index<8; index++)
    {
        pictureGrabBitmap(imagery,back_cells,index,index,1);
    } // end for index

    // done with pcx file so obliterate it
    pictureDelete(imagery);

// S E C T I O N   4  /////////////////////////////////////////////////////////

    // set up universe data structure
    universe[0] = screen_1;
    universe[1] = screen_2;
    universe[2] = screen_3;
    universe[3] = screen_4;
    universe[4] = screen_5;
    universe[5] = screen_6;

    drawScreen(universe[curr_screen]);

    //Show Buffer
    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);

    // place robopunk
    robopunk.x = 160;
    robopunk.y = 74;
    robopunk.curr_frame = 0;

    // scan background under robopunk
    behindSprite(robopunk);
    // call main event loop
    window.postMessage("*", "*");
};


/**
* this is the game loop
* @param event
*/
window.mainLoop = function(event) {
    event.stopPropagation();

    // erase robopunk
    eraseSprite(robopunk);

    // test if user has hit key

    if(Object.keys(pressed).length)
    {
        // get the key
        if(pressed[37]){ // move the player left
            // advance the animation frame and move player
            // test if player is moving right, if so
            // show player turning before moving
            if (robopunk.curr_frame > 0 && robopunk.curr_frame < 5)
            {
                robopunk.curr_frame = 0;
            }
            else if (robopunk.curr_frame == 0 )
            {
                robopunk.curr_frame = 5;
            }
            else
            {
                // player is already in leftward motion so continue
                if (++robopunk.curr_frame > 8)
                {
                    robopunk.curr_frame = 5;
                }

                // move player to left
                robopunk.x-=ROBO_MOVE;

                // test if edge was hit
                if (robopunk.x < 8)
                {
                    // test if there is another screen to the left
                    if (curr_screen==0)
                    {
                        robopunk.x += ROBO_MOVE;
                    } // end if already at end of universe
                    else
                    {
                        // warp robopunk to other edge of screen
                        // and change screens
                        robopunk.x = SCREEN_WIDTH - 40;

                        // scroll to next screen to the left
                        curr_screen--;

                        drawScreen(universe[curr_screen]);

                    } // end else move a screen to the left

                } // end if hit left edge of screen

            } // end else
        }

        if(pressed[39]) { // move the player right
            // advance the animation frame and move player
            // test if player is moving left, if so
            // show player turning before moving

            if (robopunk.curr_frame > 4)
            {
                robopunk.curr_frame = 0;
            } // end if player going right
            else
            if (robopunk.curr_frame == 0 )
                robopunk.curr_frame =1;
            else
            {
                // player is already in rightward motion so continue

                if (++robopunk.curr_frame > 4)
                    robopunk.curr_frame = 1;

                // move player to right
                robopunk.x+=ROBO_MOVE;

                // test if edge was hit
                if (robopunk.x > SCREEN_WIDTH-40)
                {
                    // test if there is another screen to the left
                    if (curr_screen==5)
                    {
                        robopunk.x -= ROBO_MOVE;
                    } // end if already at end of universe
                    else
                    {
                        // warp robopunk to other edge of screen
                        // and change screens
                        robopunk.x = 8;

                        // scroll to next screen to the right
                        curr_screen++;

                        drawScreen(universe[curr_screen]);

                    } // end else move a screen to the right

                } // end if hit right edge of screen

            } // end else

        }

        if(pressed[81]) {
            // the user is exiting
            console.log('quitting');
            done = 1;
        }
    } // end if keyboard hit

    // scan background under robopunk

    behindSprite(robopunk);

    // draw him
    drawSprite(robopunk);

    //Show Buffer
    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);
    /* end main loop body */
    if(!done)
    { window.postMessage("*", "*"); }
    else
    {/* exit loop */ console.log("done");}


}; // end main loop

window.addEventListener("message", mainLoop, true);
main();

