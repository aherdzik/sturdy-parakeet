function Powerup(xval,yval,isItHealth){
this.x=xval;
this.y=yval;
this.isHealth=isItHealth;
this.radius=25;
this.wavetimer=0;
};

Powerup.prototype.draw= function(){
	if(this.isHealth){
		ctx.drawImage(images["healthImage"],this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
	}else{
		ctx.drawImage(images["energyImage"],this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
	}
	this.y+=(Math.sin(this.wavetimer/20));
	//this.y+=10;
	this.wavetimer++;
}
