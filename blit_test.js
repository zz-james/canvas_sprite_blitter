/**
 * User: james
 * Date: 17/06/16
 */
// var screen;                            // pixelf surface object (main)
var image_buf = PIX.SURF_NewSurface(); // pixelf surface object (buffer)
var src, dest;                         // pixelf rect objects
var quit = 0;
var keystate;   // keyboard shizzle
var src, dest; // source and destination rect we hold up here for now.
var counter  = 0;
var dirX = 5;
var dirY = 5;

// initiate pixelf and check for errors
if(PIX.SURF_Init(document.getElementById('canvas'),1400,750 ) != true)
{
    console.log('unable to initialise pix-elf' + PIX.err());
}

// screen = PIX.SURF_GetMainSurface();
for(var i=0; i<99; i++) {
  PIX.IMG_QueueImage(image_buf,  "slices/Image"+i+".jpg");     // this goes into a loading list
}

var onImagesLoaded = function() {
    gameOn();
    // this doesn't happen until the image has finished successfully loading
};

PIX.IMG_LoadImages(onImagesLoaded);

var gameOn = function() {

    src  = {x:0,y:0,w:1350, h:750};
    dest = {x:0,y:0};

    PIX.SURF_BlitCanvas(image_buf.surface, src, dest);

    requestAnimFrame(mainLoop);

    // // free up memory allocated to the bitmap
    // PIX.SURF_FreeSurface(image_buf);
};

var mainLoop = function(){
      /* Grab a snapshot of the keyboard. */
    keystate = PIX.KEY_GetKeyState();
    if (keystate[81] || keystate[27]) quit = 1;  // 'q' or 'esc'

    if(!quit){
        //console.log('running');

        var y = src.y + dirY;
        var x = src.x + dirX;

        if (y > 9126 || y < 0) { dirY = dirY * -1; }
        if (x > 24462 || x < 0) { dirX = dirX * -1; }

        src  = { x:x,  y:y, w:1350, h:750 };
        dest = { x:dest.x - dirX, y:dest.y - dirY };

        PIX.SURF_BlitCanvas(image_buf.surface, src, dest);
        requestAnimFrame(mainLoop);
    } else {
        console.log("Quitted at "+counter);
    }

}

