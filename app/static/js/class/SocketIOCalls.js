define([
  "jquery",
  "EventEmitter",
  "socketio"
], function ($, EventEmitter, socketio) {
  return (
    class SocketIOCalls extends EventEmitter {
      constructor(socket) {
        super();
        this._playerSocket = socket;
      }

      // Sending to server
      newFacility(gid, row, column) {
        console.log("calling newFacility()");
        this._playerSocket.emit('new_facility',
          {
            gid: parseInt(gid),
            row: row,
            column: column
          }, (fdata) => {
            console.log("fdata = ", fdata)
          });
        return fdata;
      }

      _buildFacility(data) {

      }

      _nextTurn(data) {

      }

    });
});
