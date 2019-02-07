define([
  "jquery",
  "Dim2",
  "easeljs"
], function ($, Dim2, createjs) {

  return (
    class CanvasView {
      constructor(canvasElementId) {
        this._canvasElementId = canvasElementId;
        this._stage = new createjs.Stage(canvasElementId);
        this._width = $("#" + canvasElementId).attr("width");
        this._height = $("#" + canvasElementId).attr("height");
        this._zoomLevel = 0;
        this._scaleMap = [new Dim2(1, 1)];
        this._tileMaps = [];

        // Event handler stubbs
        // Mouse events:
        this._onCityMouseIn = null;
        this._onCityMouseOut = null;
        this._onFacilityMouseIn = null;
        this._onFacilityMouseOut = null;
        this._onFacilityClick = null;
        this._onMapClick = null;
        this._onMapDoubleClick = null;
        this._onMapShiftDoubleClick = null;
        this._onMapDrag = null;

        // Keyboard events:
        this._keyboardInput = null;

        // Network events via socketio:

      }

      //////////////////////////////////////////////////////////////
      // Getters...
      get width() {
        return this._width;
      }

      get height() {
        return this._height;
      }

      get context() {
        return this._canvas.getContext("2d");
      }

      get stage() {
        return this._stage;
      }

      get zoomLevel() {
        return this._zoomLevel;
      }

      get scaleMap() {
        return this._scaleMap;
      }

      get tileMaps() {
        return this._tileMaps;
      }

      // Setters...
      set zoomLevel(zoomLevel) {
        if (zoomLevel >= this._scaleMap.length)
          this._zoomLevel = this._scaleMap.length - 1;
        else if (zoomLevel < 0)
          this._zoomLevel = 0;
        else
          this._zoomLevel = zoomLevel;

        this._setScale();
      }

      set scaleMap(scaleMap) {
        this._scaleMap = scaleMap;
      }

      set tileMaps(tileMaps) {
        this._tileMaps = tileMaps;
      }

      /////////////////////////////////////////////////////////////
      // Public Methods
      addTileMap(tileMap, index = null) {
        if (index === null) {
          this._tileMaps.push(tileMap);
          this._stage.addChild(tileMap.container);
        }
        else {
          this._tileMaps.splice(index, 0, tileMap);
          this._stage.addChildAt(tileMap.container, index);
        }

        this._setScale();
      }

      removeTileMap(tileMapName) {
        const index = this._getTileMapIndex(tileMapName);
        if (index >= 0) {
          this._tileMaps.splice(index, 1);
          this._stage.removeChildAt(index);
        }
      }

      startCanvasTimer(fps = .4) {
        createjs.Ticker.framerate = fps;
        createjs.Ticker.on("tick", this._updateCanvas, this);
      }

      pauseCanvasTimer(pause = true) {
        createjs.Ticker.paused = pause;
      }

      ///////////////////////////////////////////////////////////////////
      // Private Methods

      _setScale() {
        this._stage.children.forEach((child) => {
          child.scaleX = this._scaleMap[this._zoomLevel].x;
          child.scaleY = this._scaleMap[this._zoomLevel].y;
        });
      }

      _updateCanvas(evt) {
        if (!evt.paused) {
          //console.log("updating stage...", this._stage);
          this._stage.update();
        }
      }

      _getTileMapIndex(tileMapName) {
        this._tileMaps.find((tileMap, idx) => {
          if (tileMap.name === tileMapName)
            return idx;
        });
        return -1;
      }
    })
});