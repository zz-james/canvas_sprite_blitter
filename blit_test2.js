/**
 * Created with JetBrains WebStorm.
 * User: james
 * Date: 22/08/13
 * Time: 17:29
 */
"use strict";

var NUM_PENGUINS = 10;
var MAX_SPEED = 6;
var w = 640;
var h = 480;

// x and y are screen positions, dx and dy are movement vectors
var makePenguin = function() { return {x:undefined,y:undefined,dx:undefined,dy:undefined}; };

// make and array of NUM_PENGUINS penguin objects
var penguins = [];

for(var i=0; i<NUM_PENGUINS; i++)
{
    penguins.push(makePenguin());
}

/* These are now global variables - for convenience */
var penguin = PIX.SURF_NewSurface();

/* This routine loops through the array of penguins and sets each to a
 random starting position and direction */
var init_penguins = function()
{
    var i;
    for (i = 0; i < NUM_PENGUINS; i++)
    {
        penguins[i].x = Math.random() * w  | 0;
        penguins[i].y = Math.random() * h  | 0;
        penguins[i].dx = (Math.random() * (MAX_SPEED * 2)) - MAX_SPEED  | 0;
        penguins[i].dy = (Math.random() * (MAX_SPEED * 2)) - MAX_SPEED  | 0;
    }
};

/* This routine moves each penguin by it's motion vector */
var move_penguins = function()
{
    var i;
    for (i = 0; i < NUM_PENGUINS; ++i)
    {
        // move the penguin by it's motion vector
        penguins[i].x += penguins[i].dx;
        penguins[i].y += penguins[i].dy;

        // turn the penguin around if it hits the edge of the screen
        if (penguins[i].x < 0 || penguins[i].x > w - 1)
            penguins[i].dx = -penguins[i].dx;
        if (penguins[i].y < 0 || penguins[i].y > h - 1)
            penguins[i].dy = -penguins[i].dy;
    }
};

/* This routine draws each penguin to the screen surface */
var draw_penguins = function()
{
    var i;
    var src = {}, dest = {};

    for (i = 0; i < NUM_PENGUINS; ++i)
    {
        src.x = 0;
        src.y = 0;
        src.w = penguin.surface.width;
        src.h = penguin.surface.height;

        /* The penguin's position specifies its centre. We subtract half of
         its width and height to get its upper left corner */

        dest.x = penguins[i].x - penguin.surface.width / 2;
        dest.y = penguins[i].y - penguin.surface.height / 2;
        dest.w = penguin.surface.width;
        dest.h = penguin.surface.height;
        PIX.SURF_DrawToCanvas(penguin.img, src, dest);
    }
}

var main = function()
{
    var background = PIX.SURF_NewSurface();
    var src = {}, dest = {};

    /* Initialise the SDL and error check */
    if(PIX.SURF_Init(document.getElementById('canvas'),640,480 ) != true)
    {
        console.log('unable to initialise pix-elf' + PIX.err());
        throw "something went wrong";
    }

    PIX.IMG_QueueImage(background, "nbackground.png");
    PIX.IMG_QueueImage(penguin, "smallpenguin.png");

    var onImagesLoaded = function() {
        var frames;
        /* Initialise the penguins position data */
        init_penguins();
        background = background.img; // cache this one pointer up from before

        // call main event loop
        requestAnimFrame(mainLoop);

    };

    PIX.IMG_LoadImages(onImagesLoaded);

    var mainLoop = function() {
        // draw the background image
        src.x = 0;
        src.y = 0;
        src.w = background.width;
        src.h = background.height;
        dest = src;
        PIX.SURF_DrawImage(background);

       // PIX.SURF_BlitCanvas(background, src, dest);

        // put the penguins on the screen
       draw_penguins();

        // Move the penguins for the next frame
        move_penguins();
        requestAnimFrame(mainLoop);

    };



    // Free the memory
   // PIX.SURF_FreeSurface(background);
   // PIX.SURF_FreeSurface(penguin);
};

main();
