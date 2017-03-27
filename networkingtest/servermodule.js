var serverName = "ws://pure-chamber-80976.herokuapp.com";
  
function ServerConnection()
{		
	this.socket = new WebSocket(serverName);
    // Handle any errors that occur.
    this.socket.onerror = function(error) {
      console.log('WebSocket Error: ' + error);
    };


    // Show a connected message when the WebSocket is opened.
    this.socket.onopen = function(event) {
        console.log("connected");
    };


      // Handle messages sent by the server.
    this.socket.onmessage = function(event) 
    {
     var message = event.data;
      console.log(message);
    };
    
    // Show a disconnected message when the WebSocket is closed.
    this.socket.onclose = function(event) 
    {
      console.log("disconnected");
    };
};