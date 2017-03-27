function Player(xval,yval)
{		
	this.color= "gray";
	this.x = xval;
	this.y = yval;
	this.xVel =0;
	this.yVel = 0;
	this.xAccel= 0;
	this.yAccel = 0;
	this.radius= 50;
};
			
Player.prototype.draw= function()
{
    ctx.drawImage(images["playerImage"],player_location_x-this.radius,player_location_y-this.radius,this.radius*2,this.radius*2);
};

Player.prototype.update = function(){
	this.xVel+=(this.xAccel/FPS);
	this.yVel+=(this.yAccel/FPS);
	this.x+=(this.xVel/FPS);
	this.y+=(this.yVel/FPS);
}



