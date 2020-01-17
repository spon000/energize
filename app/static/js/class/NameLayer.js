define([
  "Dim2",
  "easeljs",
  "TileMap",
  "Tile",
  "Facility",
  "facilityTileDefs"

], function (Dim2, createjs, TileMap, Tile) {
  return (
    class FacilityLayer {
      constructor() {

        this._tileMapName = "names";
        this._scaleMap = [new Dim2(1.7, 1.7), new Dim2(1.8, 1.8), new Dim2(5, 5), new Dim2(5, 5)];
        // this._scaleMap = [new Dim2(.7, .7), new Dim2(.7, .7)];

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

      _createFacilitySpriteSheet() {
        return new createjs.SpriteSheet({
          images: [this._facilitySpriteImage],
          frames: {
            width: this._facilitySpriteConfig.width,
            height: this._facilitySpriteConfig.height
          }
        });
      }

      getTileColRow(fid) {
        let tileIndex = Object.values(this._tileMap._tileMapTiles).findIndex(t => t.id === fid);
        let tileKey = Object.keys(this._tileMap._tileMapTiles)[tileIndex];
        return this._tileMap._getTileColRowFromIndex(tileKey);
      }

      createFacilityTile(facility) {
        let typeIndex = this._facilitySpriteConfig.sprites.findIndex(x => x.type === facility.facility_type);
        if (typeIndex === -1) typeIndex = 8;

        let facilitySprite = new createjs.Sprite(this._facilitySpriteSheet, this._facilitySpriteConfig.sprites[typeIndex].frame);
        let tile = new Tile(facility.id, "facility", this._facilitySpriteConfig.width, this._facilitySpriteConfig.height, facilitySprite, false);

        tile.scaleX = this._scaleMap[0].x;
        tile.scaleY = this._scaleMap[0].y;
        tile.originX = -50;
        tile.originY = -50;
        tile.type = facility.facility_type;

        this._tileMap.setTile(facility.row, facility.column, tile);
      }

      createFacilityTiles(facilities) {
        facilities.forEach((facility) => {
          this.createFacilityTile(facility);
        });
      }

      updateFacilityTile(fid, newType) {
        // let tileIndex = Object.values(this._tileMap._tileMapTiles).findIndex(t => t.id === fid);
        // let tileKey = Object.keys(this._tileMap._tileMapTiles)[tileIndex];
        // let colRow = this._tileMap._getTileColRowFromIndex(tileKey);
        let facilitySprite = new createjs.Sprite(this._facilitySpriteSheet, this._facilitySpriteConfig.sprites[newType - 1].frame);
        let newTile = new Tile(fid, "facility", this._facilitySpriteConfig.width, this._facilitySpriteConfig.height, facilitySprite, false);
        let colRow = this.getTileColRow(fid);
        newTile.scaleX = this._scaleMap[0].x;
        newTile.scaleY = this._scaleMap[0].y;
        newTile.originX = -50;
        newTile.originY = -50;
        newTile.type = newType;

        this._tileMap.setTile(colRow.row, colRow.col, newTile);
      }

      removeFacilityTile(fid) {
        console.log("this._tileMap = ", this._tileMap);
        let tileIndex = Object.values(this._tileMap._tileMapTiles).findIndex(t => t.id === fid);
        let tileKey = Object.keys(this._tileMap._tileMapTiles)[tileIndex];
        let colRow = this._tileMap._getTileColRowFromIndex(tileKey);

        this._tileMap.removeTile(colRow.row, colRow.col);
      }

    });
});