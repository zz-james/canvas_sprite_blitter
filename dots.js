/**
 * Project: Canvas Sprite Blitter
 * User: james
 * Date: 06/05/13
 * Time: 18:41
 */
"use strict";

var notdone = 1, index = 0;

window.mainloop = function(event) /* randomly plot 50000 pixels. */
{
    event.stopPropagation();
    /* main loop body */
    var x = Math.random() * SCREEN_WIDTH << 0;
    var y = Math.random() * SCREEN_HEIGHT << 0;
    var color = 0xffffffff;//Math.random() * NUM_COLORS << 0;
    plotPixelFast(x,y,color);

    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);
    index++;
    /* end main loop body */
    if(index != 10000)
    { window.postMessage("*", "*"); }
    else
    {/* exit loop */ console.log("done");}
};

window.addEventListener("message", mainloop, true);
window.postMessage("*", "*");