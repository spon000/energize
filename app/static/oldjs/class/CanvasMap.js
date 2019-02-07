define([
	"jquery",
	"Vector2",
	"easeljs"

], function ($, Vector2) {

	return (
		// Class that controls the UI of the editor.
		// This class requires JQuery.

		class CanvasMap {

			constructor(canvasID) {

				this._stage = new createjs.Stage(canvasID);
				this._width = $("#" + canvasID).attr("width");
				this._height = $("#" + canvasID).attr("height");
				this._mapWidth = this._width;
				this._mapHeight = this._height;
				this._prevMapWidth = this._mapWidth;
				this._prevMapHeight = this._mapHeight;
				this._zoomX = 1;
				this._zoomY = 1;
				this._canvas = this._stage.canvas;
				this._ticker = null;
				this._tileMaps = new Array();
				this._zoomLevelArray = new Array();
				this._scaleLevelArray = new Array();
				this._previousZoomLevel = 0;
				this._zoomLevel = 0;

				this._stage.enableMouseOver();

				console.log("canvasmapstage this._width = " + this._width);

				// this._selectionSquare = new createjs.Shape();
			}

			// Getters...
			get canvas() {
				return this._canvas;
			}

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

			get scale() {
				return this._scale;
			}

			get zoomLevel() {
				return this._zoomLevel;
			}

			get zoomLevelVector() {
				return this._zoomLevelArray[this._zoomLevel];
			}

			get tileMaps() {
				return this._tileMaps;
			}

			// Setters...
			set zoomLevel(level) {

				if (level < 0) {
					this._previousZoomLevel = 0;
					level = 0;
				}
				else if (level > this._zoomLevelArray.length - 1) {
					this._previousZoomLevel = this._zoomLevelArray.length - 1;
					level = this._zoomLevelArray.length - 1;
				}
				this._previousZoomLevel = this._zoomLevel;
				this._zoomLevel = level;

				this._prevMapWidth = this._mapWidth;
				this._prevMapHeight = this._mapHeight;

				this._mapWidth = this._width * Math.floor((this._zoomLevelArray[level].x / this._zoomLevelArray[0].x));
				this._mapHeight = this._height * Math.floor((this._zoomLevelArray[level].y / this._zoomLevelArray[0].y));

				this._zoomWidth = this._mapWidth - this._prevMapWidth;
				this._zoomHeight = this._mapHeight - this._prevMapHeight;

				this._zoomX = this._zoomLevelArray[level].x
				this._zoomY = this._zoomLevelArray[level].y

				// console.log("zoomLevel : previousZoomLevel = " + this._zoomLevel + " : " + this._previousZoomLevel);
				// console.log("mapWidth : prevMapWidth = " + this._mapWidth + " : " + this._prevMapWidth);

				if (this._zoomLevelArray.length) {
					this._setScale(this._zoomLevelArray[level].x, this._zoomLevelArray[level].y);
				}
			}

			getMapCoords(screenX, screenY) {
				console.log("ScreenV = ", screenX, screenY);
				console.log("Zoom = ", this._zoomX, this._zoomY);
				console.log("Vector2 = ", new Vector2(screenX / this._zoomX, screenY / this._zoomY));
				return new Vector2(screenX / this._zoomX, screenY / this._zoomY);
			}

			getCanvasCoords(mapX, mapY) {

				return new Vector2(mapX * this._zoomX, mapY * this._zoomY);
			}

			// Methods...
			zoom(mouseX, mouseY, zoomIn = true) {

				console.log("zoom - mouseX : mouseY" + mouseX + " : " + mouseY);
				let oldZoomLevel = this.zoomLevel;
				if (zoomIn) {
					this.zoomLevel++;
				}
				else {
					this.zoomLevel--;
				}

				if (oldZoomLevel == this.zoomLevel) {
					mouseX = this._width / 2 - mouseX;
					mouseY = this._height / 2 - mouseY;
					this.moveTileMaps(mouseX, mouseY);
				}
				else {
					mouseX = -Math.floor(mouseX / this._width * (this._mapWidth - this._prevMapWidth));
					mouseY = -Math.floor(mouseY / this._height * (this._mapHeight - this._prevMapHeight));
					this.moveTileMaps(mouseX, mouseY);
					//console.log("mouseX : mouseY" + mouseX + " : " + mouseY);
				}
			}

			addTileMap(tileMap) {

				this._tileMaps.push(tileMap);
				this._stage.addChild(tileMap.container);
			}

			removeTileMap(tileMap) {

				this._stage.removeChild(tileMap.container);
			}

			// checkMapTiles(x, y) {

			// let tileXY = this._tileMaps[0].getPoint(x, y)
			// let tileCheck = [];
			// this._tileMaps.forEach( (tileMap) => {
			// let tileIndex = tileMap_getTileIndex(tileXY.y, tileXY.x);
			// let tile = tileMap._tileMapTiles[tileIndex];
			// if (tile) {
			// tileCheck.push(tile.name);
			// }
			// }
			// return tileCheck;
			// }

			createBitmap(image) {

				return (new createjs.Bitmap(image));
			}

			startCanvasTimer(fps = 10) {

				createjs.Ticker.framerate = fps;
				createjs.Ticker.on("tick", this._updateCanvas, this);
			}

			pauseCanvasTimer(pause = true) {

				createjs.Ticker.paused = pause;
			}

			addZoomLevel(vector2) {

				this._zoomLevelArray.push(vector2);
			}

			addScaleLevel(vector2) {

				this._scaleLevelArray.push(vector2);
			}

			moveTileMaps(dx, dy) {

				//console.log("dx : dy = " + dx + " : " + dy);
				this._tileMaps.forEach((tileMap) => {
					tileMap.moveTileMap(dx, dy, this._width, this._height);
				});
			}

			_setScale(width, height) {
				this._tileMaps.forEach((tileMap) => {
					tileMap.setScale(width, height, this._width, this._height);
				});
			}

			_updateCanvas(evt) {

				//console.log("updating stage...");
				if (!evt.paused) {
					this._stage.update();
				}
			}
		});
});
