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
     var received_obj = JSON.parse(event.data);
     switch (received_obj["messageType"]) 
    {
        case "moveupdateall":
        var playerPositions = received_obj["positions"];
        playerPositions.forEach(function(entry) 
        {
            if(!gameObjects.has(entry["name"]) && entry["name"] != playerName)
            {
                gameObjects.set(entry["name"], new NetworkedPlayer(entry["x"],entry["y"]));
            }
            else if(gameObjects.has(entry["name"]))
            {
                gameObjects.get(entry["name"])["x"] = entry["x"];
                gameObjects.get(entry["name"])["y"] = entry["y"];
            }
        });
        break;
        default:
        break;
    }
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