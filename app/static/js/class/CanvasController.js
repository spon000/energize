define([
  "canvasData"
], function (canvasData) {

  return (
    class CanvasController {
      constructor(canvasModel, canvasView) {
        this._canvasModel = canvasModel;
        this._canvasView = canvasView;
      }

      initialize() {
        this._getTerrainLayer();
        this._getCityLayer();
        this._getFacilityLayer();
        this._canvasView.scaleMap = canvasData.canvasConfig.scaleMap;
        this._canvasView.zoomLevel = 0;
        this._canvasView.startCanvasTimer();
      }

      _getTerrainLayer() {
        this._canvasModel.createTerrainTileMap().then(tileMap => {
          this._canvasView.addTileMap(tileMap, 0);
        });
      }

      _getCityLayer() {
        this._canvasModel.createCityTileMap().then(tileMap => {
          this._canvasView.addTileMap(tileMap);
        });
      }

      _getFacilityLayer() {
        this._canvasModel.createFacilityTileMap().then(tileMap => {
          this._canvasView.addTileMap(tileMap);
        });
      }


    })
});