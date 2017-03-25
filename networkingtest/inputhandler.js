function InputHandler(xval,yval){
this.KEYBOARD = {
		"KEY_LEFT": 65,
		"KEY_UP": 87,
		"KEY_RIGHT": 68,
		"KEY_DOWN": 83,
		"KEY_ENTER": 13,
		"KEY_LEFT2": 37,
		"KEY_UP2": 38,
		"KEY_RIGHT2": 39,
		"KEY_DOWN2": 40,
		"KEY_SPACE": 32,
		"KEY_Q": 81,
		"KEY_SHIFT": 16,
		"KEY_ZERO": 96
		
		};
this.player1input= [];
this.player2input= [];
	this.keydown = [];
};
			
InputHandler.prototype.keyDown= function(key){
//console.log(key);
if(!this.keydown[key]){
	if(key==65 || key==87 || key==83 || key==68 || key==81){
		this.player1input.push(new InputTimer(key));
	}
	else if((key >=37 && key <=40) || key==96){
		this.player2input.push(new InputTimer(key));
	}
}
this.keydown[key]=true;
};

InputHandler.prototype.keyUp= function(key){
this.keydown[key]=false;
};

InputHandler.prototype.update= function(){
	//console.log(this.player1input. length + " " + this.player2input.length);
	for(var i = 0; i <this.player1input.length; i++){
	this.player1input[i].timer+=(FPS/2500);
		if(this.player1input[i].timer>0.3){
			this.player1input.splice(i,1);
		}
	}

	for(i = 0; i <this.player2input.length; i++){
	this.player2input[i].timer+=(FPS/2500);
		if(this.player2input[i].timer>0.3){
			this.player2input.splice(i,1);
		}
	}

}

InputHandler.prototype.player1DoubleTap = function(){
	if(this.player1input.length>=2){
		if(this.player1input.length==4){
			var tally5=0, tally6=0, tally7=0,tally8=0;
			for(var i=0; i<this.player1input.length; i++){
				var curkey=this.player1input[i].key;
				switch(curkey){
					case 65:
					tally5++;
					break;
					case 83:
					tally6++;
					break;
					case 68:
					tally7++;
					break;
					case 87:
					tally8++;
					break;
				}
			}
			if(tally5==2){
				if(tally8==2){
					this.player1input.splice(0,4);
					return 5;
				}else if(tally6==2){
					this.player1input.splice(0,4);
					return 6;
				}
			}else if(tally7==2){
				if(tally8==2){
					this.player1input.splice(0,4);
					return 8;
				}else if(tally6==2){
					this.player1input.splice(0,4);
					return 7;
				}
			
			}
		}
	
		if(this.player1input[0].key==65 && this.player1input[1].key==65){
			return 1;
			player1input.splice(0,2);
		}
		if(this.player1input[0].key==83 && this.player1input[1].key==83){
			return 2;
			player1input.splice(0,2);
		}
		if(this.player1input[0].key==68 && this.player1input[1].key==68){
			return 3;
			player1input.splice(0,2);
		}
		if(this.player1input[0].key==87 && this.player1input[1].key==87){
			return 4;
			player1input.splice(0,2);
		}
	}
	return 0;
}

InputHandler.prototype.player2DoubleTap = function(){
	
	if(this.player2input.length>=2){
		if(this.player2input.length==4){
			
			var tally5=0, tally6=0, tally7=0,tally8=0;
			for(var i=0; i<this.player2input.length; i++){
				var curkey=this.player2input[i].key;
				switch(curkey){
					case 37:
					tally5++;
					break;
					case 40:
					tally6++;
					break;
					case 39:
					tally7++;
					break;
					case 38:
					tally8++;
					break;
				}
			}
			if(tally5==2){
				if(tally8==2){
					this.player2input.splice(0,4);
					return 5;
				}else if(tally6==2){
					this.player2input.splice(0,4);
					return 6;
				}
			}else if(tally7==2){
				if(tally8==2){
					this.player2input.splice(0,4);
					return 8;
				}else if(tally6==2){
					this.player2input.splice(0,4);
					return 7;
				}
			
			}
		}
		if(this.player2input[0].key==37 && this.player2input[1].key==37){
			return 1;
			player2input.splice(0,2);
		}
		if(this.player2input[0].key==40 && this.player2input[1].key==40){
			return 2;
			player2input.splice(0,2);
		}
		if(this.player2input[0].key==39 && this.player2input[1].key==39){
			return 3;
			player2input.splice(0,2);
		}
		if(this.player2input[0].key==38 && this.player2input[1].key==38){
			return 4;
			player2input.splice(0,2);
		}
	
	}
	return 0;
}

InputHandler.prototype.printDoubleTap = function(){
	for(var i = 0; i <this.player1input.length; i++){
	}
	for(i = 0; i <this.player2input.length; i++){
	}
}

