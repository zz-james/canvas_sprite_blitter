/**
 * Project: Canvas Sprite Blitter
 * User: james
 * Date: 06/05/13
 * Time: 18:37
 */
"use strict";

var pressed={};
document.onkeydown=function(e){
    e = e || window.event;
    pressed[e.keyCode] = true;
};

document.onkeyup=function(e){
    e = e || window.event;
    delete pressed[e.keyCode];
};