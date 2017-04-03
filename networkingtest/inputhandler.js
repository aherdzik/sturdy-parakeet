function InputHandler()
{
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
	this.keydown = [];
};
			
InputHandler.prototype.keyDown= function(key)
{
    this.keydown[key]=true;
};

InputHandler.prototype.keyUp= function(key)
{
    this.keydown[key]=false;
};

InputHandler.prototype.update= function()
{
}