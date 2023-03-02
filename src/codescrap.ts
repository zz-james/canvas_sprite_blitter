// const tileImageDataInBuffer = (width: number, height: number) => {
//   var D_offscreen_canvas = document.createElement("canvas");
//   var D_offscreen_context = D_offscreen_canvas.getContext("2d");

//   D_offscreen_canvas.width = width;
//   D_offscreen_canvas.height = height;

//   for (var i = 0; i < _numImgs; i++) {
//     _D_tmpImg = _D_bufferDataContainer[i].image; // grab reference to image from list

//     var imagewidth = 2718; //_D_tmpImg.width;     we know is fixed             // how heigh is image
//     var imageheight = 1700; //_D_tmpImg.height;                // how wide is image

//     console.log("tiling image " + i + " into offscreen canvas");
//     D_offscreen_context.drawImage(
//       _D_tmpImg,
//       (imagewidth * i) % width,
//       ((i / 10) | 0) * imageheight
//     ); // dump image data into a canvas context

//     // console.log((imagewidth*i) % width);
//     // console.log(((i/10)|0) * imageheight);

//     _D_bufferDataContainer[i].buffer.img = _D_tmpImg;
//   }

//   console.log(
//     "grabbing offscreen canvas data and storing in pixelf typed array"
//   );
//   // bit crap here but any member of buffer container will do as they all point to the same buffer
//   _D_bufferDataContainer[0].buffer.surface = D_offscreen_context.getImageData(
//     0,
//     0,
//     width,
//     height
//   );
//   // debug
//   console.log("width: " + width);
//   console.log("height: " + height);
//   console.log(_D_bufferDataContainer[0].buffer.surface);
// };
