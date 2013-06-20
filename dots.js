/**
 * User: james
 * Date: 29/04/13
 * Time: 17:14
 */
"use strict";

var NUM_COLORS = 256;        /* number of colors in mode 0x13 */

var x,y,color;
var i = 0;
var start = (Date.now());

var mainloop = function() /* randomly plot 50000 pixels. */
{
    x = Math.random() * SCREEN_WIDTH << 0;
    y = Math.random() * SCREEN_HEIGHT << 0;
    color=Math.random() * NUM_COLORS << 0;
    plotPixelFast(x,y,0xff0000ff);

    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);
    i++;
    if(i < 50000)
    { requestAnimFrame(mainloop); }
    else
    {var end = (Date.now()); console.log(end-start);}
};

requestAnimFrame(mainloop);
