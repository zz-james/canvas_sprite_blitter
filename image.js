/**
 * Project: Canvas Sprite Blitter
 * User: James
 * Date: 08/05/13
 * Time: 20:18
 */
"use strict";







// GRAPH4.H

// D E F I N E S  ////////////////////////////////////////////////////////////

var MAX_SPRITE_FRAMES = 24;
var SPRITE_DEAD = 0;
var SPRITE_ALIVE = 1;
var SPRITE_DYING = 2;

// S T R U C T U R E S ///////////////////////////////////////////////////////

/*
typedef struct sprite_typ
{
    int x,y;            // position of sprite
    int x_old,y_old;    // old position of sprite
    int width,height;   // dimensions of sprite in pixels
    int anim_clock;     // the animation clock
    int anim_speed;     // the animation speed
    int motion_speed;   // the motion speed
    int motion_clock;   // the motion clock

    char far *frames[MAX_SPRITE_FRAMES]; // array of pointers to the images
    int curr_frame;                      // current frame being displayed
    int num_frames;                      // total number of frames
    int state;                           // state of sprite, alive, dead...
    char far *background;                // whats under the sprite
    void far *extra_data;                // an auxialliary pointer to more
    // data if needed
} sprite, *sprite_ptr;
*/

// G L O B A L S  ////////////////////////////////////////////////////////////

var SPRITE_WIDTH;
var SPRITE_HEIGHT;

// reusable dom objects
var DOM_IMAGE_OBJECT = new Image();
var OFFSCREEN_CANVAS = document.createElement('canvas');
var OFFSCREEN_CONTEXT = OFFSCREEN_CANVAS.getContext('2d');

OFFSCREEN_CANVAS.width = SCREEN_WIDTH;
OFFSCREEN_CANVAS.height = SCREEN_HEIGHT;

// F U N C T I O N S ///////////////////////////////////////////////////////


/**
 * this function allocates the buffer region needed to load a pcx file
 * wrapped in an object (which is probably unneccesary!!
 */
var pictureFactory = function() {
    var buffer = new ArrayBuffer(SCREEN_WIDTH * SCREEN_HEIGHT * 4);
    return {
        filename : 'UNINTIALISED',
        cnv_view : new Uint8ClampedArray(buffer), // 8 bit aligned for assigning to canvas
        rgb_view : new Uint32Array(buffer)
    };
};


/**
 * this function loads a png file into a picture structure, the actual image
 * data for the png file is decompressed and expanded into a secondary buffer
 * within the picture structure, the separate images can be grabbed from this
 * buffer later.
 * remember image loading is asynch and so we need a handler & to jump back in to main.
 *
 * @param picture
 * @param filename
 * @param callback
 */
var pictureLoad = function( picture, filename, callback ) {
    DOM_IMAGE_OBJECT.onload = function(e) {
       putImageDataInBuffer(picture);
       callback();
    };

    DOM_IMAGE_OBJECT.src = filename;
    picture.filename = filename;
};

var putImageDataInBuffer = function(picture) {
    OFFSCREEN_CONTEXT.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    OFFSCREEN_CONTEXT.drawImage(DOM_IMAGE_OBJECT,0,0);
    var imageData = OFFSCREEN_CONTEXT.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    picture.cnv_view.set(imageData.data); // data is a Uint8ClampedArray
};

var pictureShowBuffer = function(picture) {

    CANVAS_VIEW.set(picture.cnv_view);

    IMAGE_DATA.data.set(CANVAS_VIEW);
    CTX.putImageData(IMAGE_DATA, 0, 0);


};

var pictureDelete = function(picture) {
    picture.buffer = null;
};


/**
 * This function initializes a sprite with the sent data
 *
 * @param x
 * @param y
 * @param ac
 * @param as
 * @param mc
 * @param ms
 */
var spriteFactory = function(x,y,ac,as,mc,ms)
{
    var index, sprite;
    sprite = {
        x            : x,
        y            : y,
        x_old        : x,
        y_old        : y,
        width        : SPRITE_WIDTH,
        height       : SPRITE_HEIGHT,
        anim_clock   : ac,
        anim_speed   : as,
        motion_clock : mc,
        motion_speed : ms,
        curr_frame   : 0,
        state        : SPRITE_DEAD,
        num_frames   : 0,
        background   : new Uint32Array(SPRITE_WIDTH * SPRITE_HEIGHT),
        frames: new Array()
    };

    return sprite;
};


/**
 * This function will grap a bitmap from the pcx frame buffer. it uses the
 * convention that the 320x200 pixel matrix is sub divided into a smaller
 * matrix of nxn adjacent squares
 * @param picture
 * @param sprite
 * @param frame
 * @param grab_x
 * @param grab_y
 */
