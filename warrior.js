/**
 * Project: canvas_sprite_blitter
 * User: james
 * Date: 22/08/13
 * Time: 21:49
 * To change this template use File | Settings | File Templates.
 */
"use strict";

/* --------------- DEFINE GLOBALS ---------------- */

var ship_strip = PIX.SURF_NewSurface();  /* rotating ship in 2-degree increments */
var front_star_tiles = PIX.SURF_NewSurface();	/* for the parallaxing star layer */
var back_star_tiles = PIX.SURF_NewSurface();	/* for the star background */
var num_star_tiles;   /* derived from the width of the loaded strips */

/* Player data */
var player = NewPlayer();		/* the player sitting at the local keyboard */
var opponent = NewPlayer();		/* scripted or networked opponent */

/* The current camera position */
var camera_x, camera_y;	/* position of 640x480 viewport within world */

/* reference to main back buffer */
var screen = PIX.SURF_GetMainSurface();		/* not sure we need? */

/* Time scaling factor. If the game is running at an even
 30 frames/sec, this will be 1. For 15 frames/sec, it would
 be 2. The game uses this to speed up or slow down motion
 to run at about the same speed regardless of framerate. */
var time_scale = 0;

var game_type = "GAME_COMPUTER";
var opponent_type = "OPP_COMPUTER";

/* --------------- FUNCTIONS / HANDLERS ETC ---------------- */

/**
 * kick things off.
 * need this hoisted I think
 */
function ready()
{

    console.log("Playing against the computer.\n");

    /* Fire up PIX. */
    if (PIX.SURF_Init(document.getElementById('canvas'),640,480) < 0) {
        throw "Unable to initialize SDL";
    }

    /* Save the screen pointer for later use. */
    screen = PIX.SURF_GetMainSurface();

    /* Load the game's data into globals. */
    LoadGameData();   //hmmmm tail call.....
}

/* Data structure for player ships */
function NewPlayer() {
    var player_type = {
        angle:undefined,	  /* in clockwise degrees, 0 -> due east */
        world_x:undefined,    /* coordinates in the world (double) */
        world_y:undefined,	  /* coordinates in the world (double) */
        screen_x:undefined,   /* onscreen coordinates (int) */
        screen_y:undefined,	  /* onscreen coordinates (int) */
        velocity:undefined,	  /* velocity in pixels per frame */
        accel:undefined,	  /* acceleration in pixels/frame^2 */
        shields:undefined	  /* shield strength left */
    };
    return player_type;
}

/**
 * Loads the game's resources. Exits the program on failure.
 */
var LoadGameData = function() {

    /* The player's ship is stored as a 8640x96 image.
     This strip contains 90 individual images of the ship, rotated in
     four-degree increments. Take a look at fighter.bmp in an image
     viewer to see exactly what this means. */
     PIX.IMG_QueueImage(ship_strip,"fighter.png");

     /* Set the color key on the ship animation strip to black.
     Enable RLE acceleration for a performance boost. */
     //SDL_SetColorKey(tmp, SDL_SRCCOLORKEY|SDL_RLEACCEL, 0);

     /* Now load the star tiles. Each tile is 64x64, assembled into a strip.
     We'll derive the number of tiles from the width of the loaded bitmap. */
     PIX.IMG_QueueImage(back_star_tiles,"back-stars.png");

     /* Load the front (parallaxing) set of star tiles. */
     PIX.IMG_QueueImage(front_star_tiles,"front-stars.png");

     PIX.IMG_LoadImages(onImagesLoaded);

};

var onImagesLoaded = function() {

   /* Determine how many star tiles are in the strip. We'll assume that the
     foreground and background strips contain the same number of stars. */
    num_star_tiles = back_star_tiles.surface.width / 64;
    //num_star_tiles = 4;

    /* Set a black color key and request RLE acceleration. */
    //SDL_SetColorKey(tmp, SDL_SRCCOLORKEY | SDL_RLEACCEL, 0);
    /* Initialize the background starfield. */
    initBackground();

    /* Play! */
    InitPlayer();
    InitOpponent();
    PlayGame();
};


var keystate;   // keyboard shizzle
var quit = 0;   // int
var turn;        // int
var prev_ticks, cur_ticks = 0; /* for keeping track of timing (int)*/
/* framerate counter variables */
var start_time, end_time;   // int
var frames_drawn;        // int

/* ----------------------------------------------------------------------- */





/* =======
 Drawing
 ======= */

/* Draws the given player to the screen. */
var DrawPlayer = function(p)
{
    var src = {}, dest = {};
    var angle;

    /* Calculate the player's new screen coordinates. */
    p.screen_x = p.world_x - camera_x | 0;
    p.screen_y = p.world_y - camera_y | 0;

    /* If the player isn't on the screen, don't draw anything. */
    if (p.screen_x < -PLAYER_WIDTH/2 || p.screen_x >= SCREEN_WIDTH+PLAYER_WIDTH/2)
        return;

    if (p.screen_y < -PLAYER_HEIGHT/2 || p.screen_y >= SCREEN_HEIGHT+PLAYER_HEIGHT/2)
        return;

    /* Calculate drawing coordinates. */
    angle = p.angle;
    if (angle < 0) angle += 360;
    src.x = PLAYER_WIDTH * (angle / 4);
    src.y = 0;
    src.w = PLAYER_WIDTH;
    src.h = PLAYER_HEIGHT;
    dest.x = p.screen_x - PLAYER_WIDTH/2;
    dest.y = p.screen_y - PLAYER_HEIGHT/2;
    dest.w = PLAYER_WIDTH;
    dest.h = PLAYER_HEIGHT;

    /* Draw the sprite. */
    PIX.SURF_DrawToCanvas(ship_strip.img,src,dest);
};





