// Created from https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/
define([
], function () {
  return (
    class PubSub {
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

      subscribe(event, callback) {
        let self = this;
        // console.log("PubSub.subscribe = ", event, " : ", callback);
        (self._events[event] || (self._events[event] = [])).push(callback);
        return self;
      }

      publish(event, data = {}) {
        let self = this;
        // console.log("PubSub.publish = ", event, " : ", data);
        if (!self._paused) (self._events[event] || []).slice().forEach(callback => callback(data));
      }

    });
});