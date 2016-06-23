/**
 * Project: Canvas Sprite Blitter
 * User: James
 * Date: 08/05/13
 * Time: 20:18
 */
"use strict";


var PIX = (function (my) {

    var _D_bufferDataContainer = [];  // array [{surface object, image object},...]
    var _numImgs;
    var _numLoadedImgs = 0;
    var _callback;
    var _D_tmpImg = new Image(); // just have this image pointer in heap

    my.IMG_QueueImage = function (surface, url) {
        //check if 'surface' is actually a valid
        if (!surface.hasOwnProperty('surface')) {
           throw "not a valid surface object please ensure the surface is properly initialised using SURF_NewSurface";
        }

        var D_img = new Image();

        D_img.onload = function(e) {

            _numLoadedImgs++;
            console.log('completed loading image '+_numLoadedImgs);
            if(_numLoadedImgs === _numImgs) {
                // putImageDataInBuffer();
                tileImageDataInBuffer(27180, 9876);  // hardcoded values for test
                _callback();
            }
        };

        D_img.onerror = function(e) {
            throw "there was an error loading "+ e.currentTarget.name;
        };

        D_img.name = url;    // when we load we'll set src = name
        _D_bufferDataContainer.push({buffer:surface, image: D_img});
        _numImgs = _D_bufferDataContainer.length;
        console.log('queueing image '+_numImgs);  // debug
    };

    /**
     * itterate over list of buffer objects setting the src
     * property of the image objects which will trigger the download
     * @param callback ; the function to call when all the images are loaded
     */
    my.IMG_LoadImages = function(callback) {
        _callback = callback;
        for (var i = 0; i < _numImgs; i++) {
            _D_tmpImg = _D_bufferDataContainer[i].image;
            _D_tmpImg.src = _D_tmpImg.name;
            console.log('start loading image '+i);
            // setting src property triggers loading
        }
    };

    var tileImageDataInBuffer = function(width, height) {
        var D_offscreen_canvas  = document.createElement('canvas');
        var D_offscreen_context = D_offscreen_canvas.getContext('2d');

        D_offscreen_canvas.width  = width;
        D_offscreen_canvas.height = height;


        for (var i = 0; i < _numImgs; i++) {

            _D_tmpImg = _D_bufferDataContainer[i].image;  // grab reference to image from list

            var imagewidth  = 2718;  //_D_tmpImg.width;     we know is fixed             // how heigh is image
            var imageheight = 1700;  //_D_tmpImg.height;                // how wide is image

            console.log('tiling image '+i+' into offscreen canvas');
            D_offscreen_context.drawImage(
                _D_tmpImg,
                (imagewidth*i) % width,
                ((i/10)|0) * imageheight
            ); // dump image data into a canvas context

            // console.log((imagewidth*i) % width);
            // console.log(((i/10)|0) * imageheight);

            _D_bufferDataContainer[i].buffer.img = _D_tmpImg;
        }

        console.log('grabbing offscreen canvas data and storing in pixelf typed array');
        // bit crap here but any member of buffer container will do as they all point to the same buffer
        _D_bufferDataContainer[0].buffer.surface = D_offscreen_context.getImageData(0, 0, width, height);  
        // debug
        console.log('width: '+width);
        console.log('height: '+height);
        console.log(_D_bufferDataContainer[0].buffer.surface);
    }

    var putImageDataInBuffer = function() {

        var D_offscreen_canvas = document.createElement('canvas');
        var D_offscreen_context = D_offscreen_canvas.getContext('2d');

        for (var i = 0; i < _numImgs; i++) {
            _D_tmpImg = _D_bufferDataContainer[i].image;
            var width = _D_tmpImg.width;
            var height = _D_tmpImg.height;
            D_offscreen_canvas.width = width;
            D_offscreen_canvas.height = height;
            D_offscreen_context.drawImage(_D_tmpImg,0,0);
            _D_bufferDataContainer[i].buffer.img = _D_tmpImg;
            _D_bufferDataContainer[i].buffer.surface = D_offscreen_context.getImageData(0, 0, width, height);
        }
    };

    var IMG_AreWeDoneYet = function() {
        if(_numLoadedImgs === _numImgs) {
            return true;
        }
        return false;
    };

    return my;
}(PIX));