var pictureGrabBitmap = function(picture, sprite, frame, grab_x, grab_y) {

    var x_off,y_off, x,y;
    var sprite_data; // just a useful alias to array members

    // first allocate the memory for the sprite in the sprite structure
    sprite.frames[frame] = new Uint32Array(SPRITE_WIDTH * SPRITE_HEIGHT);

    // create an alias to the sprite frame for ease of access
    var sprite_data = sprite.frames[frame];

    // now load the sprite data into the sprite frame array from the picture
    x_off = (SPRITE_WIDTH+1)  * grab_x + 1;
    y_off = (SPRITE_HEIGHT+1) * grab_y + 1;

    // compute starting y address
    y_off = y_off * SCREEN_WIDTH;

    for (y=0; y<SPRITE_HEIGHT; y++)
    {
        for (x=0; x<SPRITE_WIDTH; x++)
        {
            // get the next byte of current row and place into next position in
            // sprite frame data buffer

            sprite_data[y*SPRITE_WIDTH + x] = picture.rgb_view[y_off + x_off + x];
        }
        // move to next line of picture buffer
        y_off+=320;
    }
    // increment number of frames
    sprite.num_frames++;
};

/**
 * this function draws a sprite on the screen row by row very quickly
 * @param sprite
 */
var drawSprite = function(sprite) {

    var work_sprite;
    var work_offset=0,offset,x,y;
    var data;

    // get a pointer to pixel buffer
    work_sprite = sprite.frames[sprite.curr_frame];

    // compute offset of sprite in video buffer
    offset = (sprite.y * 320) + sprite.x;

    //memcpy(dst, dstOffset, src, srcOffset, length)

    for (y=0; y<SPRITE_HEIGHT; y++)
    {
        for (x=0; x<SPRITE_WIDTH; x++)
        {
            // test for transparent pixel i.e. 0, if not transparent then draw
            data=work_sprite[work_offset+x];
            if (data) {
                RGB_VIEW[offset+x] = data;
            }
        }

        // move to next line in video buffer and in sprite bitmap buffer
        offset      += SCREEN_WIDTH;
        work_offset += SPRITE_WIDTH;
    }
};


/**
 * this function scans the background behind a sprite so that when the sprite
 * is drawn, the background isn't obliterated
 * @param sprite
 */
var behindSprite = function(sprite) {

    var work_back;
    var work_offset=0,offset,y;

    // alias a pointer to sprite background for ease of access
    work_back = sprite.background.buffer;

    // compute offset of background in video buffer
    offset = (sprite.y * 320) + sprite.x;

    for (y=0; y<SPRITE_HEIGHT; y++)
    {
        // copy the next row out off screen buffer into sprite background buffer

        memcpy(work_back, work_offset, VIDEO_BUFFER, offset ,SPRITE_WIDTH);

        // move to next line in video buffer and in sprite background buffer

        offset      += SCREEN_WIDTH;
        work_offset += SPRITE_WIDTH;

    } // end for y
};

/**
 * this function replaces the background that was saved from where a sprite
 * was going to be placed
 * @param sprite
 */
var eraseSprite = function(sprite) {

    //replace the background that was behind the sprite
    var work_back;
    var work_offset=0,offset,y;

    // alias a pointer to sprite background for ease of access
    work_back = sprite.background.buffer;

    // compute offset of background in video buffer
    offset = (sprite.y * 320) + sprite.x;

    for (y=0; y<SPRITE_HEIGHT; y++)
    {
        // copy the next row out off screen buffer into sprite background buffer
        memcpy(VIDEO_BUFFER,offset,work_back,work_offset,SPRITE_WIDTH);

        // move to next line in video buffer and in sprite background buffer
        offset      += SCREEN_WIDTH;
        work_offset += SPRITE_WIDTH;
    }
};

var memcpy = function(dst, dstOffset, src, srcOffset, length) {
    var dstU32 = new Uint32Array(dst, dstOffset, length);
    var srcU32 = new Uint32Array(src, srcOffset, length);
    dstU32.set(srcU32);
};

var cls = function() {
    CTX.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
};

/*

unsigned char Get_Pixel(int x,int y);

int Sprite_Collide(sprite_ptr sprite_1, sprite_ptr sprite_2);


/* all canvas pixel data is a uint8clamped array */


// to get an images data you must
// use drawimage to put it onto a canvas
// then use getImageData to get the pixels.




/**
 * this function grabs a bit map from the image frame buffer. it
 * uses the convention that the 320x200 pixel matrix is subdivided
 * into a smaller matrix of nxn adjacent squares
 */

/*
var image_grab_bitmap = function(image, sprite, frame, grab_x, grab_y) {
    var x_off, y_off, x, y;
    // var sprite_data -- typed array?
};
    */