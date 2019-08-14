define([
  "canvasData",
  "Dim2",
  "Facility",
  "facilityTileDefs",
  "FacilitySelectDialog",
  "FacilityViewDialog",
  "ModelData",
  "ProgressBar",
  "SocketIOCalls",
  "evtEmitter",
  // "viewFacility",

], function (
  canvasData,
  Dim2,
  Facility,
  facilityTileDefs,
  FacilitySelectDialog,
  FacilityViewDialog,
  ModelData,
  ProgressBar,
  SocketIOCalls,
  evtEmitter,
    // viewFacility
  ) {

    return (
      class CanvasController {
        constructor(canvasModel, canvasView, playerSocket) {
          this._canvasModel = canvasModel;
          this._canvasView = canvasView;
          this._playerSocket = playerSocket;
          this._terrainClicked = false;
          this._dragging = false;
          this._leftMouseDown = false;
          this._rollOver = false;
          this._popupTimer = null;
          this._clickPause = false;
          this._popupDelay = 900;  // milliseconds
          this._dialogStatus = "popup" // possible values: "popup", "deleteing", "viewing", "building", "portfolio", "quarterly"
        }

        ///////////////////////////////////////////////////////////////////////////
        // Public methods.

        initialize() {
          // let progressBar = new ProgressBar()
          // progressBar.barStart();



          this._getTerrainLayer();
          this._getCityLayer();
          this._getFacilityLayer();
          this._getPlayerMarkerLayer();
          // this._setGeneralWindow
          this._canvasView.startCanvasTimer();
          this._setEventEmittersReceived();

          // let progressBar = new ProgressBar()
          // progressBar.barStart();
          // let viewFacilityDialog = viewFacility;
          // console.log("viewFacilityDialog = ", viewFacilityDialog)
        }

        ///////////////////////////////////////////////////////////////////////////
        // Private methods.



        //////////////////////////////////////////////////////////////////////////////////////////
        // Generate terrain tilemap
        _getTerrainLayer() {
          this._canvasModel.createTerrainTileMap().then(tileMap => {
            // console.log("tileMap = ", tileMap);
            this._canvasView.addTileMap(tileMap, 0);
            this._setTerrainEvents(tileMap);
          });
        }

        _getTerrainLayerNew() {
          this._canvasModel.createTerrainTileMap().then(tileMap => {
            this._canvasView.addTileMap(tileMap, 0);
            this._setTerrainEvents(tileMap);
          });
        }
        ///////////////////////////////////////////////////////////////////////////////////////////

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
            //console.log("tileMap = ", tileMap);
            this._canvasView.addTileMap(tileMap, 1);
            this._setFacilityEvents(tileMap);
            this._canvasModel.createPlayerMarkerTileMap().then(tileMap => {
              this._canvasView.addTileMap(tileMap, 1);
            })
          });
        }

        // Generate player markers tilemap
        _getPlayerMarkerLayer() {
          //   this._canvasModel.createPlayerMarkerTileMap().then(tileMap => {
          //     this._canvasView.addTileMap(tileMap, 1);
          //   })
        }

        _setGeneralWindowEvents() {
          this._canvasView.addEventToCanvasMap(null, "keydown", this._onTerrainTileEvent, this);
        }

        _setTerrainEvents(tileMap) {
          this._canvasView.addEventToCanvasMap(tileMap, "click", this._onTerrainTileEvent, this);
          this._canvasView.addEventToCanvasMap(tileMap, "dblclick", this._onTerrainTileEvent, this);
          this._canvasView.addEventToCanvasMap(tileMap, "wheel", this._onTerrainTileEvent, this);
          this._canvasView.addEventToCanvasMap(tileMap, "mouseleave", this._onTerrainTileEvent, this);
          this._canvasView.addEventToCanvasMap(tileMap, "mousedown", this._onTerrainTileEvent, this);
          this._canvasView.addEventToCanvasMap(tileMap, "mouseup", this._onTerrainTileEvent, this);
          this._canvasView.addEventToCanvasMap(tileMap, "mousemove", this._onTerrainTileEvent, this);
          //this._canvasView.addEventToCanvasMap(tileMap, "mouseenter", this._onTerrainEvent);
        }

        _setCityEvents(tileMap) {
          this._canvasView.addEventToTileMap(tileMap, "rollout", this._onCityTileEvent, this);
          this._canvasView.addEventToTileMap(tileMap, "rollover", this._onCityTileEvent, this);
        }

        _setFacilityEvents(tileMap) {
          this._canvasView.addEventToTileMap(tileMap, "rollout", this._onFacilityTileEvent, this);
          this._canvasView.addEventToTileMap(tileMap, "rollover", this._onFacilityTileEvent, this);
          this._canvasView.addEventToTileMap(tileMap, "click", this._onFacilityTileEvent, this);
        }

        ///////////////////////////////////////////////////////////////////////////
        // Event methods.

        // this uses jquery event handler. data and scope of the event is in 
        // evt.data
        _onTerrainTileEvent(evt) {
          let scope = evt.data.scope;
          switch (evt.type) {
            case "click":

              // evt.originalEvent is used here. Disable double clicks
              if (scope._terrainClicked && !this._clickPause) {
                // prevent multiple quick clicks
                this._clickPause = true;
                scope._createDelay(null, 2000, () => { this._clickPause = false });

                let colRow = scope._canvasView.getRowCol(evt.offsetX, evt.offsetY);
                console.log("scope._dialogStatus = ", scope._dialogStatus);

                if (scope._dialogStatus != "building") {
                  scope._canvasModel.getCompanyData().then((companyData) => {
                    if (companyData.state === "build") {
                      let facilityListObj = scope._buildFacilityEvent(colRow);
                      if (facilityListObj.facilityList) {
                        evtEmitter.emit("buildfacility", { col: colRow.x, row: colRow.y, facilityTypeList: facilityListObj.facilityList })
                      }
                      else {
                        console.log("can't build: " + facilityListObj.message);
                      }
                    }
                    else
                      console.log("Not in building mode");
                  });
                }
                else {
                  console.log("you're in viewing mode...");
                }
              }
              break;
            case "mousedown":
              if (evt.originalEvent.detail > 1) break;
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
        _onCityTileEvent(evt, data = null) {
          // console.log("CanvasController._onCityEvent", evt, data);
          const tile = data;
          switch (evt.type) {
            case "click":
              if (evt.originalEvent.detail > 1) break;
              this._terrainClicked = false;
              break;
            case "rollover":
              if (!this._dragging && this._dialogStatus == "popup") {
                this._popupTimer = this._createDelay(this._popupTimer, this._popupDelay, () => {
                  this._canvasModel.getCityInformationHTML(tile.id).then((html) => {
                    this._canvasView.displayRolloverInfo(evt, html)
                  });
                });
              }
              break;
            case "rollout":
              this._createDelay(this._popupTimer);
              this._canvasView.displayRolloverInfo(evt, null);
              break;
          }
        }

        // This uses easeljs event handler which specifies different listener function prototype
        // That's why there's no need for a scope variable
        _onFacilityTileEvent(evt, data = null) {
          //console.log("CanvasController._onFacilityEvent", evt, data);
          const tile = data;
          let timeout = null;
          switch (evt.type) {
            case "click":
              // evt.nativeEvent is used here.
              if (evt.nativeEvent.detail > 1) break;
              this._createDelay(this._popupTimer);
              this._terrainClicked = false;
              this._dialogStatus = "view";
              this._canvasView.displayRolloverInfo({ "type": "rollout" }, null);
              // generic facility...
              if (tile.type == "9") {
                let colRow = this._canvasModel.facilityLayer.getTileColRow(tile.id)
                let facilityList = this._getFacilitiesAllowed(new Dim2(colRow.col, colRow.row))
                let facilitySelectDialog = new FacilitySelectDialog(facilityList, tile.id, (evt) => {
                  this._dialogStatus = "popup";
                });
              }
              else {
                evtEmitter.emit("updatefacility", {
                  facilityId: tile.id,
                  facilityTypeId: null,
                  facilityTypeList: null
                });
              }
              break;
            case "rollover":
              if (!this._dragging && this._dialogStatus == "popup") {
                this._popupTimer = this._createDelay(this._popupTimer, this._popupDelay, () => {
                  this._canvasModel.getFacilityInformationHTML(tile.id).then((html) => {
                    this._canvasView.displayRolloverInfo(evt, html)
                  });
                });

              }
              break;
            case "rollout":
              this._rollOver = false;
              this._createDelay(this._popupTimer);
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

          let facilitiesAllowed = this._getFacilitiesAllowed(colRow);
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

        _getFacilitiesAllowed(colRow) {
          const terrainDefs = facilityTileDefs.allowedFacilityTypesByTerrain;
          // console.log("colRow = ", colRow)
          let terrainTileGrid = this._canvasView.getTileGrid("terrain", colRow, 3, 3);
          let facilitiesAllowed = [];

          for (let facilityId in terrainDefs) {
            if (this._canvasView.checkForTileRange(terrainDefs[facilityId], terrainTileGrid)) {
              facilitiesAllowed.push(facilityId);
            }
          }

          return [...new Set(facilitiesAllowed)];
        }

        _createDelay(timeout, delayMs = 0, callback = null) {
          if (!callback)
            if (timeout)
              clearTimeout(timeout)

          if (callback)
            return setTimeout(() => {
              callback();
            }, delayMs);
          else
            return null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // evtEmitter definitions 

        _setEventEmittersReceived() {
          evtEmitter.on("changefacility", (data) => {
            this._onChangeFacility(data.facilityId, data.facilityTypeList);
          });

          evtEmitter.on("buildfacility", (data) => {
            this._onBuildFacility(data.col, data.row, data.facilityTypeList);
          });

          evtEmitter.on("updatefacility", (data) => {
            this._onUpdateFacility(data.facilityId, data.facilityTypeList, data.facilityTypeId);
          });

          evtEmitter.on("deletefacility", (data) => {
            this._onDeleteFacility(data.facilityId);
          });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // evtEmitter events

        _onChangeFacility(facilityId, facilityTypeList) {
          let colRow = this._canvasModel.facilityLayer.getTileColRow(facilityId);
          this._onDeleteFacility(facilityId);
          this._onBuildFacility(colRow.col, colRow.row, facilityTypeList);
        }

        _onBuildFacility(col, row, facilityTypeList) {
          let modelData = new ModelData();

          modelData.addFacility(col, row).then((facData) => {
            let facility = facData.facility;
            this._canvasModel.facilityLayer.createFacilityTile(facility);
            this._canvasModel.playerMarkerLayer.createMarkerTile(facility);
            let facilitySelectDialog = new FacilitySelectDialog(facilityTypeList, facility.id, (evt) => {
              this._dialogStatus = "popup";
            });
          });
        }

        _onDeleteFacility(facilityId) {
          let modelData = new ModelData();

          modelData.deleteFacility(facilityId).then((results) => {
            this._canvasModel.facilityLayer.removeFacilityTile(facilityId);
            this._canvasModel.playerMarkerLayer.removeMarkerTile(facilityId);
            this._dialogStatus = "popup";
            // console.log("this._dialogStatus = ", this._dialogStatus);
          });
        }

        _onUpdateFacility(facilityId, facilityTypeList, facilityTypeId) {
          console.log("facilityId : facilityTypeList : facilityTypeId = " + facilityId + " : " + facilityTypeList + " : " + facilityTypeId);
          let modelData = new ModelData();
          this._dialogStatus = "viewing";

          if (facilityTypeId) {
            modelData.updateFacilityType(facilityId, facilityTypeId).then((facData) => {
              let facility = facData.facility;
              this._canvasModel.facilityLayer.updateFacilityTile(facility.id, facilityTypeId);
              let facilityViewDialog = new FacilityViewDialog(facility.id, facilityTypeList, (evt) => {
                this._dialogStatus = "popup";
              });
            });
          }
          else {
            let facilityViewDialog = new FacilityViewDialog(facilityId, facilityTypeList, (evt) => {
              this._dialogStatus = "popup";
            });
          }
        }

        ///////////////////////////////////////////////////////////////////////////   
      });
  });