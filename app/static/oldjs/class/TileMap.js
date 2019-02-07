define([
  // Libs
  "jquery",
  "Vector2",
  "easeljs"
], function ($, Vector2, createjs) {
  return (
    // Class that represents a grid of tiles.
    class TileMap {
      constructor(rows, columns, width, height, parentMap = null, name = null) {
        this._rows = rows;
        this._columns = columns;
        this._width = width;
        this._height = height;
        this._parentMap = parentMap;
        this._container = new createjs.Container();
        this._container.x = 0;
        this._container.y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._scrollable = false;
        this._tileMapTiles = {};
        this._name = name;
      }

      // Getters...
      get rows() {
        return this._rows;
      }

      get columns() {
        return this._columns;
      }

      get width() {
        return this._width;
      }

      get height() {
        return this._height;
      }

      get parentMap() {
        return this._parentMap;
      }

      get container() {
        return this._container;
      }

      get scaleX() {
        return this._scaleX;
      }

      get scaleY() {
        return this._scaleY;
      }

      set parentMap(parentMap) {
        this._parentMap = parentMap;
      }

      // Private Methods
      _getTileIndex(row, column) {
        return "" + (row * this._columns + column);
      }

      _checkMapBounds(canvasWidth, canvasHeight) {
        let tileWidth = this._width * this._scaleX;
        let tileHeight = this._height * this._scaleY;
        let maxWidth = tileWidth * this._columns - canvasWidth;
        let maxHeight = tileHeight * this._rows - canvasHeight;

        if (this._container.x < -maxWidth) this._container.x = -maxWidth;
        if (this._container.x > 0) this._container.x = 0;
        if (this._container.y < -maxHeight) this._container.y = -maxHeight;
        if (this._container.y > 0) this._container.y = 0;

        //console.log("tilemap = ", this);
        //console.log("check:this._container.x : this._container.y = " + this._container.x + " : " + this._container.y);
      }

      _getOffset(row, column) {
        return new Vector2(column * this._width, row * this._height);
      }

      // Public Methods...
      setTile(row, column, tile, drawSprite = true) {
        let offset = this._getOffset(row, column);
        let tileIndex = this._getTileIndex(row, column);

        this.removeTile(row, column);
        this._tileMapTiles[tileIndex] = tile;
        if (tile) {
          if (drawSprite) {
            if (!tile.scaleToMap) {
              tile.sprite.scaleX = tile.scaleX;
              tile.sprite.scaleY = tile.scaleY;
            } else {
              tile.sprite.scaleX = this._width / tile.width;
              tile.sprite.scaleY = this._height / tile.height;
            }
            tile.sprite.x = offset.x + tile.originX;
            tile.sprite.y = offset.y + tile.originY;
            this._container.addChild(tile.sprite);
          }
        }
      }

      removeTile(row, column) {
        let tileIndex = this._getTileIndex(row, column);
        let oldTile = this._tileMapTiles[tileIndex];

        if (oldTile) {
          this._tileMapTiles[tileIndex] = null;
          this._container.removeChild(oldTile.sprite);
        }
      }

      setScale(width, height, canvasWidth, canvasHeight) {
        this._container.scaleX = this._scaleX = width / this._width;
        this._container.scaleY = this._scaleY = height / this._height;
        //console.log("container.scaleX : container.scaleY = " + this._container.scaleX + " : " + this._container.scaleY);
        //this.moveTileMap(0, 0, canvasWidth, canvasHeight);
      }

      moveTileMap(deltaX, deltaY, canvasWidth, canvasHeight) {
        //console.log("before:this._container.x : this._container.y = " + this._container.x + " : " + this._container.y);

        let scaleWidth = this._width * this._container.scaleX;
        let scaleHeight = this._height * this._container.scaleY;
        this._container.x += deltaX;
        this._container.y += deltaY;
        this._container.x =
          Math.floor(this._container.x / scaleWidth) * scaleWidth;
        this._container.y =
          Math.floor(this._container.y / scaleHeight) * scaleHeight;

        //console.log("after:this._container.x : this._container.y = " + this._container.x + " : " + this._container.y);
        this._checkMapBounds(canvasWidth, canvasHeight);
      }

      getPoint(x, y, mapCoords = true) {
        //console.log("x, y = " + x + ", " + y);
        //console.log("this._container.x : this._container.y = " + this._container.x + " : " + this._container.y);
        let mapX = 0;
        let mapY = 0;
        if (mapCoords) {
          mapX = -this._container.x + x;
          mapY = -this._container.y + y;
        } else {
          mapX = x;
          mapY = y;
        }

        //console.log("mapX : mapY = " + mapX + " : " + mapY);
        let row = Math.floor(mapY / (this._container.scaleY * this._height));
        let column = Math.floor(mapX / (this._container.scaleX * this._width));

        return new Vector2(column, row);
      }

      getTile(row, column) {
        let locationIndex = "" + (row * this._columns + column);
        return this._tileMapTiles[locationIndex];
      }

      getTiles(row, column, range) {
        let tiles = [];
        if (range === 0) {
          tiles.push(this.getTile(row, column));
          return tiles;
        }

        let maxRangeX = range,
          minRangeX = range,
          maxRangeY = range,
          minRangeY = range;

        if (row - range < 0) minRangeY = 0;
        if (row + range > this._rows - 1) maxRangeY = this._rows - 1 - row;
        if (column - range < 0) minRangeX = 0;
        if (column + range > this._columns - 1) maxRangeX = this._columns - 1 - column;

        for (let y = row - minRangeY; y < row + maxRangeY; y++) {
          for (let x = column - minRangeX; x < column + maxRangeX; x++) {
            tiles.push(this.getTile(y, x));
          }
        }
        return tiles;
      }
    }
  );
});
