function Player(xval,yval, massval, playernumber){
			
	this.color= "gray";
	this.x = xval;
	this.y = yval;
	this.xVel =0;
	this.yVel = 0;
	this.xAccel= 0;
	this.yAccel = 0;
	this.wallBounce=0.5;
	this.friction=0.95;
	this.HP= 50;
	this.energy=100; 
	this.dashtimer=0;
	this.energyuptimer=0;
	this.canShield=true;
	this.dashing=false;
	this.mass=massval;
	this.radius= this.mass;
	this.speed= 5;
	this.health=5;
	this.shieldOn=false;
	this.number=playernumber;
	};
			
Player.prototype.draw= function(){
	if(this.number==1){
		if(this.energyuptimer>0){
			ctx.drawImage(images["playerImageEnergy"],this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
		}else{
			ctx.drawImage(images["playerImage"],this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
		}
		
	}
	else if(this.number==2){
		if(this.energyuptimer>0){
			ctx.drawImage(images["player2ImageEnergy"],this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
		}else{
			ctx.drawImage(images["player2Image"],this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
		}
	}
	if(this.shieldOn){
		if(this.number==1){
			ctx.strokeStyle="orange";
		}
		else if(this.number==2){
			ctx.strokeStyle="purple";
		}
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
		ctx.stroke();
	}
	//ctx.arc(this.x,this.y,40,0,2*Math.PI);
	//ctx.stroke();
	
		/*ctx.save();
		ctx.translate(pos.x,pos.y);
		var rotation= Math.atan2(mouse.y-pos.y,mouse.x-pos.x);
		ctx.rotate(rotation);
		ctx.restore();*/
};

Player.prototype.killHorizontalMomentum= function(isLeft){
	if(Math.abs(this.xVel)>1200){
		if(isLeft){
		shockwaves.push(new Shockwave(this.x-this.radius,this.y,1));
		}else{
			shockwaves.push(new Shockwave(this.x+this.radius,this.y,3));
		}
		new AudioEffect(AUDIO_CHANNEL.CHANNEL_EXPLOSION, AUDIO_SOURCES.AUDIO_EXPLOSION, 1.0);
	}
	this.dashing=false;
	this.xVel *= -1 * this.wallBounce;
	this.xVel*=this.friction;
	this.yVel*=this.friction;
	this.yAccel*=0.5;
};

Player.prototype.killVerticalMomentum= function(isDown){
	if(Math.abs(this.yVel)>1000){
		if(isDown){
		shockwaves.push(new Shockwave(this.x,this.y+this.radius,2));
		}else{
			shockwaves.push(new Shockwave(this.x,this.y-this.radius,4));
		}
		new AudioEffect(AUDIO_CHANNEL.CHANNEL_EXPLOSION, AUDIO_SOURCES.AUDIO_EXPLOSION, 1.0);
	}

	this.dashing=false;
	this.yVel*= -1 * this.wallBounce;
	this.xVel*=this.friction;
	this.yVel*=this.friction;
	this.yAccel*=0.5;
};

Player.prototype.keepInBounds= function(){

	if(this.x<this.radius){
			this.x=this.radius;
			this.killHorizontalMomentum(true);
		}
		if(this.x>CANVAS_WIDTH- (this.radius)){
			this.x=CANVAS_WIDTH-(this.radius)-0.25;
			this.killHorizontalMomentum(false);
		}
		if(this.y<this.radius){
			this.y=this.radius;
			this.killVerticalMomentum(false);	
		}
		if(this.y>CANVAS_HEIGHT- (this.radius)){
			this.y=CANVAS_HEIGHT-(this.radius)-0.25;
			this.killVerticalMomentum(true);	
		}
}

Player.prototype.update = function(){
	if(this.energy>15){
		this.canShield=true;
	}else{
		this.canShield=false;
	}
	this.yAccel+=GRAVITY;
	this.xVel+=(this.xAccel/FPS);
	this.yVel+=(this.yAccel/FPS);
	this.x+=(this.xVel/FPS);
	this.y+=(this.yVel/FPS);
	if(this.shieldOn){
		this.energy-=1.5;
	}
	this.energy+=0.5;
	if(this.energy>100){
		this.energy=100;
	}
	this.dashtimer-=(0.04);
	if(this.energyuptimer>0){
		this.energy=100;
		this.energyuptimer--;
		dashtimer=0;
	}
	
}



