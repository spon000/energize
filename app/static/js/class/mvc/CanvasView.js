define([
  "jquery",
  "jqueryui",
  "Dim2",
  "easeljs",
  "EventEmitter"
], function ($, $UI, Dim2, createjs, EventEmitter) {

  return (
    class CanvasView extends EventEmitter {
      constructor(canvasElementId, model) {
        super();
        this._canvasElementId = canvasElementId;
        this._canvasModel = model;
        this._infoDialogElementId = "infodialogbox";
        this._stage = new createjs.Stage(canvasElementId);
        this._stage.enableMouseOver();
        this._width = $("#" + canvasElementId).attr("width");
        this._height = $("#" + canvasElementId).attr("height");
        this._zoomLevel = 0;
        this._scaleMap = [new Dim2(1, 1)];
        this._tileMaps = [];
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

      startCanvasTimer(fps = 20) {
        createjs.Ticker.framerate = fps;
        createjs.Ticker.on("tick", this._updateCanvas, this);
      }

      pauseCanvasTimer(pause = true) {
        createjs.Ticker.paused = pause;
      }

      addEventToCanvasMap(tileMap, event, listener, scope) {
        $(this._stage.canvas).on(event, { tileMap: tileMap, scope: scope }, listener);
      }

      removeEventsFromCanvasMap(tileMap, events = []) {

      }

      addEventToTileMap(tileMap, event, listener, scope) {
        // console.log("tileMap = ", tileMap);
        let tileMapTiles = tileMap.tileMapTiles;
        for (let tileName in tileMapTiles) {
          if (!(tileMapTiles[tileName].sprite.hasEventListener(event))) {
            tileMapTiles[tileName].sprite.on(event, listener, scope, false, tileMapTiles[tileName]);
            //$(tileMapTiles[tileName].sprite).on(event, tileMapTiles[tileName], listener);
          }
        }
      }

      removeEventsFromTileMap(tileMap, events = []) {

      }

      // Event functions
      displayRolloverInfo(evt, html) {
        if (html) {
          // console.log("html = ", html);
          $("#" + this._infoDialogElementId).dialog({
            position: { my: "left+10 bottom-10", of: evt.nativeEvent },
            dialogClass: "no-close-button",
            // width: 350
          });
          $("#" + this._infoDialogElementId).append(html);
          $("#" + this._infoDialogElementId).dialog({
            title: $("#dialog").attr("title"),
            width: parseInt($("#dialog").attr("width")) || 350
          })
        }
        else {
          $("#" + this._infoDialogElementId).empty();
          $("#" + this._infoDialogElementId).dialog("destroy");
        }
      }

      faclityUpdateDialog(html) { }

      facilityBuildDialog(html) { }

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
        return this._tileMaps.findIndex((tileMap) => (tileMap.name === tileMapName));
      }

    });
});
