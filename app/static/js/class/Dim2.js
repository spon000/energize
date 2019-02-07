define([
], function () {

  return (
    // Class that represents a 2 dimensional point.
    class Dim2 {
      constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
      }

      // Getters...
      get x() {
        return this._x;
      }

      get y() {
        return this._y;
      }

      // Setters...
      set x(x) {
        this._x = x;
      }

      set y(y) {
        this._y = y;
      }

    });
});