/* =============
 Player Update
 ============= */

/* Initializes the player. */
var InitPlayer = function()
{
    player.world_x = Math.random() * WORLD_WIDTH | 0;
    player.world_y = Math.random() * WORLD_HEIGHT | 0;
    player.accel = 0;
    player.velocity = 0;
    player.angle = 0;
    UpdatePlayer(player);
};





/* Initializes the opponent (either computer- or network-controlled). */
var InitOpponent = function()
{
    if (opponent_type == "OPP_COMPUTER") {
        opponent.world_x = Math.random() * WORLD_WIDTH | 0;
        opponent.world_y = Math.random() * WORLD_HEIGHT | 0;
        opponent.accel = 0;
        opponent.velocity = 0;
        opponent.angle = 0;
    } else {	/* network opponent */
        /* Nothing yet. We'll add this in Chapter 7. */
    }
}



/* Calculates a player's new world coordinates based on the camera
 and the player's velocity. Adds acceleration to velocity. Uses simple
 trigonometry to update the world coordinates. */
var UpdatePlayer = function(p)
{
    var angle;  /* float */

    angle = p.angle;

    p.velocity += p.accel * time_scale;
    if (p.velocity > PLAYER_MAX_VELOCITY) p.velocity = PLAYER_MAX_VELOCITY;
    if (p.velocity < PLAYER_MIN_VELOCITY) p.velocity = PLAYER_MIN_VELOCITY;

    p.world_x += p.velocity * Math.cos(angle * Math.PI/180.0) * time_scale;
    p.world_y += p.velocity * -Math.sin(angle * Math.PI/180.0) * time_scale;

    /* Make sure the player doesn't slide off the edge of the world. */
    if (p.world_x < 0) p.world_x = 0;
    if (p.world_x >= WORLD_WIDTH) p.world_x = WORLD_WIDTH-1;
    if (p.world_y < 0) p.world_y = 0;
    if (p.world_y >= WORLD_HEIGHT) p.world_y = WORLD_HEIGHT-1;
};







/* ==============
 Main Game Loop
 ============== */

var PlayGame = function()
{
    prev_ticks = PIX.SURF_GetTicks(); // experiment!

    start_time = new Date().getTime();
    frames_drawn = 0;
    requestAnimFrame(mainLoop);
};



var mainLoop = function() {


    /* Determine how many milliseconds have passed since
    the last frame, and update our motion scaling. */

    prev_ticks = cur_ticks;
    cur_ticks = PIX.SURF_GetTicks();
    time_scale = (cur_ticks-prev_ticks)/30.0;

    /* Grab a snapshot of the keyboard. */
    keystate = PIX.KEY_GetKeyState();

    /* Respond to input. */
    if (keystate[81] || keystate[27]) quit = 1;  /* 'q' or 'esc'

    /* Left and right arrow keys control turning. */
    turn = 0;
    if (keystate[37]) turn += 12;       /* left arrow */
    if (keystate[39]) turn -= 12;       /* right arrow */

    /* Forward and back arrow keys activate thrusters. */
    player.accel = 0;
    if (keystate[38]) player.accel = PLAYER_FORWARD_THRUST;  /* up arrow */
    if (keystate[40]) player.accel = PLAYER_REVERSE_THRUST;  /* down arrow */

    /* Spacebar slows the ship down. */
    if (keystate[32]) {            /* space bar */
        player.velocity *= 0.8;
    }

    /* Just an amusing way to test the particle system.
     This has absolutely no effect on the game. */
    if (keystate[69]) {    /* e */
        PIX.PART_CreateParticleExplosion(player.world_x, player.world_y, 255, 255, 255, 10, 300);
        //PIX.PART_CreateParticleExplosion(player.world_x, player.world_y, 255, 0, 0, 5, 100);
        //PIX.PART_CreateParticleExplosion(player.world_x, player.world_y, 255, 255, 0, 2, 50);
        delete keystate[69];
    }

    /* Allow a turn of four degrees per frame. */
    player.angle += turn; // * time_scale;
    if (player.angle < 0) player.angle += 360;
    if (player.angle >= 360) player.angle -= 360;

     /* Update the player's position. */
    UpdatePlayer(player);
    UpdatePlayer(opponent);

    /* Make the camera follow the player (but impose limits). */
    camera_x = player.world_x - SCREEN_WIDTH/2;
    camera_y = player.world_y - SCREEN_HEIGHT/2;

    if (camera_x < 0) camera_x = 0;
    if (camera_x >= WORLD_WIDTH-SCREEN_WIDTH)
        camera_x = WORLD_WIDTH-SCREEN_WIDTH-1;
    if (camera_y < 0) camera_y = 0;
    if (camera_y >= WORLD_HEIGHT-SCREEN_HEIGHT)
        camera_y = WORLD_HEIGHT-SCREEN_HEIGHT-1;

    /* Update the particle system. */
    PIX.PART_UpdateParticles();

    /* Redraw everything. */
    DrawBackground(screen, 0, 0);
    DrawParallax(screen, camera_x, camera_y);
    DrawPlayer(player);
    PIX.PART_DrawParticles(screen, camera_x, camera_y);

    DrawPlayer(opponent);

    /* Flip the page. */
    //  SDL_Flip(screen);

    frames_drawn++;

    if(!quit){
        requestAnimFrame(mainLoop);
    } else {
        end_time = new Date().getTime();
        var runtime = end_time-start_time;
        if (start_time == end_time) end_time++;

        /* Display the average framerate. */
        console.log("Drew "+frames_drawn+" frames in "+runtime+" seconds, for a framerate of "+frames_drawn/(end_time-start_time)+" fps.\n");

    }

};

