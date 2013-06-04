/**
 * Project:
 * User: james
 * Date: 04/06/13
 * Time: 17:12
 */
"use strict";

/**
 * a lot of global shit here that doesn't need to be
 * but haven't quite figured it out yet trying to keep
 * look up chain short as possible
 */

var TANK_SPEED = 4;
var PI = Math.PI;

var SPRITE_WIDTH = 16;
var SPRITE_HEIGHT = 16;

var index; // counters

// structures
var tank1;  // these guys will be sprite objects
var tank2;

var background;  // these guys will be picture objects
var objects;

// type information, useful if decide to port to LLJS or something.
// ints
var tank1Direction = 0;
var tank2Direction = 0;
var done = 0;

// floats
var dx, dy, angle;

/**
 * here's our start point.
 */
function main()
{
    // call asynch function to load background
    background = pictureFactory();    // now background.buffer exists
    pictureLoad(background, "OUTPOST.png", returnToMain1 );
}

var returnToMain1 = function()
{
    // show background and call asynch function to load objects image file (tank images)
    pictureShowBuffer(background);
    pictureDelete(background);
    objects = pictureFactory();
    pictureLoad(objects, "TANKS.png", returnToMain2 );
};

var returnToMain2 = function()
{
    // instance the player sprite object
    tank1 = spriteFactory(160, 150, 0, 0, 0, 0); // place tank1 at bottom of screen

    // grab all 16 images from the tanks picture
    for (index=0; index<16; index++)
    {
        pictureGrabBitmap(objects,tank1,index,index,0);
    }

    // instance the enemy sprite object
    tank2 = spriteFactory(160, 50, 0, 0, 0, 0);  // place tank2 (enemy) in top of screen

    // grab all 16 images from the tanks pcx picture
    for (index=0; index<16; index++)
    {
        pictureGrabBitmap(objects,tank2,index,index,1);
    }

    // kill the picture memory and buffers now that were done
    pictureDelete(objects);

    // S E C T I O N  3 //////////////////////////////////////////////////

    // point the tanks straight up
    tank1.curr_frame = tank1Direction;
    tank2.curr_frame = tank2Direction;

    // scan the background under tanks on first iteration
    behindSprite(tank1); // player
    behindSprite(tank2); // enemy

    // call main event loop
    window.postMessage("*", "*");
};


/**
 * this is the game loop
 * @param event
 */
window.mainLoop = function(event) {
    event.stopPropagation();
    // console.log('boom');

    // S E C T I O N  4 //////////////////////////////////////////////////

    // erase the players tank
    eraseSprite(tank1);
    // erase the enemy tank
    eraseSprite(tank2);

    // S E C T I O N  5 //////////////////////////////////////////////////

    // test if user wants to translate or rotate tank
    if(Object.keys(pressed).length)
    {

        // reset translation factors

        var dx= 0, dy=0;

        // test what key was pressed
        if(pressed[39]){ // rotate right
            // change direction of tank, make sure to wrap around
            if (++tank1Direction > 15)
                tank1Direction=0;
        }

        if(pressed[37]) { // rotate left
            // change direction of tank, make sure to wrap around
            if (--tank1Direction < 0)
                tank1Direction=15;
        }

        if(pressed[38]) {  // move foward
            // based on direction variable compute translation factors
            // compute angle in radians
            angle = (90+360-22.5*tank1Direction);

            // compute factors based on angle and speed
            dx = TANK_SPEED * Math.cos(PI*angle/180);
            dy = TANK_SPEED * Math.sin(PI*angle/180);
        }

        if(pressed[40]) { // move backward
            angle =  (90+360-22.5*tank1Direction);

            // compute factors based on angle and speed

            dx = TANK_SPEED * Math.cos(PI*angle/180);
            dy = TANK_SPEED * Math.sin(PI*angle/180);
        }


        if(pressed[81]) {
            // the user is exiting
            console.log('quitting');
            done = 1;
        }

        // S E C T I O N  6 //////////////////////////////////////////////////

        // do the translation

        tank1.x+=((dx+.5)<<0);
        tank1.y-=((dy+.5)<<0);

        // test if player bumped into edge, if so push him back
        if (tank1.x > (320-SPRITE_WIDTH) )
        {tank1.x = 0;}
        else
        if (tank1.x < 0 )
        {tank1.x = 319-SPRITE_WIDTH;}

        if (tank1.y > (200-SPRITE_HEIGHT) )
        {tank1.y = 0;}
        else
        if (tank1.y < 0 )
        {tank1.y = 199-SPRITE_HEIGHT;}


        // set the frame based on new direction
        tank1.curr_frame = tank1Direction;

    } // end if

// S E C T I O N  7 //////////////////////////////////////////////////

    // now move the enemy tank

    // test if it's time to turn

    if (Math.random() * 10 << 0 == 1)
    {

        // select direction to turn

        switch(Math.random() * 2 << 0)
        {

            case 0: // turn right
            {

                if (++tank2Direction > 15)
                    tank2Direction=0;

            } break;

            case 1: // turn left
            {

                if (--tank2Direction < 0)
                    tank2Direction=15;

            } break;

            default:break;

        } // end switch

        // set the frame based on new direction

        tank2.curr_frame = tank2Direction;

    } // end if

    // S E C T I O N  8 //////////////////////////////////////////////////
    // compute angle in radians

    angle =  (90+360-22.5*tank2Direction);

    // compute factors based on angle and speed
    dx = (TANK_SPEED+(Math.random() * 2 << 0)) * Math.cos(PI*angle/180);
    dy = (TANK_SPEED+(Math.random() * 2 << 0)) * Math.sin(PI*angle/180);

    // do the translation

    tank2.x+=((dx+.5)<<0);
    tank2.y-=((dy+.5)<<0);

    // S E C T I O N  9 //////////////////////////////////////////////////

    // test if enemy has hit an edge, if so wrap to other side

    if (tank2.x > (320-SPRITE_WIDTH) )
    {tank2.x = 0;}
    else
    if (tank2.x < 0 )
    {tank2.x = 319-SPRITE_WIDTH;}

    if (tank2.y > (200-SPRITE_HEIGHT) )
    {tank2.y = 0;}
    else
    if (tank2.y < 0 )
    {tank2.y = 199-SPRITE_HEIGHT;}

    // S E C T I O N  10 //////////////////////////////////////////////////

    // scan background under players tank
    behindSprite(tank1);

    // scan background under emeny tank
    behindSprite(tank2);

    // draw players tank
    drawSprite(tank1);

    // draw enemy tank
    drawSprite(tank2);

    // update canvas buffer and write to screen
    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);

    /* end main loop body */
    if(!done)
    { window.postMessage("*", "*"); }
    else
    {/* exit loop */ console.log("done");}

};

window.addEventListener("message", mainLoop, true);
main();
