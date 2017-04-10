function NetworkedPlayer(xval,yval)
{		
	this.x = xval;
	this.y = yval;
    this.rotation = 0;
	this.size= 50;
};

NetworkedPlayer.prototype.draw= function()
{
    ctx.drawImage(images["outsidePlayerImage"],(this.x-this.size)+global_offset_x,(this.y- this.size)+global_offset_y,this.size*2,this.size*2);
};

NetworkedPlayer.prototype.update = function()
{
}