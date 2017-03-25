

$(document).ready(function () {
  window.addEventListener("load",loadImages);
});

//Constants
var CANVAS_WIDTH = 1280;
var CANVAS_HEIGHT = 720;
var FPS = 60;
var player, player2;
var FIRE_RATE = 2;
var GRAVITY = 2;
var gamestate = 0;
var xmlDoc;
var origin= {x:0, y:0};
var inputHandler;
var prevCollision=false;
var curPowerup="none";
var healthPowerupNext=true;
var powerUpTimer=600;
var shockwaves=[];
var soundChannels = {};

var IMAGE_SOURCES = { 
playerImage: "images/player.png",
player2Image: "images/player2.png",
playerImageEnergy: "images/playerenergy.png",
player2ImageEnergy: "images/player2energy.png",
healthImage: "images/health.png",
energyImage: "images/energy.png",
blast1Image: "images/blast1.png",
blast2Image: "images/blast2.png",
blast3Image: "images/blast3.png",
blast4Image: "images/blast4.png"
};

var AUDIO_CHANNEL = {
	CHANNEL_EXPLOSION: "channelExplosion"		
};
		
var AUDIO_SOURCES = {
	AUDIO_EXPLOSION: "sounds/explosion",
};

//GLOBALS
var ctx;
var player;
images = {};
var mouse = {};

function init(){
	var canvasElement = document.querySelector("canvas");
	canvasElement.width = CANVAS_WIDTH;
	canvasElement.height = CANVAS_HEIGHT;
	ctx=canvasElement.getContext("2d");	
	ctx.lineWidth=5;
	canvasElement.addEventListener('click', onclick, false);
	inputHandler= new InputHandler();
	setInterval(loop, 1000/FPS);
	canvasElement.addEventListener('mousemove', track_mouse, false);
	window.addEventListener("keydown", function(e){
	inputHandler.keyDown(e.keyCode);
	});
	window.addEventListener("keyup", function(e){
	inputHandler.keyUp(e.keyCode);
		}
	);
	player= new Player(300,100,50,1);
	player2= new Player(1000,100,50,2);
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


function update(){
	//console.log("player.x: " + player.x + "player.y: " + player.y);
	//console.log("player2.x: " + player2.x + "player2.y: " + player2.y);
	
	if(player.HP>0 && player2.HP>0){
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_LEFT]){
			player.xVel-=(10); 			
		}
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_RIGHT]){
			player.xVel+=(10); 
		}
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_UP]){
			player.yVel+=(-20);
		}
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_DOWN]){
			player.yVel+=(20);	
		}
		
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_Q]){
			if(player.energy>1.5 && player.canShield){
				player.shieldOn=true;	
			}else if(!player.canShield && player.shieldOn && player.energy>1.5){
				player.shieldOn=true;
			}else{
				player.shieldOn=false;
			}
		}else{
			player.shieldOn=false;
		}	
			
		
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_LEFT2]){
			player2.xVel-=(10); 			
		}
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_RIGHT2]){
			player2.xVel+=(10); 
		}
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_UP2]){
			player2.yVel+=(-20);
		}
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_DOWN2]){
			player2.yVel+=(20);	
		}
		if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_ZERO]){
			if(player2.energy>1.5 && player2.canShield){
				player2.shieldOn=true;	
			}else if(!player2.canShield && player2.shieldOn && player2.energy>1.5){
				player2.shieldOn=true;
			}else{
				player2.shieldOn=false;
			}
		}
		else{
			player2.shieldOn=false;
		}
		var doubletap1= inputHandler.player1DoubleTap();
		//SUCCESSFUL DOUBLETAP
		if(doubletap1!=0 && player.dashtimer<0& player.energy>=50){
			player.energy-=50;
			player.dashtimer=1;
			player.dashing=true;
			console.log(doubletap1);
			switch(doubletap1){
				case 1:
						player.xVel-=1000;
						
				break;
				case 2:
						player.yVel+=1000;
				break;
				case 3:
						player.xVel+=1000;
				break;
				case 4:
						player.yVel-=1000;
				break;
				case 5:
						player.yVel-=707;
						player.xVel-=707;
				break;
				case 6:
						player.yVel+=707;
						player.xVel-=707;
				break;
				case 7:
						player.yVel+=707;
						player.xVel+=707;
				break;
				case 8:
						player.yVel-=707;
						player.xVel+=707;
				break;
				default:
				break;
			}
		}
		
		var doubletap2= inputHandler.player2DoubleTap();
		if(doubletap2!=0 && player2.dashtimer<0 && player2.energy>=50){
			player2.energy-=50;
			player2.dashtimer=1;
			player2.dashing=true;
			switch(doubletap2){
				case 1:
						player2.xVel-=1000;				
				break;
				case 2:
						player2.yVel+=1000;
				break;
				case 3:
						player2.xVel+=1000;
				break;
				case 4:
						player2.yVel-=1000;
				break;
				case 5:
						player2.yVel-=707;
						player2.xVel-=707;
				break;
				case 6:
						player2.yVel+=707;
						player2.xVel-=707;
				break;
				case 7:
						player2.yVel+=707;
						player2.xVel+=707;
				break;
				case 8:
						player2.yVel-=707;
						player2.xVel+=707;
				break;
				default:
				break;
			}
		}
		checkCollisions();
		handleCollisions();
		player.update();
		player2.update();
		inputHandler.update();
		powerUpTimer--;
		if(powerUpTimer<=0){
			spawnNewPowerup();
			powerUpTimer=600;
		}
		if(curPowerup!="none"){
			var dx = player2.x - (curPowerup.x) ;
			var dy = player2.y - (curPowerup.y) ;
			var dist = Math.sqrt(dx*dx + dy*dy);
			if((dist) < player2.radius+curPowerup.radius){
				if(curPowerup.isHealth){
					if(player2.HP<37.5){
						player2.HP+=12.5;
					}else{
						player2.HP=50;
					}
				}else{
					player2.energyuptimer=180;
				}
				curPowerup="none";
			}
			dx = player.x - (curPowerup.x) ;
			dy = player.y - (curPowerup.y) ;
			dist = Math.sqrt(dx*dx + dy*dy);
			if((dist) < player.radius+curPowerup.radius){
				if(curPowerup.isHealth){
					if(player.HP<37.5){
						player.HP+=12.5;
					}else{
						player.HP=50;
					}
				}else{
					player.energyuptimer=180;
				}
				if(curPowerup!="none"){
				curPowerup="none";
				}
			}
	
		}
	}
	
	
}//END UPDATE


