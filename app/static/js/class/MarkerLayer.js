define([
  "Dim2",
  "easeljs",
], function (Dim2, createjs) {
  return (
    class MarkerLayer {
      constructor(params = {}) {
        this._markerSprites = params.sprites || {};
        this._citiesData = citiesData;
        this._citySpriteImage = citySpriteImage;
        this._citySpriteConfig = citySpriteConfig;
        this._cityList = [];
        this._tileMap = null;
        this._tileMapName = "facilityMarkers";
        this._terrainImageConfig = terrainImageConfig;
        this._terrainSpriteConfig = terrainSpriteConfig;
        this._scaleMap = [new Dim2(1, 1), new Dim2(2, 2), new Dim2(3, 3)];
      }

      addMarkerSprite(sprite) {

      }

      removeMarkerSprite(sprite) {

      }


    });
});