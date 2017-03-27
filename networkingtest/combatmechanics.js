

$(document).ready(function () {
  window.addEventListener("load",loadImages);
});

//Constants
var CANVAS_WIDTH = 1280;
var CANVAS_HEIGHT = 720;
var player_location_x = CANVAS_WIDTH/2;
var player_location_y = CANVAS_HEIGHT/2;
var FPS = 60;
var player;
var gamestate = 0;
var origin= {x:0, y:0};
var inputHandler;

var IMAGE_SOURCES = { 
playerImage: "images/player.png"
};

//GLOBALS
var ctx;
var player;
images = {};
var mouse = {};

function init()
{
	var canvasElement = document.querySelector("canvas");
	canvasElement.width = CANVAS_WIDTH;
	canvasElement.height = CANVAS_HEIGHT;
	ctx=canvasElement.getContext("2d");	
	ctx.lineWidth=5;
	canvasElement.addEventListener('click', onclick, false);
	inputHandler= new InputHandler();
	setInterval(loop, 1000/FPS);
	canvasElement.addEventListener('mousemove', track_mouse, false);
	window.addEventListener("keydown", function(e)
    {
        inputHandler.keyDown(e.keyCode);
	});
	window.addEventListener("keyup", function(e)
    {  
        inputHandler.keyUp(e.keyCode);
    });
	player= new Player(CANVAS_WIDTH/2,CANVAS_HEIGHT,50,1);
}//end init

function track_mouse(e)
{
	//mouse.x mouse.y
}

function onclick(e)
{

}

function loop(){
	update();
	draw();
}


function update()
{
    player.update();
}//END UPDATE

function draw()
{    
    ctx.save();
    ctx.clearRect (0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    drawBackground();
    player.draw();
    ctx.restore();
}//END DRAW

function drawBackground()
{
	ctx.fillStyle="#CCCCCC";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

function loadImages(){
    var numLoadedImages =0;
    var numImages = 0;
    //get num of sources 
    for(var imageName in IMAGE_SOURCES)
    {
        numImages++;
    }
        
    //load images
    for(var imageName in IMAGE_SOURCES)
    {
        images[imageName] = new Image();
        images[imageName].src = IMAGE_SOURCES[imageName];
            
        images[imageName].onload = function()
        {
            if(++numLoadedImages >= numImages)
            {
                console.log("DONE LOADING IMAGES");
                init();
            }
        }
	}
}

function rotate(x,y,sin,cos,reverse)
{
	var result = new Point(0,0);
	if(reverse)
	{
		result.x = (x * cos) + (y * sin);
		result.y = (y * cos) - (x * sin);
	}
	else
	{
		result.x = (x * cos) - (y * sin);
		result.y = (y * cos) + (x * sin);
	}
	
	if(result.x<0.001 && result.x>-0.001)
    {
		result.x=0;
	}
	if(result.y<0.001 && result.y>-0.001)
    {
		result.y=0;
	}
	return result;
}