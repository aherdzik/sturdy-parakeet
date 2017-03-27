function Square(xval,yval, size)
{		
	this.x = xval;
	this.y = yval;
	this.size= size;
};

Square.prototype.draw= function()
{
    ctx.drawImage(images["squareImage"],(this.x-this.size)+global_offset_x,(this.y- this.size)+global_offset_y,this.size*2,this.size*2);
};

Square.prototype.update = function()
{
}