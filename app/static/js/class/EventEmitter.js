define([
], function () {
  return (
    class EventEmitter {
      constructor() {
        this._events = {};
        this._paused = false;
      }

      get paused() {
        return this._paused;
      }

      set paused(paused) {
        this._paused = paused;
      }

      on(evt, listener) {
        // console.log("EventEmitter.on = ", evt, " : ", listener);
        (this._events[evt] || (this._events[evt] = [])).push(listener);
        return this;
      }

      emit(evt, arg = {}) {
        // console.log("EventEmitter.emit = ", evt, " : ", arg);
        if (!this._paused) (this._events[evt] || []).slice().forEach(lsn => lsn(arg));
      }

    });
});