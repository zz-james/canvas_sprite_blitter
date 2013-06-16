/**
 * Project: Canvas Sprite Blitter
 * User: james
 * Date: 06/05/13
 * Time: 20:31
 */
"use strict";

// G L O B A L S  ////////////////////////////////////////////////////////////

var NUM_TILES = 17;
var TILE_COLS = 66;
var TILE_ROWS = 6;

var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

var TILES_TOTAL = (TILE_COLS * TILE_ROWS);
var TILES_PER_ROW = (SCREEN_WIDTH / TILE_WIDTH);
var SHIFT = 5; // used to shift 32, the tile size

var TILES = []; // up to NUM_TILES+1 (pointers to bitmap buffers)
var TILE_MAP; // = new Uint8Array(TILES_TOTAL);

var TILE_WALKABLE = 0;
var TILE_WALL = 1;
var TILE_LADDER = 2;


var position = 0;

/**
 * This function initializes a tile with the sent data
 *
 * @param state - whether tile is (initially) walkable, ladder etc
 * @return tile object (struct)
 */
var tileFactory = function(state)
{
    var index, tile;
    tile = {
        width        : TILE_WIDTH,
        height       : TILE_HEIGHT,
        curr_frame   : 0,
        state        : state,
        num_frames   : NUM_TILES,
        frames: new Array()
    };

    return tile;
};


/**
 * This function will grab a bitmap from the picture object buffer. it uses the
 * convention that the 320x200 pixel matrix is sub divided into a smaller
 * matrix of nxn adjacent squares of size TILE_HEIGHT X TILE_WIDTH
 * @param picture - picture object
 * @param tile - tile object
 * @param frame - index of 'frames' in the tile object
 * @param grab_x - x point in pixels to start grabbing from the picture buffer
 * @param grab_y - y point in pixels to start grabbing from the picture buffer
 */
var tileGrabBitmap = function(picture, tile, frame, grab_x, grab_y) {

    var x_off,y_off, x,y;
    var tile_data; // just a useful alias to array members

    // first allocate the memory for the tile in the tile structure
    tile.frames[frame] = new Uint32Array(TILE_WIDTH * TILE_HEIGHT);

    // create an alias to the tile frame for ease of access
    var tile_data = tile.frames[frame];

    // now load the sprite data into the sprite frame array from the picture
    x_off = (TILE_WIDTH+1)  * grab_x + 1;
    y_off = (TILE_HEIGHT+1) * grab_y + 1;

    // compute starting y address
    y_off = y_off * TILE_WIDTH;

    for (y=0; y<TILE_HEIGHT; y++)
    {
        for (x=0; x<TILE_WIDTH; x++)
        {
            // get the next byte of current row and place into next position in
            // tile frame data buffer
            tile_data[y*TILE_WIDTH + x] = picture.rgb_view[y_off + x_off + x];
        }
        // move to next line of picture buffer
        y_off+=320;
    }
    // increment number of frames
    tile.num_frames++;
};

/**
 * creates typed array of Uint8s
 * assigned to TILE_MAP
 */
var readTileMap = function() {

};


/**
 * draws a screen full of tiles.
 * @param virtualX is the left corner x location within the 'virtual screen.
 * @param startY is the row to begin drawing from
 */
var drawTiles = function(virtualX, startY) {
    var counter, xcoord, index, offset, row, limit;

    // get index of first visible tile
    index = virtualX >> SHIFT;			    // 0
    offset = virtualX - (index << SHIFT);	// virtualx
    limit = TILES_PER_ROW;			        // 10

    if(offset == 0){limit--;}			    // limit now 9.

    for(row = startY; row < startY + (TILE_HEIGHT * TILE_ROWS); row += TILE_HEIGHT)   // looping ROWS i.e. vertical
    {
        xcoord = TILE_WIDTH - offset;

        // draw the leftmost tile
        // of the current row.
        // may be a partial tile
        drawTile(TILES.frames[TILE_MAP[index]].buffer, 0, row, offset, TILE_WIDTH-offset);

        // draw the rest of the tiles in the middle
        for(counter=index+1; counter<index+limit; counter++)
        {
            // draw the next tile on the current row; always a full tile.
            drawTile(TILES.frames[TILE_MAP[counter]].buffer, xcoord, row, 0, TILE_WIDTH);
            xcoord += TILE_WIDTH;
        }

        // draw right-most tile of the current row
        // (may be a partial tile)
        drawTile(TILES.frames[TILE_MAP[counter]].buffer, xcoord, row, 0, offset);
        index += TILE_COLS;
    }
};


/**
 * draws a bit map tile in a memory buffer.
 * can draw portions of the tile smaller.
 * @param offset - defines the starting column within the tile.
 * @param width - defines the length of the tile to draw.
 */
var drawTile = function(bmp, x, y, offset, width)
{

 var counter;

 //if(bmp == NULL) {return;} 			// don't draw empty tiles
 var destOffset = 0; 	// calc offset in memory buf.
 var srcOffest = offset; 					// get bit map to draw

 // draw each scanline of the bit map
 for(counter=0;counter<TILE_HEIGHT;counter++)
 {
 memcpy(VIDEO_BUFFER, (y * (SCREEN_WIDTH * 4) + (x * 4) + destOffset), bmp, ((offset *4) + (srcOffest * 4)), width * 4);		// copy from bitmap to membuf
 destOffset += SCREEN_WIDTH;
 srcOffest += TILE_WIDTH;
 }

};

