/**
 * Project:
 * User: james
 * Date: 11/06/13
 * Time: 14:42
 */
"use strict";

var TILE_SHEET;
var TILE_MAP = new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,4,4,1,2,3,4,4,4,0,0,0,0,0,0,0,0,0,0,0,4,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,5,4,4,4,5,4,4,4,4,0,0,0,0,0,0,4,6,4,0,0,0,0,4,5,4,4,1,2,2,3,4,4,1,2,3,4,4,0,0,0,0,0,0,4,6,4,5,5,5,4,6,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,1,2,2,3,4,4,4,4,4,6,4,4,4,4,4,6,4,4,4,5,4,5,4,4,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,4,4,4,4,4,4,6,4,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,2,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0]);


/**
 * This routine draws the parallax layers. The order of the
 * functions determines the z-ordering of the layers
 */
var drawLayers = function()
{
    //opaqueBlt(backGroundBmp,0,100,background);
    drawTiles(position,0);
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

    drawLayers();
};


// go!!
main();