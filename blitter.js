/**
 * Date: 29/04/13
 * Time: 15:28
 */

var canvas = document.getElementById('canvas');
var canvasHeight = canvas.height; // pick up these 2 from html
var canvasWidth = canvas.width;

var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

// treat the raw pixel data like a video buffer
var videoBuffer = new ArrayBuffer(imageData.data.length);

var buf8view = new Uint8ClampedArray(videoBuffer);
var pixels = new Uint32Array(videoBuffer);





// Determine whether Uint32 is little- or big-endian.
pixels[1] = 0x0a0b0c0d;

var isLittleEndian = true;
if (buf8view[4] === 0x0a && buf8view[5] === 0x0b && buf8view[6] === 0x0c &&
    buf8view[7] === 0x0d) {
    isLittleEndian = false;
}




if (isLittleEndian) {
    for (var y = 0; y < canvasHeight; ++y) {
        for (var x = 0; x < canvasWidth; ++x) {
            var value = x * y & 0xff;

            pixels[y * canvasWidth + x] =
                    (255   << 24) |    // alpha
                    (value << 16) |    // blue
                    (value <<  8) |    // green
                     value;            // red
        }
    }
} else {
    for (y = 0; y < canvasHeight; ++y) {
        for (x = 0; x < canvasWidth; ++x) {
            value = x * y & 0xff;

            pixels[y * canvasWidth + x] =
                    (value << 24) |    // red
                    (value << 16) |    // green
                    (value <<  8) |    // blue
                     255;              // alpha
        }
    }
}










imageData.data.set(buf8view);

ctx.putImageData(imageData, 0, 0);