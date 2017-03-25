function AudioEffect(channel,trackURL,volume){
	/* 
	Kill old channel if we want
	Probably a good idea if you don't like crashes
	*/
	if (soundChannels[channel]) soundChannels[channel].kill();
		
	soundChannels[channel] = this;
	this.myAudio = new Audio();
	if(this.myAudio.canPlayType("audio/mpeg")){
		trackURL += ".mp3";
	} else {
		trackURL += ".wav";
	}
	this.myAudio.src = trackURL;
	this.myAudio.volume = volume;
		
	this.myAudio.play();
		
}
	
AudioEffect.prototype.kill = function(){
	if(this.myAudio){
		this.myAudio.pause();
		this.myAudio.src = "";
	} 
}