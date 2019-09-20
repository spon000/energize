define([
  "jquery",
  "socketio",
  "evtEmitter",
], function ($, socketio, evtEmitter) {
  return (
    class SocketIOCalls {
      constructor() {
        this._playerSocket = null;
      }

      initializeSocket(domain, port) {
        this._playerSocket = socketio.connect('http://' + domain + ':' + port)
        this._onMessages = [];
        // console.log("playerSocket = ", this._playerSocket);
      }

      sendMessageEmit(msg, data) {
        data = JSON.stringify(data);
        // console.log("sendMessageEmit() data = ", data);
        this._playerSocket.emit(msg, data)
      }

      sendMessageReturn(msg, data, callback = null) {
        data = JSON.stringify(data);
        // console.log("data = ", data);
        this._playerSocket.emit(msg, data, callback)
      }

      listenForMessage(msg, events, data = {}) {
        this._playerSocket.on(msg, (results) => {
          let listEvents = [].concat(events);
          data['socketio_data'] = results;
          // console.log("listenForMessage()... recevied msg: ", msg);
          // console.log("data = ", data);
          if (data['socketio_data']) {
            if (data['socketio_data'].socketio_players.includes(globalPlayerNumber))
              listEvents.forEach((event) => evtEmitter.emit(event, data))
          }
          else
            listEvents.forEach((event) => evtEmitter.emit(event, data))
        });
      }

    });
});
