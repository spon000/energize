define([
  // Libs
  "easeljs"
], function (createjs) {
  return (
    // Class that represents a grid of tiles.
    class Layer {
      constructor(params = {}) {
        this._width = params.width || 300;
        this._height = params.height || 200;
        this._x = params.x || 0;
        this._y = params.y || 0;
        this._name = params.name || "Layer";
        this._scaleX = params.scaleX || 1;
        this._scaleY = params.scaleY || 1;

        this._container = new createjs.Container();
        this._container.width = this._width;
        this._container.height = this._height;
        this._container.x = this._x;
        this._container.y = this._y;
        this._container.scaleX = this._scaleX;
        this._container.scaleY = this._scaleY;

        this._items = [];
      }

      // Getters
      get container() {
        return this._container;
      }


      // Public Methods
      addItem(x = 0, y = 0, item = null) {

      }

    });
});