function spawnNewPowerup(){
	curPowerup= new Powerup(100+ Math.random()* 1000, 100+ Math.random()*500,healthPowerupNext);
	healthPowerupNext = !healthPowerupNext;
}
function draw(){
ctx.save();
ctx.clearRect (0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
drawBackground();

player.draw();
player2.draw();
drawBars();
for(var i=0;i<shockwaves.length; i++){
	shockwaves[i].draw();
	if(shockwaves[i].alpha<=0){
	shockwaves.splice(i,1);
	}
}
if(curPowerup!="none"){
curPowerup.draw();	
}
ctx.restore();
}//END DRAW

function drawBackground(){
	ctx.fillStyle="#CCCCCC";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

function drawBars(){
	ctx.fillStyle="#FF0000";
	ctx.fillRect(10,10,player.HP*4,20);
	ctx.fillRect(CANVAS_WIDTH-210,10,player2.HP*4,20);
	
	ctx.fillStyle="#FFB90F";
	ctx.fillRect(10,40,player.energy*2,20);
	ctx.fillRect(CANVAS_WIDTH-210,40,player2.energy*2,20);
}

function handleCollisions(){
player.keepInBounds();
player2.keepInBounds();

}


function loadImages(){
		var numLoadedImages =0;
		var numImages = 0;
		//get num of sources 
			for(var imageName in IMAGE_SOURCES){
				numImages++;
			}
			
		//load images
		for(var imageName in IMAGE_SOURCES){
			images[imageName] = new Image();
			images[imageName].src = IMAGE_SOURCES[imageName];
			
			images[imageName].onload = function(){
			if(++numLoadedImages >= numImages){
			console.log("DONE LOADING IMAGES");
			init();
			
			}
		}
	}
}

function checkCollisions()
{
	var dx = (player2.x+ player2.radius) - (player.x + player.radius);
	var dy = (player2.y+ player2.radius) - (player.y + player.radius);
	var dist = Math.sqrt(dx*dx + dy*dy);
	if(dist < player.radius + player2.radius)
	{
		player.dashing=player2.dashing=false;
		var playerTotalVelocity= Math.sqrt((player.xVel * player.xVel) + (player.yVel*player.yVel));
		var player2TotalVelocity= Math.sqrt((player2.xVel * player2.xVel) + (player2.yVel*player2.yVel));
		console.log(playerTotalVelocity + " " + player2TotalVelocity);
		//player 2 damage
		if(playerTotalVelocity>player2TotalVelocity){
		
			var damageDifference=playerTotalVelocity-player2TotalVelocity;
			if(player2.shieldOn && player2.energy>10){
				damageDifference/=3;
				player2.energy-=10;
			}
			player2.HP-=(damageDifference/200);
		//player1damage
		}else{
			var damageDifference=player2TotalVelocity-playerTotalVelocity;
			if(player.shieldOn && player.energy>10){
				damageDifference/=3;
				player.energy-=10;
			}
			player.HP-=(damageDifference/200);
		}
		
		// calculate angle, sine, and cosine
		var angle = Math.atan2(dy, dx);
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		// rotate player's position
		//console.log("dx: " + dx + " dy: " + dy + " dist: " + dist + " angle: "  + angle + " sin: " + sin + " cos: " + cos);
		var pos0 = new Point(0, 0);
		// rotate player2's position
		
		var pos1 = rotate(dx, dy, sin, cos, true);
		// rotate player's velocity
		var vel0 = rotate(player.xVel,player.yVel,sin,cos,true);
		// rotate player2's velocity
		
		var vel1 = rotate(player2.xVel,player2.yVel,sin,cos,true);
		// collision reaction
		var vxTotal = vel0.x - vel1.x;
		
		vel0.x = ((player.mass - player2.mass) * vel0.x +
		2 * player2.mass * vel1.x) /
		(player.mass + player2.mass);
		vel1.x = vxTotal + vel0.x;
		// update position
		var absV = Math.abs(vel0.x) + Math.abs(vel1.x);
		var overlap = (player.radius + player2.radius)
		- Math.abs(pos0.x - pos1.x);
		if(absV*overlap>.1)
		{
			pos0.x += vel0.x / absV * overlap;
			pos1.x += vel1.x / absV * overlap;
		}
		else
		{
			pos0.x += vel0.x 
			pos1.x += vel1.x 
		}
		// rotate positions back
		var pos0F = rotate(pos0.x,
		pos0.y,
		sin,
		cos,
		false);
		var pos1F = rotate(pos1.x,
		pos1.y,
		sin,
		cos,
		false);
		// adjust positions to actual screen positions
		player2.x = player.x + pos1F.x;
		player2.y = player.y + pos1F.y;
		player.x = player.x + pos0F.x;
		player.y = player.y + pos0F.y;
		// rotate velocities back
		var vel0F = rotate(vel0.x,vel0.y,sin,cos,false);
		var vel1F = rotate(vel1.x,vel1.y,sin,cos,false);
		player.xVel = vel0F.x;
		player.yVel = vel0F.y;
		player2.xVel = vel1F.x;
		player2.yVel = vel1F.y;
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
	
	if(result.x<0.001 && result.x>-0.001){
		result.x=0;
	}
	if(result.y<0.001 && result.y>-0.001){
		result.y=0;
	}
	return result;
}