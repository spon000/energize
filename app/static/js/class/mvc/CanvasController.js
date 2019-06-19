define([
  "canvasData",
  "Dim2",
  "EventEmitter",
  "Facility",
  "facilityTileDefs",
  "FacilitySelectDialog",
  "FacilityViewDialog",
  "ModelData",
  "SocketIOCalls",
  "evtEmitter",

], function (
  canvasData,
  Dim2,
  EventEmitter,
  Facility,
  facilityTileDefs,
  FacilitySelectDialog,
  FacilityViewDialog,
  ModelData,
  SocketIOCalls,
  evtEmitter

) {

    return (
      class CanvasController extends EventEmitter {
        constructor(canvasModel, canvasView, playerSocket) {
          super();
          this._canvasModel = canvasModel;
          this._canvasView = canvasView;
          this._playerSocket = playerSocket;
          this._terrainClicked = false;
          this._dragging = false;
          this._leftMouseDown = false;
          this._dialogStatus = "popup" // possible values: "popup", "view", "build", "portfolio", "quarterly"
        }

        ///////////////////////////////////////////////////////////////////////////
        // Public methods.

        initialize() {
          this._getTerrainLayer();
          this._getCityLayer();
          this._getFacilityLayer();
          // this._setGeneralWindow
          this._canvasView.startCanvasTimer();
          this._setEventEmittersReceived();
        }

        ///////////////////////////////////////////////////////////////////////////
        // Private methods.

        _setEventEmittersReceived() {

          evtEmitter.on("testing", (data = null) => {
            console.log("Events Testing Successful for CanvasController! data = ", data);
          })

        }

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
            console.log("tileMap = ", tileMap);
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
                      scope._buildFacility("facility-dialog", facilityListObj.facilityList, colRow);
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
        _onCityEvent(evt, data = null) {
          // console.log("CanvasController._onCityEvent", evt, data);
          const tile = data;
          switch (evt.type) {
            case "click":
              this._terrainClicked = false;
              break;
            case "rollover":
              if (!this._dragging && this._dialogStatus == "popup") {
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
        _onFacilityEvent(evt, data = null) {
          //console.log("CanvasController._onFacilityEvent", evt, data);
          const tile = data;
          switch (evt.type) {
            case "click":
              this._terrainClicked = false;
              this._dialogStatus = "view";
              this._canvasView.displayRolloverInfo({ "type": "rollout" }, null);
              this._viewFacility(tile.id);
              break;
            case "rollover":
              if (!this._dragging && this._dialogStatus == "popup") {
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

        _buildFacility(dialogElementId, facilityIdList, colRow) {
          let modelData = new ModelData();
          // colRow needs to be swapped !!!
          modelData.addFacility(colRow.x, colRow.y).then((facility) => {
            console.log("new facility added...", facility);
            this._canvasModel._facilityLayer.createFacilityTile(facility, this._canvasView.zoomLevel);
          });
        }

        _selectFacilityType() {
          this._canvasModel.getFacilityTypes().then(data => {
            let facilityData = {
              powerTypes: data.powerTypesTable.data.power_types,
              generatorTypes: data.generatorTypesTable.data.generator_types,
              facilityTypes: data.facilityTypesTable.data.facility_types,
            }
            let facilitySelectDialog = new FacilitySelectDialog(facilityData.facilityTypes, facilityIdList);

            facilitySelectDialog.openDialog().then(facilityTypeId => {
              // socketCalls.selectFacility(globalGameId, facilityTypeId)

              // this._addGenerators(facilityData, facilityTypeId, 0);
            });
          });
        }

        // this._canvasModel.getFacilityTypes().then(data => {
        //   let facilityData = {
        //     powerTypes: data.powerTypesTable.data.power_types,
        //     generatorTypes: data.generatorTypesTable.data.generator_types,
        //     facilityTypes: data.facilityTypesTable.data.facility_types,
        //   }
        //   let facilitySelectDialog = new FacilitySelectDialog(facilityData.facilityTypes, facilityIdList);

        //   facilitySelectDialog.openDialog().then(facilityTypeId => {
        //     socketCalls.selectFacility(globalGameId, facilityTypeId)

        //     this._addGenerators(facilityData, facilityTypeId, 0);
        //   });
        // });



        _viewFacility(facilityId, facilityTpyeId = null) {
          console.log("viewFacility", facilityId);
          // let facilityViewDialog = new FacilityViewDialog(facilityId).then((result) => {
          //   console.log("dialog closed");
          // });
          evtEmitter.emit("testing");

          evtEmitter.emit("testing", { msg: "hello observer!" });
          let facilityViewDialog = new FacilityViewDialog(facilityId, facilityTpyeId);

          // this._canvasModel.getAllTypes().then(data => {
          //   let facilityData = {
          //     powerTypes: data.powerTypesTable.data.power_types,
          //     generatorTypes: data.generatorTypesTable.data.generator_types,
          //     facilityTypes: data.facilityTypesTable.data.facility_types
          //   }

          //   this._canvasModel.getCompanyData().then(company => {
          //     facilityData["company"] = company;
          //     return facilityData;

          //   }).then(facilityData => {
          //     this._canvasModel.getPlayerFacility(facilityId).then(facility => {
          //       facilityData["facility"] = facility.facility[0];
          //       facilityData["generators"] = facility.generators;
          //       return facilityData;

          //     }).then(facilityData => {
          //       console.log("_viewFacility() => facilityData = ", facilityData);
          //       let facilityViewDialog = new FacilityViewDialog({
          //         "facilityType": facilityData.facilityTypes.find(ft => ft.id === facilityData.facility.facility_type),
          //         "facility": facilityData.facility,
          //         "generators": facilityData.generators,
          //         "powerTypes": facilityData.powerTypes,
          //         "generatorTypes": facilityData.generatorTypes.filter(gt => gt.facility_type === facilityData.facility.facility_type)
          //       });

          //       facilityViewDialog.openDialog().then(() => {
          //         this._dialogStatus = "popup";
          //       });
          //     });
          //   });
          // });
        }
      });
  });