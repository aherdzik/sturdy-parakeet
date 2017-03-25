

$(document).ready(function () {
  window.addEventListener("load",loadImages);
});

		//http://www.rgbstock.com/photo/nIpKJRU/Futuristic+Circuit+Tile
		//Constants
		var CANVAS_WIDTH = 640;
		var CANVAS_HEIGHT = 480;
		var ENEMY_PROBABILITY_PER_SECOND = 0.0;
		var FPS = 60;
		var player;
		var FIRE_RATE = 2;
		var particle_count = 100;
		var GRAVITY = 500;
		var thrustFuel = 100;
		var gamestate = 0;
		var xmlDoc;
		var countdown=240;
		var bombSpot;
		var returning=false;
		var gameWon=false;
		var origin= {x:0, y:0};
		var KEYBOARD = {
		"KEY_LEFT": 65,
		"KEY_UP": 87,
		"KEY_RIGHT": 68,
		"KEY_DOWN": 83,
		"KEY_ENTER": 13,
		"KEY_UP2": 38,
		"KEY_DOWN2": 40,
		"KEY_SPACE": 32
		
		};
		
		var AUDIO_CHANNEL = {
			CHANNEL_BACKGROUND: "channelBackground",
			CHANNEL_BULLET: "channelBullet",
			CHANNEL_EXPLOSION: "channelExplosion"		
		};
		
		var AUDIO_SOURCES = {
          AUDIO_BACKGROUND: "",
          AUDIO_BULLET: "sounds/shoot",
          AUDIO_ENEMY_EXPLOSION: "sounds/explosion",
          AUDIO_PLAYER_EXPLOSION: "sounds/all_dead"
		  };
		var IMAGE_SOURCES = { 
		arrowImage: "images/arrow.png",
		bombSpotImage: "images/bombspot.png",
		playerImage: "images/player.png",
		robotImage: "images/robot.png",
		robotImage2: "images/robot2.png",
		mainImage: "images/mainsplash.png",
		instructionScreenImage: "images/instructionscreen.png",
		unbreakableImage: "images/unbreakable.png",
		enemyRobotImage: "images/enemyrobot.png",
		enemyRobotImage2: "images/enemyrobot2.png",
		breakableImage: "images/breakable.png",
		tileBackgroundImage: "images/tilebkg.png",
		robotArm: "images/robotarm.png",
		enemyRobotArm: "images/enemyrobotarm.png"
		};
		
		
		//GLOBALS
		var ctx;
		var player;
		var selectorArrow;
		images = {};
		var keydown = [];
		var playerBullets = [];
		var cooldown = 0;
		var breakables= [];
		var unbreakables= [];
		var enemies= [];
		var soundChannels = {};
		var particles= [];
		var score=0;
		var mouse = {};

		
		//CONSTRUCTORS
			
		function AudioEffect(channel,trackURL,volume){
		/* 
		Kill old channel if we want
		Probably a good idea if you don't like crashes
		*/
		if (soundChannels[channel]) soundChannels[channel].kill();
			
		soundChannels[channel] = this;
		this.myAudio = new Audio();
		if(this.myAudio.canPlayType("audio/mpeg")){
			trackURL += ".mp3";
		} else {
			trackURL += ".wav";
		}
		this.myAudio.src = trackURL;
		this.myAudio.volume = volume;
			
		this.myAudio.play();
			
	}
		
	AudioEffect.prototype.kill = function(){
		if(this.myAudio){
			this.myAudio.pause();
			this.myAudio.src = "";
		} 
	}
		
		
		function init(){
			var canvasElement = document.querySelector("canvas");
			canvasElement.width = CANVAS_WIDTH;
			canvasElement.height = CANVAS_HEIGHT;
			ctx=canvasElement.getContext("2d");	
			canvasElement.addEventListener('click', onclick, false);
			selectorArrow= new Arrow();
			selectorArrow= new Arrow();
			setInterval(loop, 1000/FPS);
			canvasElement.addEventListener('mousemove', track_mouse, false);
			window.addEventListener("keydown", function(e){
			keydown[e.keyCode] = true;
			});
			window.addEventListener("keyup", function(e){
			keydown[e.keyCode] = false;
				}
			);
			drawBackground();
		}//end init
		
		function stage2init()
		{	
			var canvasElement = document.querySelector("canvas");
			canvasElement.width = CANVAS_WIDTH;
			canvasElement.height = CANVAS_HEIGHT;
			

			//get a 2d rendering context
			
			drawBackground();
			//fire loop 30 times a second
			//PLAYER CLASS
			player= new Player(300,50);
			getLevel();
			bombSpot=new BombSpot(54*32,15*32);
			//bombSpot=new BombSpot(20*32,5*32);
			for(var i=0; i<100; i++)
			{
				particles.push(new particle());
			}
		}
		
		function track_mouse(e)
		{
			//since the canvas = full page the position of the mouse 
			//relative to the document will suffice
			if(gamestate==0)
			{
				if(mouse.x!=e.pageX || mouse.y!=e.pageY)
				{
					mouse.x = e.pageX;
					mouse.y = e.pageY;
					if(mouse.y>280 && mouse.y<320)
					{
						selectorArrow.y=280;
					}
					else if(mouse.y>230 && mouse.y<270)
					{
						selectorArrow.y=230;
					}
				}
			}
			if(gamestate==2)
			{
				mouse.x = e.pageX;
				mouse.y = e.pageY;
				if(mouse.x<player.x+ (player.width/2))
				{
					player.flipped=true;
				}
				else
				{
					player.flipped=false;
				}
			}
		}
		
		function onclick(e)
		{
			if(gamestate==0)
			{
				
				if(mouse.y>280 && mouse.y<340)
				{
					gamestate=1;
				}
				else if(mouse.y>200 && mouse.y<279)
				{
					gamestate=2;
					stage2init();
				}
			}
			else if(gamestate==1)
			{
				gamestate=0;
			}
			else if(gamestate==2)
			{
				if(player.bulletcooldown <=0){
					player.shoot();
					player.bulletcooldown = (FPS/FIRE_RATE)/2;
				}
			}
		}
		
		
		
		function drawBackground(){
			if(gamestate==2)
			{
				var i = origin.x;
					while(i>0){
				i-=256;
				}
				var j = origin.y;
				while(j>0){
					j-=256;
				}	
				while(i<-256){
				i+=256;
				}
				while(j<-256){
					j+=256;
				}
				for(var k=0; k<4; k++)
				{
					for( var l=0; l<3; l++)
					{
						ctx.drawImage(images["tileBackgroundImage"],i+ (k*256),j+ (l*256),256,256);
					}
				}
			}
		}
		
		function loop(){
			update();
			draw();
		}
		
		function collides(a, b) {			
			
  			return a.x < b.x + b.width &&
         		a.x + a.width > b.x &&
         		a.y < b.y + b.height &&
         		a.y + a.height > b.y;
		} // end collides

		function handleCollisions() {
		  playerBullets.forEach(function(bullet) {
			breakables.forEach(function(breakable) {
			  if (collides(bullet, breakable)) {
				breakable.explode();
				score++;
				bullet.active = false;
			  } // end if
			}); // end forEach breakable
			unbreakables.forEach(function(unbreakable) {
			  if (collides(bullet, unbreakable)) {
				bullet.active = false;
			  } // end if
			}); // end forEach unbreakable
			enemies.forEach(function(enemy) {
			  if (collides(bullet, enemy)) {
				if(bullet.isGood)
				{
					bullet.active = false;
					enemy.explode();
				}
			  } // end if
			}); // end forEach unbreakable
			if(player.alive)
			{
				if (collides(bullet, player)) {
					if(!bullet.isGood)
					{
						bullet.active = false;
						player.explode();
					}
				  } 
			 }
			 
			
		  }); // end ofEach bullet
		  
		  player.collidedLeft=false;
		  player.collidedRight=false;
		  player.collidedTop=false;
		  player.collidedBottom=false;
			
		  breakables.forEach(function(breakable) {
			if (collides(player, breakable)) {			
				player.collide(breakable);
			}
		  });
		  
		  unbreakables.forEach(function(unbreakable) {
			if (collides(player, unbreakable)) {			
				player.collide(unbreakable);
			}
		  });
		  
		  enemies.forEach(function(enemy) {
			if (collides(player, enemy)) {			
				player.collide(enemy);
			}
		  });
		  
		  if(collides(player, bombSpot))
		  {
			if(!returning)
			{
				returning=true;
				bombSpot.x=64+origin.x;
				bombSpot.y=12*32 + origin.y;
			}
			else
			{
				winGame();
			}
		  }

		} // end handleCollisions
		
		function winGame()
		{
			gameWon=true;
		}
		
		function update(){
		if(gamestate==0)
		{
			if((keydown[KEYBOARD.KEY_UP]|| keydown[KEYBOARD.KEY_UP2])&& selectorArrow.y==280){
				selectorArrow.y=230;
			}
			else if((keydown[KEYBOARD.KEY_DOWN]|| keydown[KEYBOARD.KEY_DOWN2])&& selectorArrow.y==230){
				selectorArrow.y=280;
			}
			if(keydown[KEYBOARD.KEY_ENTER]&& selectorArrow.y==280){
				gamestate=1;
			}
			else if(keydown[KEYBOARD.KEY_ENTER]&& selectorArrow.y==230){
				gamestate=2;
				stage2init();
			}
			
		}
		else if(gamestate==1)
		{
		}
		else if(gamestate==2)
		{
			player.lastx= player.x;
			player.lasty= player.y;

			if(player.alive)
			{
				if(keydown[KEYBOARD.KEY_LEFT] && !player.collidedLeft){
					player.xAccel-=(500); 			
				}
				if(keydown[KEYBOARD.KEY_RIGHT]&& !player.collidedRight){
					player.xAccel+=(500); 
				}
				if(keydown[KEYBOARD.KEY_UP]&& !player.collidedTop && thrustFuel>0){
					player.yAccel+=(-1000);
					thrustFuel--;
				}
				if(keydown[KEYBOARD.KEY_DOWN]&& !player.collidedBottom){
					player.yAccel+=(1000);	
				}
				
				//updates player movement based on acceleration, then movement
				player.xVel=(player.xAccel/FPS);
				player.yVel=(player.yAccel/FPS);
				player.x+=(player.xVel/FPS);
				player.y+=(player.yVel/FPS);
				
				if(!player.collidedBottom)
				player.yAccel+=(GRAVITY);
				
				if(player.y>CANVAS_HEIGHT-player.height){
					if(thrustFuel<=95)
						thrustFuel+=2.5;
					player.xAccel*=(.92);
				}
				
				if(player.collidedBottom)
				{
					if(thrustFuel<=95)
					thrustFuel+=5;
					player.xAccel*=(.9);
				}
				
				//keeps everything in bounds
				if(player.x>CANVAS_WIDTH-player.width){
					player.x=CANVAS_WIDTH-player.width;
					player.xVel=player.xAccel=0;
				}	
				if(player.x<0){
					player.x=0;
					player.xVel=player.xAccel=0;
				}
				if(player.y>CANVAS_HEIGHT-player.height){
					player.y=CANVAS_HEIGHT-player.height;
					player.yVel=player.yAccel=0;
				}
				if(player.y<0){
					player.y=0;
					player.yVel=player.yAccel=0;
				}
				if(player.xAccel>12000){
					player.xAccel=12000;
				}
				if(player.xAccel<-12000){
					player.xAccel=-12000;
				}
				if(player.yAccel>15000){
					player.yAccel=15000;
				}
				if(player.yAccel<-15000){
					player.yAccel=-15000;
				}
				
				
				//CAMERA a
				if(player.x<(CANVAS_WIDTH/2))
				{
					var difference=(CANVAS_WIDTH/2)-player.x;
					player.x=(CANVAS_WIDTH)/2;
					playerBullets.forEach(function(bullet){
					bullet.x+=difference;});
					//draw enemies
					breakables.forEach(function(breakable){
					breakable.x+=difference;
					});		
					particles.forEach(function(p){
					p.location.x+=difference/3;
					});
					unbreakables.forEach(function(unbreakable){
					unbreakable.x+=difference;
					});		
					enemies.forEach(function(enemy){
					enemy.x+=difference;
					});	
					origin.x+=difference;
					bombSpot.x+=difference;
				}
				
				if(player.x+ player.width>(CANVAS_WIDTH/2))
				{
					var difference=(player.x+ player.width)-((CANVAS_WIDTH)/2);
					player.x=((CANVAS_WIDTH)/2) - player.width;
					playerBullets.forEach(function(bullet){
					bullet.x-=difference;});
					breakables.forEach(function(breakable){
					breakable.x-=difference;
					});	
					particles.forEach(function(p){
					p.location.x-=difference/3;
					});		
					unbreakables.forEach(function(unbreakable){
					unbreakable.x-=difference;
					});	
					enemies.forEach(function(enemy){
					enemy.x-=difference;
					});	
					origin.x-=difference;
					bombSpot.x-=difference;
				}
				
				if(player.y<(CANVAS_HEIGHT/3))
				{
					var difference=(CANVAS_HEIGHT/3)-player.y;
					player.y=(CANVAS_HEIGHT)/3;
					playerBullets.forEach(function(bullet){
					bullet.y+=difference;});
					breakables.forEach(function(breakable){
					breakable.y+=difference;
					});		
					particles.forEach(function(p){
					p.location.y+=difference/2;
					});
					unbreakables.forEach(function(unbreakable){
					unbreakable.y+=difference;
					});	
					enemies.forEach(function(enemy){
					enemy.y+=difference;
					});	
					origin.y+=difference;
					bombSpot.y+=difference;
				}
				
				if(player.y+ player.height>(CANVAS_HEIGHT/2))
				{
					var difference=(player.y+ player.height)-((CANVAS_HEIGHT)/2);
					player.y=((CANVAS_HEIGHT)/2) - player.height;
					playerBullets.forEach(function(bullet){
					bullet.y-=difference;});
					breakables.forEach(function(breakable){
					breakable.y-=difference;
					});	
					particles.forEach(function(p){
					p.location.y-=difference/4;
					});		
					unbreakables.forEach(function(unbreakable){
					unbreakable.y-=difference;
					});	
					enemies.forEach(function(enemy){
					enemy.y-=difference;
					});	
					origin.y-=difference;
					bombSpot.y-=difference;
				}
				
				if(gameWon && keydown[KEYBOARD.KEY_ENTER]){
					restartGame(); 			
				}
				
			}
			else //IF PLAYER IS NOT ALIVE
			{
				if(keydown[KEYBOARD.KEY_ENTER]){
					restartGame(); 			
				}
			}
			
			
			//Part II 
			//BULLETS
			cooldown--;
			
			playerBullets.forEach(function(bullet){
			bullet.update();});
			enemies.forEach(function(enemy){
			enemy.update();});
			playerBullets = playerBullets.filter(function(bullet){return bullet.active;});
			
			breakables = breakables.filter(function(breakable){
			return breakable.active;
			});
			enemies = enemies.filter(function(enemy){
			return enemy.active;
			});
			handleCollisions();
			
			if(returning && player.alive)
			{
				countdown-= (FPS/1000);
				if(countdown<0)
				{
					player.alive=false;
				}
			}
		}
		}//END UPDATE
		
		function draw(){
		
		if(gamestate==0)
		{
			drawBackground();
			ctx.drawImage(images["mainImage"],0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
			selectorArrow.draw();
		}
		else if(gamestate==1)
		{
			drawBackground();
			ctx.drawImage(images["instructionScreenImage"],0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
		}
		else if(gamestate==2)
		{
			drawBackground();
			if(player.alive)
			player.draw();
			
			//PART II
			playerBullets.forEach(function(bullet){
			bullet.draw();});
			//draw enemies
			breakables.forEach(function(breakable){
			if(breakable.inBounds()) 
			breakable.draw();
			});
			
			unbreakables.forEach(function(unbreakable){
			if(unbreakable.inBounds()) 
			unbreakable.draw();
			});
			
			enemies.forEach(function(enemy){
			if(enemy.inBounds()) 
			enemy.draw();
			});
			
			
			ctx.fillStyle= '#00FF00';
			ctx.font = 'bold 16px Arial, sans-serif';
			var fuelText = "Fuel Meter";
			var textSize2 = ctx.measureText(fuelText);
			var xCoord2 = (228-textSize2.width);
			ctx.fillText (fuelText, xCoord2, 20);		
			ctx.fillRect(150,20,thrustFuel*2,20);
			
			ctx.fillStyle= '#FF0000';
			ctx.font = 'bold 16px Arial, sans-serif';
			var healthText = "Health ";
			var textSize3 = ctx.measureText(healthText);
			var xCoord3 = (450-textSize3.width);
			ctx.fillText (healthText, xCoord3, 20);
			
			ctx.fillRect(400,20,player.health*20,20);
			
			if(gameWon)
			{
				ctx.fillStyle= '#FFFF00';
				ctx.font = 'bold 32px Arial, sans-serif';
				var fuelText = "YOU WIN";
				var textSize2 = ctx.measureText(fuelText);
				var xCoord2 = (228);
				ctx.fillText (fuelText, xCoord2, 200);	
				ctx.font = 'bold 24px Arial, sans-serif';
				ctx.fillText ("PRESS ENTER TO RESTART", 180, 150);	
			}
			else if(!player.alive)
			{
				ctx.fillStyle= '#FFFF00';
				ctx.font = 'bold 32px Arial, sans-serif';
				var fuelText = "GAME OVER";
				var textSize2 = ctx.measureText(fuelText);
				var xCoord2 = (228);
				ctx.fillText (fuelText, xCoord2, 200);	
				ctx.font = 'bold 24px Arial, sans-serif';
				ctx.fillText ("PRESS ENTER TO RESTART", 180, 150);	
			}
			else if(returning)
			{
				ctx.fillStyle= '#FFFF00';
				ctx.font = 'bold 28px Arial, sans-serif';
				var fuelText = "BOMB PLANTED! GET TO THE ENTRANCE!";
				var textSize2 = ctx.measureText(fuelText);
				var xCoord2 = (20);
				ctx.fillText (fuelText, xCoord2, 65);	
				ctx.font = 'bold 24px Arial, sans-serif';
				ctx.fillText ("TIME LEFT:" + Math.round((countdown/4),1), 180, 95);	
			}
			drawParticles();
			
			bombSpot.draw();
			
		}
		
		}//END DRAW
		
		
		function loadImages(){
				var numLoadedImages =0;
				var numImages = 0;
				//get num of sources 
					for(var imageName in IMAGE_SOURCES){
						numImages++;
					}
					
				//load iamges
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
		
		function restartGame()
		{
			drawBackground();
			//fire loop 30 times a second
			//PLAYER CLASS
			player= null;
			playerBullets = [];
			cooldown = 0;
			countdown=240;
			breakables= [];
			unbreakables= [];
			enemies= [];
			soundChannels = {};
			particles= [];
			stage2init();
			origin= {x:0, y:0};
			gameWon=false;
			returning=false;
		}