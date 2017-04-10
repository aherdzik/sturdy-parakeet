function NetworkedPlayer(xval,yval, rotVal)
{		
	this.x = xval;
	this.y = yval;
    this.rotation = rotVal;
	this.size= 50;
};

NetworkedPlayer.prototype.draw= function()
{
    ctx.save();

    // move to the center of the canvas
    ctx.translate((this.x)+global_offset_x,(this.y)+global_offset_y);

    // rotate the canvas to the specified radians
    ctx.rotate(this.rotation);

    ctx.drawImage(images["outsidePlayerImage"],this.size * -1,this.size * -1,this.size*2,this.size*2);  
    
    // we’re done with the rotating so restore the unrotated context  
    ctx.restore();
};

NetworkedPlayer.prototype.update = function()
{
}