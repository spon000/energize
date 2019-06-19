define([
  // Libs
  "easeljs"
], function (createjs) {
  return (
    // Class that represents a grid of tiles.
    class LayerItem {
      constructor(params = {}) {
        this._id = params.id || 0;
        this._width = params.width || 300;
        this._height = params.height || 200;
        this._x = params.x || 0;
        this._y = params.y || 0;
        this._name = params.name || "Layer";
        this._type = params.name || "unknown";
        this._scaleX = params.scaleX || 1;
        this._scaleY = params.scaleY || 1;
        this._scaleToLayer = true;
        this._item = params.item || null;
        this._zIndex = params.zIndex || 1;
      }

      // Getters


      // Public Methods


    });
});