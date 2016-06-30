/**
 * Project: canvas_sprite_blitter : mouse module
 */
"use strict";

var PIX = (function (my) {

    var cursorX, cursorY;

    document.onmousemove = function(e){
      cursorX = e.pageX;
      cursorY = e.pageY;
    }

    my.MOUSE_GetMouseLoc = function() {
        return {x:cursorX,y:cursorY};
    };
    /* usage eg if(pressed[37]) {} */

  return my;

}(PIX));