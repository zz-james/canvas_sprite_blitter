/**
 * Project:
 * User: james
 * Date: 11/06/13
 * Time: 14:42
 */
"use strict";

var BACKGROUND_WIDTH = 320;
var byte_BACKGROUND_WIDTH = BACKGROUND_WIDTH * 4; // convert background width into bytes
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

    var dstOffset = 0;
    var srcOffset = 0;
    scrollSplit = scrollSplit * 4; // convert scrollSplit to bytes

    for(var counter = 0;  counter < SCREEN_HEIGHT;  counter++)
    {
        // draw the left bit map half in the right half of the memory buffer
        memcpy(VIDEO_BUFFER, scrollSplit + dstOffset , BACKGROUND_BUFFER , srcOffset , (byte_SCREEN_WIDTH - scrollSplit) );

        // draw the right bit map half in the left half of the memory buffer
        memcpy(VIDEO_BUFFER, dstOffset , BACKGROUND_BUFFER, (byte_SCREEN_WIDTH - scrollSplit) + srcOffset  , scrollSplit );

        srcOffset += byte_BACKGROUND_WIDTH;
        dstOffset += byte_SCREEN_WIDTH;
    }
};













