/**
 * Project: Canvas Sprite Blitter
 * User: james
 * Date: 08/05/13
 * Time: 20:18
 */
"use strict";
var ImageProto = function() {

};

/**
 * imageFactory creates  'image' object
 * @return {image}
 */
var imageFactory = function() {
    return new Image();
};

/**
 * this function loads a image file into a image object
 * The seperate images can be grabbed from this object later
 */
var image_load = function(image, filename) {
    image.src = filename;
};



/**
 * this function deallocates the image
 */
var image_delete = function(image) {
    image = null;
};



/**
 * just copy the image buffer into the video buffer
 */
var image_show_buffer = function(image) {
    CTX.drawImage(image,0,0);
};



/**
 * this function grabs a bit map from the image frame buffer. it
 * uses the convention that the 320x200 pixel matrix is subdivided
 * into a smaller matrix of nxn adjacent squares
 */
var image_grab_bitmap = function(image, sprite, frame, grab_x, grab_y) {
    var x_off, y_off, x, y;
    // var sprite_data -- typed array?
};