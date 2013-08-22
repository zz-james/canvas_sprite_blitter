/**
 * Created with JetBrains WebStorm.
 * User: james
 * Date: 22/08/13
 * Time: 17:24
 * To change this template use File | Settings | File Templates.
 */
var screen; // pixelf surface objects (main)
var image_buf = PIX.SURF_NewSurface(); // pixelf surface object (buffer)
var image_buf2 = PIX.SURF_NewSurface();
var src, dest; // pixelf rect objects

// initiate pixelf and check for errors
if(PIX.SURF_Init(document.getElementById('canvas'),640,480 ) != true)
{
    console.log('unable to initialise pix-elf' + PIX.err());
}

screen = PIX.SURF_GetMainSurface();

PIX.IMG_QueueImage(image_buf, "OUTPOST.png");   // this goes into a loading list
PIX.IMG_QueueImage(image_buf2, "ROBOPUNK.png");   // this goes into a loading list

var onImagesLoaded = function() {
    gameOn();
    // this doesn't happen until the image has finished successfully loading
};

PIX.IMG_LoadImages(onImagesLoaded);

var gameOn = function() {

    src = {x:0,y:0,w:image_buf.surface.width, h:image_buf.surface.height};
    dest = {x:50,y:50,w:image_buf.surface.width, h:image_buf.surface.height};
    PIX.SURF_BlitCanvas(image_buf2.surface, src, dest);

    // free up memory allocated to the bitmap
    PIX.SURF_FreeSurface(image_buf);
};