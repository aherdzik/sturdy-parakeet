function Player(xval,yval)
{		
	this.color= "gray";
	this.x = xval;
	this.y = yval;
	this.xVel =0;
    this.rotation = 0;
	this.yVel = 0;
    this.xVelCap= 300;
    this.yVelCap= 300;
    this.velIncrease= 30;
	this.xAccel= 0;
	this.yAccel = 0;
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
    if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_LEFT])
    {
        this.xVel-=(this.velIncrease); 			
    }
    if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_RIGHT])
    {
        this.xVel+=(this.velIncrease); 
    }
    if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_UP])
    {
        this.yVel-=(this.velIncrease);
    }
    if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_DOWN])
    {
        this.yVel+=(this.velIncrease);	
    }
}

Player.prototype.physicsUpdate = function()
{
    this.xVel+=(this.xAccel/FPS);
    
    //caps X velocity
    this.xVel = this.xVel > this.xVelCap? this.xVelCap : this.xVel;
    this.xVel = (this.xVel) < (this.xVelCap * -1)? this.xVelCap* -1 : this.xVel;
    
    //caps Y velocity
	this.yVel+=(this.yAccel/FPS);
    this.yVel = this.yVel > this.yVelCap? this.yVelCap : this.yVel;
    this.yVel = (this.yVel) < (this.yVelCap * -1)? (this.yVelCap* -1) : this.yVel;
    
	this.x+=(this.xVel/FPS);
	this.y+=(this.yVel/FPS);
}




