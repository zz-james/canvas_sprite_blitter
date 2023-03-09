import { Surface } from "./surfaces";

let tiledImageBuffer: Uint8ClampedArray;

// -- tiling images into buffer -- //
/**
 * create an offscreen canvas
 * @param width
 * @param height
 */
export const createTiledSurface = (
  rows: number,
  cols: number,
  surfaces: Surface[]
): Surface => {
  let bufferWidth = 0;
  let bufferHeight = 0;

  // for (let col = 0; col < cols; col++) {
  //   bufferWidth += surfaces[col].width;
  // }

  // for (let row = 0; row < rows; row++) {
  //   bufferHeight += surfaces[cols * row].height;
  // }

  // tiledImageBuffer = new Uint8ClampedArray(
  //   surfaces.reduce((acc, surface) => acc + surface.data.length, 0)
  // );

  let tileHeight = surfaces[0].height;
  let tileWidth = surfaces[0].width;
  bufferHeight = tileHeight * rows;
  bufferWidth = tileWidth * cols;

  tiledImageBuffer = new Uint8ClampedArray(bufferWidth * bufferHeight * 4);
  let offset = 0;

  for (let line = 0; line < bufferHeight; line++) {
    const row = (line / tileHeight) | 0;

    for (let col = 0; col < cols; col++) {
      const start = line * tileWidth * 4;
      const end = start + tileWidth * 4;
      const surfaceIndex = col + row * rows;

      // console.log(`${line} - ${row} - ${offset}`);
      // console.log(`${start} -- ${end}`);

      tiledImageBuffer.set(
        surfaces[surfaceIndex].data.slice(start, end),
        offset
      );
      offset += tileWidth * 4;
    }
  }

  return {
    data: tiledImageBuffer,
    width: bufferWidth,
    height: bufferHeight,
  };
};
