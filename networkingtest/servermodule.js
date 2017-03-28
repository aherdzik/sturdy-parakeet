var serverName = "ws://pure-chamber-80976.herokuapp.com";
//var serverName = "ws://127.0.0.1:5000";
 
function ServerConnection()
{		
	this.socket = new WebSocket(serverName);
    this.current_state = "disconnected";
    // Handle any errors that occur.
    this.socket.onerror = function(error) {
      console.log('WebSocket Error: ' + error);
    };


    // Show a connected message when the WebSocket is opened.
    this.socket.onopen = function(event) {
        this.current_state = "connected";
        this.connected = true;
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
      this.current_state = "disconnected";
      this.connected = false;
    };
};

ServerConnection.prototype.sendMessage = function(message)
{
    this.socket.send(message);
}