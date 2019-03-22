define([
  "canvasData",
  "Dim2",
  "EventEmitter",
  "facilityTileDefs"

], function (canvasData, Dim2, EventEmitter, facilityTileDefs) {

  return (
    class CanvasController extends EventEmitter {
      constructor(canvasModel, canvasView) {
        super();
        this._canvasModel = canvasModel;
        this._canvasView = canvasView;
        this._terrainClicked = false;
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
            if (scope._terrainClicked) {
              let colRow = scope._canvasView.getRowCol(evt.offsetX, evt.offsetY);
              scope._canvasModel.getCompanyData().then((companyData) => {
                if (companyData.state === "build") {
                  let facilityListObj = scope._buildFacilityEvent(colRow);
                  console.log("facilityListObj = ", facilityListObj);
                }
                // console.log("companyData = ", companyData);
              });
            }
            break;
          case "mousedown":
            scope._leftMouseDown = true;
            scope._terrainClicked = true
            const mouseDownTimer = setTimeout(() => {
              if (scope._leftMouseDown) {
                scope._dragging = true;
                // console.log("dragging started...");
              }
            }, 350);
            break;
          case "mouseup":
            scope._leftMouseDown = false;
            if (scope._dragging) {
              scope._terrainClicked = false;
              scope._dragging = false;
              // console.log("dragging stopped...");
            }
            break;
          case "mousemove":
            if (scope._dragging) {
              scope._canvasView.dragMap(evt)
              // console.log("dragging", evt);
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
          case "click":
            this._terrainClicked = false;
            break;
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
          case "click":
            this._terrainClicked = false;
            break;
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

      _buildFacilityEvent(colRow) {
        //console.log("terrainTileGrid = ", terrainTileGrid);
        let cityTileGrid = this._canvasView.getTileGrid("cities", colRow, 3, 3);
        let facilityTileGrid = this._canvasView.getTileGrid("facilities", colRow, 7, 7);
        let allowedFacilities = null;

        if (this._canvasView.checkForTile("facility", facilityTileGrid)) {
          return ({
            "facilityList": null,
            "message": "Can't build near or on a facility"
          });
        }

        if (this._canvasView.checkForTile("city", cityTileGrid)) {
          return ({
            "facilityList": null,
            "message": "Can't build near or on a city"
          });
        }

        const terrainDefs = facilityTileDefs.allowedFacilityTypesByTerrain;
        let terrainTileGrid = this._canvasView.getTileGrid("terrain", colRow, 3, 3);
        let facilitiesAllowed = [];

        for (let facilityId in terrainDefs) {
          console.log("facilityId = ", facilityId)
          if (this._canvasView.checkForTileRange(terrainDefs[facilityId], terrainTileGrid)) {
            facilitiesAllowed.push(facilityId);
            console.log("we found one = ", facilityId);
          }
        }
        facilitiesAllowed = [...new Set(facilitiesAllowed)];
        console.log("facilitiesAllowed = ", facilitiesAllowed);
        //     let gridLength = terrainDefs[facilityId][terrain] * 2 + 1
        //     let gridOrigin = Math.floor(gridLength / 2);
        //     let tileGrid = this._canvasView.getTileGrid("terrain", colRow, gridLength, gridLength, new Dim2(gridOrigin, gridOrigin));
        //     if (this._canvasView.checkForTile(terrain, tileGrid)) { 
        //         terrainFound = true;
        //         break;
        //   }
        // if (terrainFound) facilitiesAllowed.push(parseInt(facilityId));
        // }
        // console.log("terrainDefs[" + facilityId + "] = ", terrainDefs[facilityId]);
        // }


        if (allowedFacilities) {
          return ({
            "facilityList": allowedFacilities,
            "message": "building..."
          });
        }
        else {
          return ({
            "facilityList": null,
            "message": "You can't build a facility on this terrain"
          });
        }
      }
    });
});