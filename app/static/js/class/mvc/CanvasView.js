define([
  "jquery",
  "jqueryui",
  "Dim2",
  "easeljs",
  "canvasData",
], function ($, $UI, Dim2, createjs, canvasData) {

  return (
    class CanvasView {
      constructor(canvasElementId, model) {
        this._canvasElementId = canvasElementId;
        this._canvasModel = model;
        this._infoDialogElementId = "info-dialog";
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

      getTileMap(tileMapName) {
        const index = this._getTileMapIndex(tileMapName);
        return index >= 0 ? this._tileMaps[index] : null;
      }

      getRowCol(x, y) {
        let rowCol = this._tileMaps[0].getPoint(x, y)
        return new Dim2(rowCol.x, rowCol.y)
      }

      getTileGrid(tileMapName, colRow, width, height) {
        let tileMap = this.getTileMap(tileMapName);
        let originXY = new Dim2(Math.floor(width / 2), Math.floor(height / 2));
        let tileGrid = [];
        for (let row = 0 - originXY.y; row < height - originXY.y; row++) {
          let tileRow = [];
          for (let col = 0 - originXY.x; col < width - originXY.x; col++) {
            tileRow.push(this.getTile(tileMap, colRow.y + row, colRow.x + col));
          }
          tileGrid.push(tileRow);
        }
        return tileGrid;
      }

      getTile(tileMap, row, col) {
        return tileMap.getTile(row, col);
      }

      getTileForAllMaps(row, col) {
        let tileList = [];
        this.tileMaps.forEach((tileMap) => {
          tileList.push({
            [tileMap.name]: getTile.getTile(tileMap, row, col)
          });
        });
        return tileList;
      }

      checkForTile(tileName, tileGrid) {
        let tileFound = false;
        tileGrid.forEach((tileGridRow) => {
          if (tileGridRow.find(tile => tile && tile.name == tileName))
            tileFound = true;
        });
        return tileFound;
      }

      checkForTileRange(tileChecks, tileGrid) {
        let originY = Math.floor(tileGrid.length / 2);
        let originX = Math.floor(tileGrid[0].length / 2);
        let terrainFound = false;
        // console.log("originY : originX = ", originY + " : " + originX);
        // Check for prohibited terrains
        for (let tileRange in tileChecks.prohibited) {
          let iTileRange = parseInt(tileRange);
          for (let y = originY - iTileRange; y <= originY + iTileRange; y++) {
            for (let x = originX - iTileRange; x <= originX + iTileRange; x++) {
              // console.log("y : x : tileGrid[y][x] = ", y + " : " + x + " : ", tileGrid[y][x]);
              if (tileChecks.prohibited[tileRange].find(tileName => tileName == tileGrid[y][x].name)) {
                // console.log("prohibitied tile found...");
                return false;
              }
            }
          }
        }

        // Check for allowed terrains
        for (let tileRange in tileChecks.allowed) {
          let iTileRange = parseInt(tileRange);
          for (let y = originY - iTileRange; y <= originY + iTileRange; y++) {
            for (let x = originX - iTileRange; x <= originX + iTileRange; x++) {
              if (tileChecks.allowed[tileRange].find(tileName => tileName == tileGrid[y][x].name)) {
                return true;
              }
            }
          }
        }
        return false;
      }

      checkForTileAt(tileName, tileGrid, locationXY) {
        return tileName == tileGrid[locationXY.x][locationXY.y] ? true : false;
      }

      checkFacilityTerrain(colRow, terrainList) {
        return null;
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
            position: {
              my: ((evt.stageX > (canvasData.canvasConfig.width / 2)) ? "right-20 " : "left+20 ") +
                ((evt.stageY > (canvasData.canvasConfig.height / 2)) ? "bottom-20" : "top+20"),
              of: evt.nativeEvent
            },
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

      facilityUpdateDialog(html) { }

      facilityBuildDialog(html) { }

      ///////////////////////////////////////////////////////////////////
      // Private Methods

      _zoomMap() {
        this._tileMaps.forEach(tileMap => {
          tileMap.setScale(this._scaleMap[this._zoomLevel].x, this._scaleMap[this._zoomLevel].y);
        });
        this._moveMap(0, 0);
      }

      _centerOrientZoom(x, y, wheelDeltaY) {
        let clientX = x;
        let clientY = y;
        // console.log("x : y : wheelDeltaY = " + x + " : " + y + " : " + wheelDeltaY);

        let scale = this._scaleMap[this._zoomLevel].x
        let prevScale = this._scaleMap[this._zoomLevel - wheelDeltaY].x;
        // console.log("prevScale : scale = " + prevScale + " : " + scale);

        let containerWidth = canvasData.canvasConfig.width;
        let containerHeight = canvasData.canvasConfig.height;
        // console.log("containerWidth : containerHeight = " + containerWidth + " : " + containerHeight);

        let prevWorldWidth = canvasData.terrainSpriteConfig.width * canvasData.terrainImageConfig.width * prevScale;
        let prevWorldHeight = canvasData.terrainSpriteConfig.height * canvasData.terrainImageConfig.height * prevScale;
        // console.log("prevWorldWidth : prevWorldHeight = " + prevWorldWidth + " : " + prevWorldHeight);

        let worldWidth = canvasData.terrainSpriteConfig.width * canvasData.terrainImageConfig.width * scale;
        let worldHeight = canvasData.terrainSpriteConfig.height * canvasData.terrainImageConfig.height * scale;
        // console.log("worldWidth : worldHeight = " + worldWidth + " : " + worldHeight);

        let percentXInCurrentBox = clientX / containerWidth;
        let percentYInCurrentBox = clientY / containerHeight;
        // console.log("percentXInCurrentBox : percentYInCurrentBox = " + percentXInCurrentBox + " : " + percentYInCurrentBox);

        let deltaX = -Math.floor((worldWidth - prevWorldWidth) * (percentXInCurrentBox));
        let deltaY = -Math.floor((worldHeight - prevWorldHeight) * (percentYInCurrentBox));
        // console.log("deltaX : deltaY = " + deltaX + " : " + deltaY);

        this._moveMap(deltaX, deltaY);
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
