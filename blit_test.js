/**
 * User: james
 * Date: 17/06/16
 */
var image_buf = PIX.SURF_NewSurface(); // pixelf surface object (buffer)
var counter   = 0;
var dirX      = 5;
var dirY      = 5;
var quit      = 0;
var keystate;  // keyboard shizzle
var mouseLoc;  // mouse shizzle
var src, dest; // source and destination rect we hold up here for now.

// initiate pixelf and check for errors
if(PIX.SURF_Init(document.getElementById('canvas'),1400,750 ) != true)
{
    console.log('unable to initialise pix-elf' + PIX.err());
}

// load 100 images from slices folder
for(var i=0; i<99; i++) {
  PIX.IMG_QueueImage(image_buf,  "slices/Image"+i+".jpg");     // this goes into a loading list
}

var onImagesLoaded = function() {
    gameOn();
    // this doesn't happen until the image has finished successfully loading
};

PIX.IMG_LoadImages(onImagesLoaded); // load images and call back. probably this should be done with some kind of promise thing.

var gameOn = function() {

    src  = {x:0,y:0,w:1350, h:750};
    dest = {x:0,y:0};

    PIX.SURF_BlitCanvas(image_buf.surface, src, dest);

    requestAnimFrame(mainLoop);
};

var mainLoop = function(){
      /* Grab a snapshot of the keyboard. */
    keystate = PIX.KEY_GetKeyState();
    if (keystate[81] || keystate[27]) quit = 1;  // 'q' or 'esc'

console.log(keystate);

    mouseLoc = PIX.MOUSE_GetMouseLoc();

    if(!quit){

    dirX = 0; dirY = 0;
    if (keystate[37]) dirX = -5;       /* left arrow */
    if (keystate[39]) dirX = 5;       /* right arrow */
    if (keystate[38]) dirY = -5;  /* up arrow */
    if (keystate[40]) dirY = 5; /* down arrow */


       // if(mouseLoc.x < 200)
       // {
       //  dirX = -5;
       // }
       // else if(mouseLoc.x > 1150)
       // {
       //  dirX = 5;
       // }
       // else
       // {
       //  dirX = 0;
       // }

       // if(mouseLoc.y < 100)
       // {
       //  dirY = -5;
       // }
       // else if(mouseLoc.y > 700)
       // {
       //  dirY = 5;
       // }
       // else
       // {
       //  dirY = 0;
       // }

        var y = src.y + dirY;
        var x = src.x + dirX;



        if (y > 9126 || y < 0)  { dirY = 0; y = ((y / 9125) >> 0) * 9125}
        if (x > 24462 || x < 0) { dirX = 0; x = ((x / 24462) >> 0) * 24462}

        // console.log([x,y]);

        src = {
            x:x,
            y:y,
            w:1350,
            h:750
        };  // width and height are constant, they are the screenfull

        dest = {
            x:dest.x - dirX,
            y:dest.y - dirY
        };

        PIX.SURF_BlitCanvas(image_buf.surface, src, dest);
        requestAnimFrame(mainLoop);
    } else {
        console.log("Quitted at "+counter);
        // free up memory allocated to the bitmap
        PIX.SURF_FreeSurface(image_buf);
    }

}

