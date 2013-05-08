/**
 * Project: Canvas Sprite Blitter
 * User: james
 * Date: 06/05/13
 * Time: 20:31
 */
"use strict";


/**
 operatioons we'd like to perform on sprites

 - create the sprite
 - load in a predrawn image
 - grab background under the sprite
 - replace the background
 - draw the sprite itself
 - erase the sprite
 - scale the sprite
 - rotate the sprite
 - test for collisions
 - delete the sprite from memory


 1. erase the sprite by restoring the background that was under it
 2. move and animate the sprite
 3. scan the background where the sprite will be placed so that is can be replaced
 4. draw the sprite
 5. go to 1

 what do we need to know/track
 - where the spite is
 - the sprite's size
 - the current frame of animation
 - the data area for the bitmaps
 - the area to hold the background under the sprite
 - the state of the sprite
 - some timing information that enables us to move and animate the sprite in more realistic ways

 */

var sprite = {
    x:0,    // the position of the sprite
    y:0,
    x_old:0,   // old positions of the sprite
    y_old:0,
    width:0,     // dimensions of the sprite
    height:0,
    anim_clock:0,    // the animation clock
    anim_speed:0,     // the animation speed
    motion_clock:0,    // the motion clock
    motion_speed:0,     // the motion speed

    // this will need to change it needs to be an array of array pointers
    frames: new ArrayBuffer(MAX_SPRITE_FRAMES), // an array pointer to the images
    current_frame:0,   // the current frame being displayed
    num_frames: 0, // the total number of frames
    state: 0, // the state of the sprite (alive, dead etc)
    background:  new ArrayBuffer(??), // pointer to what is under the sprite
    extradata : "unknown"
};


