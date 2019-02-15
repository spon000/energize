define([
  "canvasData",
  "EventEmitter"
], function (canvasData, EventEmitter) {

  return (
    class CanvasController extends EventEmitter {
      constructor(canvasModel, canvasView) {
        super();
        this._canvasModel = canvasModel;
        this._canvasView = canvasView;
      }

      ///////////////////////////////////////////////////////////////////////////
      // Public methods.

      initialize() {
        this._getTerrainLayer();
        this._getCityLayer();
        this._getFacilityLayer();
        this._canvasView.scaleMap = canvasData.canvasConfig.scaleMap;
        this._canvasView.zoomLevel = 0;
        this._canvasView.startCanvasTimer();
      }

      ///////////////////////////////////////////////////////////////////////////
      // Private methods.

      // Generate terrain tilemap
      _getTerrainLayer() {
        this._canvasModel.createTerrainTileMap().then(tileMap => {
          this._canvasView.addTileMap(tileMap, 0);
          this._setTerrainEvents(tileMap);
        });
      }

      // Generate city tilemap
      _getCityLayer() {
        this._canvasModel.createCityTileMap().then(tileMap => {
          this._canvasView.addTileMap(tileMap);
          this._setCityEvents(tileMap);
        });
      }

      // Generate facility tilemap
      _getFacilityLayer() {
        this._canvasModel.createFacilityTileMap().then(tileMap => {
          this._canvasView.addTileMap(tileMap);
          this._setFacilityEvents(tileMap);
        });
      }

      _setTerrainEvents(tileMap) {
        this._canvasView.addEventToCanvasMap(tileMap, "click", this._onTerrainEvent, this);
        //this._canvasView.addEventToCanvasMap(tileMap, "mouseenter", this._onTerrainEvent);
      }

      _setCityEvents(tileMap) {
        this._canvasView.addEventToTileMap(tileMap, "rollout", this._onCityEvent, this);
        this._canvasView.addEventToTileMap(tileMap, "rollover", this._onCityEvent, this);
      }

      _setFacilityEvents(tileMap) {
        this._canvasView.addEventToTileMap(tileMap, "rollout", this._onFacilityEvent, this);
        this._canvasView.addEventToTileMap(tileMap, "rollover", this._onFacilityEvent, this);
        this._canvasView.addEventToTileMap(tileMap, "click", this._onFacilityEvent, this);
      }

      ///////////////////////////////////////////////////////////////////////////
      // Event methods.

      // this uses jquery event handler. data and scope of the event is in 
      // evt.data
      _onTerrainEvent(evt) {
        console.log("CanvasController._onTerrainEvent", evt);
      }

      // This uses easeljs event handler which specifies different listener function prototype
      _onCityEvent(evt, data) {
        // console.log("CanvasController._onCityEvent", evt, data);
        const tile = data;
        switch (evt.type) {
          case "rollover":
            this._canvasModel.getCityInformationHTML(tile.id).then((html) => {
              this._canvasView.displayRolloverInfo(evt, html)
            });
            break;
          case "rollout":
            this._canvasView.displayRolloverInfo(evt, null);
            break;
        }
      }

      // This uses easeljs event handler which specifies different listener function prototype
      _onFacilityEvent(evt, data) {
        //console.log("CanvasController._onFacilityEvent", evt, data);
        const tile = data;
        switch (evt.type) {
          case "rollover":
            this._canvasModel.getFacilityInformationHTML(tile.id).then((html) => {
              this._canvasView.displayRolloverInfo(evt, html)
            });
            break;
          case "rollout":
            this._canvasView.displayRolloverInfo(evt, null);
            break;
        }
      }


    })
});