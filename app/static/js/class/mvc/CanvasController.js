define([
  "canvasData",
  "Dim2",
  "EventEmitter",
  "facilityTileDefs",
  "FacilitySelectDialog",
  "FacilityViewDialog"

], function (
  canvasData,
  Dim2,
  EventEmitter,
  facilityTileDefs,
  FacilitySelectDialog,
  FacilityViewDialog
) {

    return (
      class CanvasController extends EventEmitter {
        constructor(canvasModel, canvasView) {
          super();
          this._canvasModel = canvasModel;
          this._canvasView = canvasView;
          this._terrainClicked = false;
          this._facilityClicked = false;
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
                    if (facilityListObj.facilityList) {
                      scope._buildFacility("infodialogbox", facilityListObj.facilityList);
                    }
                    else {
                      console.log("can't build: " + facilityListObj.message);
                    }
                  }
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
        // That's why there's no need for a scope variable
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
        // That's why there's no need for a scope variable
        _onFacilityEvent(evt, data) {
          //console.log("CanvasController._onFacilityEvent", evt, data);
          const tile = data;
          switch (evt.type) {
            case "click":
              this._terrainClicked = false;
              this._facilityClicked = true;
              this._viewFacility(tile.id);
              break;
            case "rollover":
              if (!this._dragging && !this._facilityClicked) {
                this._canvasModel.getFacilityInformationHTML(tile.id).then((html) => {
                  this._canvasView.displayRolloverInfo(evt, html)
                });
              }
              break;
            case "rollout":
              if (!this._facilityClicked) {
                this._canvasView.displayRolloverInfo(evt, null);
              }
              break;
          }
        }

        _buildFacilityEvent(colRow) {
          //console.log("terrainTileGrid = ", terrainTileGrid);
          let cityTileGrid = this._canvasView.getTileGrid("cities", colRow, 3, 3);
          let facilityTileGrid = this._canvasView.getTileGrid("facilities", colRow, 7, 7);

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
            if (this._canvasView.checkForTileRange(terrainDefs[facilityId], terrainTileGrid)) {
              facilitiesAllowed.push(facilityId);
            }
          }

          // Remove duplicate Ids from array.
          facilitiesAllowed = [...new Set(facilitiesAllowed)];
          // console.log("facilitiesAllowed = ", facilitiesAllowed);

          if (facilitiesAllowed.length > 0) {
            return ({
              "facilityList": facilitiesAllowed,
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

        _buildFacility(dialogElementId, facilityIdList) {

          // this._canvasModel.getFacilityTypes().then(data => {
          //   let facilityData = {
          //     powerTypes: data.powerTypesTable.data.power_types,
          //     generatorTypes: data.generatorTypesTable.data.generator_types,
          //     facilityTypes: data.facilityTypesTable.data.facility_types,
          //   }
          //   let facilitySelectDialog = new FacilitySelectDialog(facilityData.facilityTypes, facilityIdList);

          //   facilitySelectDialog.openDialog().then(facilityTypeId => {
          //     this._addGenerators(facilityData, facilityTypeId, 0);
          //   });
          // });
        }

        _viewNewFacility(facilityData, facilityTypeId) {
          console.log("_addGenerators() facilityData = ", facilityData);
        }

        _viewFacility(facilityId) {
          this._canvasModel.getAllTypes().then(data => {
            let facilityData = {
              powerTypes: data.powerTypesTable.data.power_types,
              generatorTypes: data.generatorTypesTable.data.generator_types,
              facilityTypes: data.facilityTypesTable.data.facility_types
            }
            console.log("_viewFacility() => facilityData = ", facilityData);

            this._canvasModel.getPlayerFacility(facilityId).then((facility) => {
              let fac = facility.facility[0];
              console.log("_viewFacility() => fac = ", fac);
              let facilityViewDialog = new FacilityViewDialog(facilityData.facilityTypes[fac.facility_type], facilityData.generatorTypes, fac);
              facilityViewDialog.openDialog();
              this._facilityClicked = false;
            });
          });
        }
      });
  });