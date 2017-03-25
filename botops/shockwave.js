function Shockwave(xval,yval,orientationval){
this.x=xval;
this.y=yval;
this.orientation=orientationval;
this.alpha=10;
this.width=75;
this.height=75;
}

Shockwave.prototype.draw= function(){
ctx.globalAlpha=0.1*this.alpha;
switch(this.orientation){
	case 1:
		ctx.drawImage(images["blast1Image"],this.x,(this.y-this.height/2),this.width,this.height);
	break;
	case 2:
		ctx.drawImage(images["blast2Image"],this.x- (this.width/2),this.y-this.height,this.width,this.height);
	break;
	case 3:
		ctx.drawImage(images["blast3Image"],this.x-this.width,this.y-(this.height/2),this.width,this.height);
	break;
	case 4:
		ctx.drawImage(images["blast4Image"],this.x-(this.width/2),this.y,this.width,this.height);
	break;
}
this.alpha--;
this.width+=5;
this.height+=5;
}