define([
  "easeljs",
  "phaser",
  "canvasData"
], function (createjs, Phaser, canvasData) {
  return (
    class View {
      constructor(params = {}) {
        this._canvasElementId = params.elementId || "canvas";
        this._width = params.width || 300;
        this._height = params.height || 200;
        this._enableMouseOver = params.enableMouseOver || true;

        this._stage = new Phaser.Game(params.phaserConfig)
        this._stage.preload = this._preload;
        this._stage.create = this._create;
        this._stage.update = this._update;

        // this._stage = new createjs.Stage(this._canvasElementId);
        // if (this._enableMouseOver)
        //   this._stage.enableMouseOver();
      }

      // Private methods


      // Public methods
      addLayer(layer) {

      }

    });
});
