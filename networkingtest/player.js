function Player(xval,yval)
{		
	this.color= "gray";
	this.x = xval;
	this.y = yval;
	this.xVel =0;
	this.yVel = 0;
    this.xVelCap= 100;
    this.yVelCap= 100;
	this.xAccel= 0;
	this.yAccel = 0;
	this.radius= 50;
};
			
Player.prototype.draw= function()
{
    ctx.drawImage(images["playerImage"],player_location_x-this.radius,player_location_y-this.radius,this.radius*2,this.radius*2);
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
        this.xVel-=(10); 			
    }
    if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_RIGHT])
    {
        this.xVel+=(10); 
    }
    if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_UP])
    {
        this.yVel+=(-10);
    }
    if(inputHandler.keydown[inputHandler.KEYBOARD.KEY_DOWN])
    {
        this.yVel+=(10);	
    }
}

Player.prototype.physicsUpdate = function()
{
    console.log((this.yVel * -1) + " ");
    this.xVel+=(this.xAccel/FPS);
    this.xVel = this.xVel > this.xVelCap? this.xVelCap : this.xVel;
    this.xVel = (this.xVel) < (this.xVelCap * -1)? this.xVelCap* -1 : this.xVel;
    
	this.yVel+=(this.yAccel/FPS);
    //console.log((this.xVel * -1));
    //console.log((this.xVelCap * -1));
    this.yVel = this.yVel > this.yVelCap? this.yVelCap : this.yVel;
    this.yVel = (this.yVel) < (this.yVelCap * -1)? (this.yVelCap* -1) : this.yVel;
    
	this.x+=(this.xVel/FPS);
	this.y+=(this.yVel/FPS);
}




