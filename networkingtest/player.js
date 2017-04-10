function Player(xval,yval)
{		
	this.color= "gray";
	this.x = xval;
	this.y = yval;
	this.xVel =0;
    this.rotation = 0;
	this.yVel = 0;
    this.velCap= 300;
    this.velIncrease= 30;
	this.accel=0;
	this.radius= 50;
};
			
Player.prototype.draw= function()
{
    ctx.save();

    // move to the center of the canvas
    ctx.translate(player_location_x,player_location_y);

    // rotate the canvas to the specified radians
    ctx.rotate(this.rotation);

    ctx.drawImage(images["playerImage"],this.radius * -1,this.radius * -1,this.radius*2,this.radius*2);  
    
    // we’re done with the rotating so restore the unrotated context  
    ctx.restore();
};

Player.prototype.update = function()
{
    this.inputUpdate();
    this.physicsUpdate();
}

Player.prototype.inputUpdate = function()
{
    if(mouseDown)
    {
        this.xVel+=(this.velIncrease)*-Math.sin(this.rotation);
        this.yVel+=(this.velIncrease)*Math.cos(this.rotation);
    }
}

Player.prototype.physicsUpdate = function()
{
    
    var currentTan = Math.atan2(this.xVel, this.yVel) * -1;
    var xVelCap = Math.abs(this.velCap *-Math.sin(currentTan));
    var yVelCap = Math.abs(this.velCap *Math.cos(currentTan));
    
    this.xVel = this.xVel > xVelCap? xVelCap : this.xVel;
    this.xVel = this.xVel < xVelCap * -1? xVelCap* -1 : this.xVel;
    
    //caps Y velocity
    this.yVel = this.yVel > yVelCap? yVelCap : this.yVel;
    this.yVel = this.yVel < yVelCap * -1? yVelCap* -1 : this.yVel;
    
	this.x+=(this.xVel/FPS);
	this.y+=(this.yVel/FPS);
}




