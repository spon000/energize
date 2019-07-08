define([
  "Dim2",
  "easeljs",
  "TileMap",
  "Tile"
], function (Dim2, createjs, TileMap, Tile) {
  return (
    class MarkerLayer {
      constructor(playerMarkerImage, playerMarkerConfig, terrainImageConfig, terrainSpriteConfig) {
        this._playerMarkerImage = playerMarkerImage;
        this._playerMarkerConfig = playerMarkerConfig;
        this._playerMarkerSpriteSheet = this._createMarkerSpriteSheet();

        this._tileMapName = "playerMarkers";
        this._terrainImageConfig = terrainImageConfig;
        this._terrainSpriteConfig = terrainSpriteConfig;
        this._scaleMap = [new Dim2(2.2, 2.2), new Dim2(2.2, 2.2), new Dim2(2.2, 2.2), new Dim2(2.2, 2.2)];

        this._tileMap = this._createTileMap();
      }

      // Getters
      get tileMap() {
        return this._tileMap;
      }

      // Private methods
      _createTileMap() {
        return new TileMap(
          this._terrainImageConfig.height,
          this._terrainImageConfig.width,
          this._terrainSpriteConfig.width,
          this._terrainSpriteConfig.height,
          this._tileMapName
        );
      }

      _createMarkerSpriteSheet() {
        return new createjs.SpriteSheet({
          images: [this._playerMarkerImage],
          frames: {
            width: this._playerMarkerConfig.width,
            height: this._playerMarkerConfig.height
          }
        });
      }

      // Public methods
      createMarkerTile(facility) {
        let frame = 0
        let markerSprite = new createjs.Sprite(this._playerMarkerSpriteSheet, frame);
        let tile = new Tile(facility.id, "playerMarker", this._playerMarkerConfig.width, this._playerMarkerConfig.height, markerSprite, false);
        tile.scaleX = this._scaleMap[0].x;
        tile.scaleY = this._scaleMap[0].y;
        tile.originX = -75;
        tile.originY = -75;
        this._tileMap.setTile(facility.row, facility.column, tile);
      }

      createMarkerTiles(facilities) {
        facilities.forEach((facility) => {
          this.createMarkerTile(facility);
        });
      }

      removeMarkerTile(fid) {
        let tileIndex = Object.values(this._tileMap._tileMapTiles).findIndex(t => t.id === fid);
        let tileKey = Object.keys(this._tileMap._tileMapTiles)[tileIndex];
        let colRow = this._tileMap._getTileColRowFromIndex(tileKey);

        this._tileMap.removeTile(colRow.row, colRow.col);
      }
    });
});