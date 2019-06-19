define([
  "Dim2",
  "easeljs",
  "TileMap",
  "Tile",
  "Facility",
  "facilityTileDefs"

], function (Dim2, createjs, TileMap, Tile, Facility, facilityTileDefs) {
  return (
    class FacilityLayer {
      constructor(facilitiesSpriteImage, facilitySpriteConfig, terrainImageConfig, terrainSpriteConfig, facilitiesData) {
        this._facilitiesData = facilitiesData;
        this._facilitySpriteImage = facilitiesSpriteImage;
        this._facilitySpriteConfig = facilitySpriteConfig;
        this._facilitySpriteSheet = null;
        this._facilityList = [];
        this._tileMap = null;
        this._tileMapName = "facilities";
        this._terrainImageConfig = terrainImageConfig;
        this._terrainSpriteConfig = terrainSpriteConfig;
        this._scaleMap = [new Dim2(1.9, 1.9), new Dim2(.1, .1), new Dim2(.1, .1), new Dim2(.1, .1)];
      }

      createTileMap() {
        this._tileMap = new TileMap(
          this._terrainImageConfig.height,
          this._terrainImageConfig.width,
          this._terrainSpriteConfig.width,
          this._terrainSpriteConfig.height,
          this._tileMapName
        );
        // this._tileMap.scaleToLayer = false;
        this._createFacilityTiles();
        return this._tileMap;
      }

      createTempFacilityTile() {
        let facilitySprite = new createjs.Sprite(facilitySpriteSheet, this._facilitySpriteConfig.sprites[0].frame);
        let tile = new Tile(-1, "temp-facility", this._facilitySpriteConfig.width, this._facilitySpriteConfig.height, facilitySprite);
        tile.scaleX = this._scaleMap[0].x;
        tile.scaleY = this._scaleMap[0].y;
        return tile;
      }

      createFacilityTile(facility, zoomLevel) {
        let typeIndex = this._facilitySpriteConfig.sprites.findIndex(x => x.type === facility.id_type);
        if (typeIndex === -1) typeIndex = 9;
        console.log(`typeIndex = ${typeIndex}`)
        console.log('this._facilitySpriteConfig.sprites = ', this._facilitySpriteConfig.sprites);
        let facilitySprite = new createjs.Sprite(this._facilitySpriteSheet, this._facilitySpriteConfig.sprites[9].frame);
        let tile = new Tile(facility.id, "facility", this._facilitySpriteConfig.width, this._facilitySpriteConfig.height, facilitySprite, false);
        tile.scaleX = this._scaleMap[zoomLevel].x;
        tile.scaleY = this._scaleMap[zoomLevel].y;
        facility['tile'] = tile;
        this._facilityList.push(facility);
        this._tileMap.setTile(facility.row, facility.column, tile);
      }

      _createFacilityTiles() {
        this._facilityList = [];
        let facilitySpriteSheet = new createjs.SpriteSheet({
          images: [this._facilitySpriteImage],
          frames: {
            width: this._facilitySpriteConfig.width,
            height: this._facilitySpriteConfig.height
          }
        });
        this._facilitySpriteSheet = facilitySpriteSheet;

        this._facilitiesData.forEach((facilityData) => {
          let typeIndex = this._facilitySpriteConfig.sprites.findIndex(x => x.type === facilityData.facility_type);
          if (typeIndex === -1) typeIndex = 0;
          let facilitySprite = new createjs.Sprite(facilitySpriteSheet, this._facilitySpriteConfig.sprites[typeIndex].frame);
          let tile = new Tile(facilityData.id, "facility", this._facilitySpriteConfig.width, this._facilitySpriteConfig.height, facilitySprite, false);
          tile.scaleX = this._scaleMap[0].x;
          tile.scaleY = this._scaleMap[0].y;
          let facility = new Facility(
            facilityData.id,
            facilityData.facility_type,
            facilityData.id_company,
            facilityData.name,
            facilityData.state,
            facilityData.player_number,
            facilityData.build_turn,
            facilityData.start_build_date,
            facilityData.start_prod_date,
            facilityData.area,
            tile
          );
          this._facilityList.push(facility);
          this._tileMap.setTile(facilityData.row, facilityData.column, tile);
        });
      }
    });
});