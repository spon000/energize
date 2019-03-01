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
        this._clicked = 0;
        this._dragging = false;
        this._leftMouseDown = false;
      }

      ///////////////////////////////////////////////////////////////////////////
      // Public methods.

      initialize() {
        this._getTerrainLayer();
        this._getCityLayer();
        this._getFacilityLayer();
        this._setGeneralWindow
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


      _setGeneralWindowEvents() {
        this._canvasView.addEventToCanvasMap(null, "keydown", this._onTerrainEvent, this);
      }

      _setTerrainEvents(tileMap) {
        this._canvasView.addEventToCanvasMap(tileMap, "click", this._onTerrainEvent, this);
        this._canvasView.addEventToCanvasMap(tileMap, "dblclick", this._onTerrainEvent, this);
        this._canvasView.addEventToCanvasMap(tileMap, "wheel", this._onTerrainEvent, this);
        this._canvasView.addEventToCanvasMap(tileMap, "mouseleave", this._onTerrainEvent, this);
        this._canvasView.addEventToCanvasMap(tileMap, "mousedown", this._onTerrainEvent, this);
        this._canvasView.addEventToCanvasMap(tileMap, "mouseup", this._onTerrainEvent, this);
        this._canvasView.addEventToCanvasMap(tileMap, "mousemove", this._onTerrainEvent, this);
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
        let scope = evt.data.scope;
        switch (evt.type) {
          case "click":
            break;
          case "mousedown":
            scope._leftMouseDown = true;
            const mouseDownTimer = setTimeout(() => {
              if (scope._leftMouseDown) {
                scope._dragging = true;
                console.log("dragging started...");
              }
            }, 350);
            break;
          case "mouseup":
            scope._leftMouseDown = false;
            if (scope._dragging) {
              scope._clicked = -1;
              scope._dragging = false;
              console.log("dragging stopped...");
            }
            break;
          case "mousemove":
            if (scope._dragging) {
              scope._canvasView.dragMap(evt)
              console.log("dragging", evt);
            }
            break
          case "dblclick":
            break;
          case "wheel":
            if (!scope._dragging)
              scope._canvasView.wheelMapZoom(evt);
            break;
          case "mouseleave":
            scope._dragging = false;
            scope._canvasView.displayRolloverInfo(evt, null);
            break;
        }
        // console.log("CanvasController._onTerrainEvent", evt);
      }

      // This uses easeljs event handler which specifies different listener function prototype
      _onCityEvent(evt, data) {
        // console.log("CanvasController._onCityEvent", evt, data);
        const tile = data;
        switch (evt.type) {
          case "rollover":
            if (!this._dragging) {
              this._canvasModel.getCityInformationHTML(tile.id).then((html) => {
                this._canvasView.displayRolloverInfo(evt, html)
              });
            }
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
            if (!this._dragging) {
              this._canvasModel.getFacilityInformationHTML(tile.id).then((html) => {
                this._canvasView.displayRolloverInfo(evt, html)
              });
            }
            break;
          case "rollout":
            this._canvasView.displayRolloverInfo(evt, null);
            break;
        }
      }

    });
});