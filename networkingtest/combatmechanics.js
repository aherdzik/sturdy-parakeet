

$(document).ready(function () {
  window.addEventListener("load",loadImages);
});

//Constants
var CANVAS_WIDTH = 1280;
var CANVAS_HEIGHT = 720;
var player_location_x = CANVAS_WIDTH/2;
var player_location_y = CANVAS_HEIGHT/2;
var FPS = 60;
var gamestate = 0;
var origin= {x:0, y:0};
var inputHandler;
var global_offset_x = 0;
var global_offset_y = 0;
var servConnection = new ServerConnection();
var sentConnectionTry = false;
var playerName = "";
var mouseDown = false;


var IMAGE_SOURCES = { 
playerImage: "images/player.png",
outsidePlayerImage: "images/outside_player.png",
squareImage: "images/square.png"
};

//GLOBALS
var ctx;
var gameObjects = new Map();
images = {};
var mouse = {};

function init()
{
	var canvasElement = document.querySelector("canvas");
	canvasElement.width = CANVAS_WIDTH;
	canvasElement.height = CANVAS_HEIGHT;
	ctx=canvasElement.getContext("2d");	
	ctx.lineWidth=5;
	canvasElement.addEventListener('mousedown', onmousedown, false);
    canvasElement.addEventListener('mouseup', onmouseup, false);
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
    gameObjects.set("player", new Player(player_location_x,player_location_y));
    gameObjects.set("square1", new Square(400,400, 100));
    
}//end init

function track_mouse(e)
{
	mouse.x = e.clientX;
    mouse.y = e.clientY;
    var currentTan = Math.atan2(mouse.x-player_location_x, mouse.y-player_location_y) * -1;
    gameObjects.get("player").rotation= currentTan;
}

function sendName()
{
    if(!sentConnectionTry)
    {
        var sendObj ={};
        sendObj["messageType"] = "logon";
        sendObj["name"] = document.getElementById("player_name").value;
        playerName = sendObj["name"];
        sendObj["x"] = gameObjects.get("player").x;
        sendObj["y"] = gameObjects.get("player").y;
        sendObj["rotation"] = gameObjects.get("player").rotation;
        servConnection.sendMessage(JSON.stringify(sendObj));
        sentConnectionTry = true;
    }
}

function onmousedown(e)
{
    mouseDown =true;
}

function onmouseup(e)
{
    mouseDown = false;
}

function loop(){
	update();
	draw();
}


function update()
{
    global_offset_x = player_location_x- gameObjects.get("player").x;
    global_offset_y = player_location_y- gameObjects.get("player").y;
    
    for (var value of gameObjects.values()) 
    {
        value.update();
    }
    if(sentConnectionTry)
    {
        updatePositionOnServer();
    }
}//END UPDATE

function updatePositionOnServer()
{
    var sendObj ={};
    sendObj["messageType"] = "moveupdate";
    sendObj["name"] = playerName;
    sendObj["x"] = gameObjects.get("player").x;
    sendObj["y"] = gameObjects.get("player").y;
    sendObj["rotation"] = gameObjects.get("player").rotation;
    servConnection.sendMessage(JSON.stringify(sendObj));
}

function draw()
{    
    ctx.save();
    ctx.clearRect (0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    drawBackground();
    for (var value of gameObjects.values()) 
    {
        value.draw();
    }
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