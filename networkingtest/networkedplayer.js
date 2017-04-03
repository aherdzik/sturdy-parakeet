function NetworkedPlayer(xval,yval)
{		
	this.x = xval;
	this.y = yval;
    this.rotation = 0;
	this.size= 50;
};

NetworkedPlayer.prototype.draw= function()
{
    ctx.save();

    ctx.translate(this.x,this.y);

    // rotate the canvas to the specified radians
    ctx.rotate(this.rotation);

    ctx.drawImage(images["outsidePlayerImage"],this.radius * -1,this.radius * -1,this.radius*2,this.radius*2);  
    
    // we’re done with the rotating so restore the unrotated context  
    ctx.restore();
};

NetworkedPlayer.prototype.update = function()
{
}