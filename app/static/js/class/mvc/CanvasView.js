define([
  "jquery",
  "jqueryui",
  "Dim2",
  "easeljs",
  "canvasData",
  "EventEmitter"
], function ($, $UI, Dim2, createjs, canvasData, EventEmitter) {

  return (
    class CanvasView extends EventEmitter {
      constructor(canvasElementId, model) {
        super();
        this._canvasElementId = canvasElementId;
        this._canvasModel = model;
        this._infoDialogElementId = "infodialogbox";
        this._stage = new createjs.Stage(canvasElementId);
        this._stage.enableMouseOver();
        this._width = canvasData.canvasConfig.width
        this._height = canvasData.canvasConfig.height
        this._zoomLevel = canvasData.canvasConfig.initialZoomLevel;
        this._mapOriginXY = new Dim2(canvasData.canvasConfig.initialOriginX, canvasData.canvasConfig.initialOriginY);

        // Based on tile dimensions. Each tile will be calculated with the current scale.
        this._scaleMap = canvasData.canvasConfig.scaleMap;
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
        else {
          this._zoomLevel = zoomLevel;
          this._zoomMap();
        }
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
        this._zoomMap();
      }

      removeTileMap(tileMapName) {
        const index = this._getTileMapIndex(tileMapName);
        if (index >= 0) {
          this._tileMaps.splice(index, 1);
          this._stage.removeChildAt(index);
        }
        this._zoomMap();
      }

      startCanvasTimer(fps = 30) {
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

      dragMap(evt) {
        let mouseMoveX = evt.originalEvent.movementX;
        let mouseMoveY = evt.originalEvent.movementY;
        if (Math.abs(mouseMoveX) <= 10) mouseMoveX = 50 * Math.sign(mouseMoveX)
        else if (Math.abs(mouseMoveX) <= 20) mouseMoveX = 100 * Math.sign(mouseMoveX)
        else if (Math.abs(mouseMoveX) <= 30) mouseMoveX = 150 * Math.sign(mouseMoveX)
        else mouseMoveX = 200 * Math.sign(mouseMoveX)

        if (Math.abs(mouseMoveY) <= 10) mouseMoveY = 50 * Math.sign(mouseMoveY)
        else if (Math.abs(mouseMoveY) <= 20) mouseMoveY = 100 * Math.sign(mouseMoveY)
        else if (Math.abs(mouseMoveY) <= 30) mouseMoveY = 60 * Math.sign(mouseMoveY)
        else mouseMoveY = 200 * Math.sign(mouseMoveY)
        this._moveMap(mouseMoveX, mouseMoveY);
      }

      wheelMapZoom(evt) {
        let wheelDeltaY = evt.originalEvent.deltaY < 0 ? 1 : -1
        let oldZoomLevel = this.zoomLevel;
        this.zoomLevel += wheelDeltaY;
        if (this.zoomLevel != oldZoomLevel)
          this._centerOrientZoom(evt.offsetX, evt.offsetY, wheelDeltaY);
      }

      displayRolloverInfo(evt, html) {
        if (html) {
          // console.log("html = ", html);
          $("#" + this._infoDialogElementId).empty();
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
          if ($("#" + this._infoDialogElementId).dialog()) {
            $("#" + this._infoDialogElementId).empty();
            $("#" + this._infoDialogElementId).dialog("destroy");
          }
        }

      }

      faclityUpdateDialog(html) { }

      facilityBuildDialog(html) { }

      ///////////////////////////////////////////////////////////////////
      // Private Methods

      _zoomMap() {
        this._tileMaps.forEach(tileMap => {
          tileMap.setScale(this._scaleMap[this._zoomLevel].x, this._scaleMap[this._zoomLevel].y);
        });
      }

      _centerOrientZoom(x, y, wheelDeltaY) {
        let clientX = x;
        let clientY = y;
        console.log("x : y : wheelDeltaY = " + x + " : " + y + " : " + wheelDeltaY);

        let scale = this._scaleMap[this._zoomLevel].x
        let prevScale = this._scaleMap[this._zoomLevel - wheelDeltaY].x;
        console.log("prevScale : scale = " + prevScale + " : " + scale);

        let containerWidth = canvasData.canvasConfig.width;
        let containerHeight = canvasData.canvasConfig.height;
        console.log("containerWidth : containerHeight = " + containerWidth + " : " + containerHeight);

        let prevWorldWidth = canvasData.terrainSpriteConfig.width * canvasData.terrainImageConfig.width * prevScale;
        let prevWorldHeight = canvasData.terrainSpriteConfig.height * canvasData.terrainImageConfig.height * prevScale;
        console.log("prevWorldWidth : prevWorldHeight = " + prevWorldWidth + " : " + prevWorldHeight);

        let worldWidth = canvasData.terrainSpriteConfig.width * canvasData.terrainImageConfig.width * scale;
        let worldHeight = canvasData.terrainSpriteConfig.height * canvasData.terrainImageConfig.height * scale;
        console.log("worldWidth : worldHeight = " + worldWidth + " : " + worldHeight);

        let percentXInCurrentBox = clientX / containerWidth;
        let percentYInCurrentBox = clientY / containerHeight;
        console.log("percentXInCurrentBox : percentYInCurrentBox = " + percentXInCurrentBox + " : " + percentYInCurrentBox);

        // let currentBoxWidth = areaWidth / scale;
        // let currentBoxHeight = areaHeight / scale;
        // console.log("currentBoxWidth : currentBoxHeight = " + currentBoxWidth + " : " + currentBoxHeight);

        // let nextBoxWidth = areaWidth * nextScale;
        // let nextBoxHeight = areaHeight * nextScale;
        // console.log("nextBoxWidth : nextBoxHeight = " + nextBoxWidth + " : " + nextBoxHeight);

        let deltaX = -Math.floor((worldWidth - prevWorldWidth) * (percentXInCurrentBox));
        let deltaY = -Math.floor((worldHeight - prevWorldHeight) * (percentYInCurrentBox));
        console.log("deltaX : deltaY = " + deltaX + " : " + deltaY);

        this._moveMap(deltaX, deltaY);


        //   // let scaleChangeX = 0;
        //   // let scaleChangeY = 0;
        //   // let scaledTileWidth = canvasData.terrainSpriteConfig.width * this._scaleMap[this._zoomLevel].x
        //   // let scaledTileHeight = canvasData.terrainSpriteConfig.height * this._scaleMap[this._zoomLevel].y
        //   // let worldWidth = scaledTileWidth * canvasData.terrainImageConfig.width;
        //   // let worldHeight = scaledTileHeight * canvasData.terrainImageConfig.height;
        //   // let worldX = x * Math.floor(worldWidth / canvasData.canvasConfig.width);
        //   // let worldY = y * Math.floor(worldHeight / canvasData.canvasConfig.height);
        //   // let deltaX = 0;
        //   // let deltaY = 0;
        //   // if (zoomIn) {
        //   //   scaleChangeX = this._scaleMap[this._zoomLevel].x - this._scaleMap[this._zoomLevel - 1].x;
        //   //   scaleChangeY = this._scaleMap[this._zoomLevel].y - this._scaleMap[this._zoomLevel - 1].y;
        //   //   // deltaX = -Math.floor(worldX * this._scaleMap[this._zoomLevel].x);
        //   //   // deltaY = -Math.floor(worldY * this._scaleMap[this._zoomLevel].y);
        //   //   deltaX = -Math.floor(x * scaleChangeX) - (worldX * scaleChangeX);
        //   //   deltaY = -Math.floor(y * scaleChangeY) - (worldY * scaleChangeY);
        //   // }
        //   // else {
        //   //   scaleChangeX = this._scaleMap[this._zoomLevel].x - this._scaleMap[this._zoomLevel + 1].x;
        //   //   scaleChangeY = this._scaleMap[this._zoomLevel].y - this._scaleMap[this._zoomLevel + 1].y;
        //   //   // deltaX = -Math.floor(worldX * this._scaleMap[this._zoomLevel].x);
        //   //   // deltaY = -Math.floor(worldX * this._scaleMap[this._zoomLevel].y);
        //   //   deltaX = -Math.floor(x * scaleChangeX);
        //   //   deltaY = -Math.floor(y * scaleChangeY);
        //   // }

        //   console.log("x : y = " + x + " : " + y);
        // console.log("worldX : worldY = " + worldX + " : " + worldY);
        // console.log("deltaX : deltaY = " + deltaX + " : " + deltaY);
        // console.log("scaleChangeX : scaleChangeY = " + scaleChangeX + " : " + scaleChangeY);
        //this._moveMap(deltaX, deltaY);


        // let canvasCenterX = Math.floor(canvasData.canvasConfig.width / 2);
        // let canvasCenterY = Math.floor(canvasData.canvasConfig.height / 2);

        // let scaledTileWidth = canvasData.terrainSpriteConfig.width * this._scaleMap[this._zoomLevel].x
        // let scaledTileHeight = canvasData.terrainSpriteConfig.height * this._scaleMap[this._zoomLevel].y
        // let worldWidth = scaledTileWidth * canvasData.terrainImageConfig.width;
        // let worldHeight = scaledTileHeight * canvasData.terrainImageConfig.height;
        // // let worldCenterX = Math.floor(worldWidth / 2);
        // // let worldCenterY = Math.floor(worldHeight / 2);
        // let worldX = x * Math.floor(worldWidth / canvasData.canvasConfig.width);
        // let worldY = y * Math.floor(worldHeight / canvasData.canvasConfig.height);
        // let deltaX = (canvasCenterX - worldX) - (canvasCenterX - x);
        // let deltaY = (canvasCenterY - worldY) - (canvasCenterY - y);
        // // let deltaX = (canvasCenterX - worldX); //- (canvasCenterX - x);
        // // let deltaY = (canvasCenterY - worldY); //- (canvasCenterY - y);
        // if (!zoomIn) {
        //   // deltaX = -(worldX - canvasCenterX); // + (x - canvasCenterX);
        //   // deltaY = -(worldY - canvasCenterY); // + (y - canvasCenterY);
        //   deltaX = -(worldX - canvasCenterX) + (x - canvasCenterX);
        //   deltaY = -(worldY - canvasCenterY) + (y - canvasCenterY);
        // }
        // console.log("x : y = " + x + " : " + y);
        // console.log("worldX : worldY = " + worldX + " : " + worldY);
        // console.log("deltaX : deltaY = " + deltaX + " : " + deltaY);
        // this._moveMap(deltaX, deltaY);
        // console.log("this = ", this);
      }

      _moveMap(deltaX, deltaY) {
        this._tileMaps.forEach((tileMap) => {
          tileMap.moveTileMap(deltaX, deltaY, canvasData.canvasConfig.width, canvasData.canvasConfig.height);
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
