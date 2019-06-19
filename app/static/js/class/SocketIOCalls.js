define([
  "jquery",
  "socketio",
  "evtEmitter"
], function ($, socketio, evtEmitter) {
  return (
    class SocketIOCalls {
      constructor(socket) {
        this._playerSocket = socket;
      }

      // Sending to server
      clientConnect(gid) {
        this._playerSocket.emit('client_connect', { gid: gid })
      }

      clientDisconnect(gid) {
        this._playerSocket.emit('client_disconnect', { gid: gid })
      }

      newFacility(gid, row, column) {
        console.log("calling newFacility() ee = ", evtEmitter);
        evtEmitter.emit('new_facility', {
          gid: parseInt(gid),
          row: row,
          column: column
        }, (fdata) => {
          console.log("fdata = ", fdata)
        });
        // return fdata;
      }

      _buildFacility(data) {

      }

      _nextTurn(data) {

      }

    });
});
