function Square(xval,yval, size)
{		
	this.x = xval;
	this.y = yval;
	this.size= size;
};

Square.prototype.draw= function()
{
    console.log("SQUAREDRAW");
    ctx.drawImage(images["squareImage"],(this.x-this.size)+player_location_x-global_x,(this.y- this.size)+player_location_y-global_y,this.size*2,this.size*2);
};

Square.prototype.update = function()
{
}