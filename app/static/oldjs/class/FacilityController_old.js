define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "TileMap",
  "Tile",
  "easeljs",
  "Facility",
  "Generator",
  "FacilityDefs",
  "DialogBoxInfo2",
  "FacilityBuildDialog",
  "FacilitySelectDialog",
  "FacilityViewDialog"
], function (
  $,
  JQUI,
  Handlebars,
  TileMap,
  Tile,
  Easeljs,
  Facility,
  Generator,
  FacilityDefs,
  DialogBoxInfo2,
  FacilityBuildDialog,
  FacilitySelectDialog,
  FacilityViewDialog
) {
    return class FacilityController {
      constructor(spriteWidth, spriteHeight, tileMapWidth, tileMapHeight, parentMap = null, spriteMapImage = null) {
        this._spriteWidth = spriteWidth;
        this._spriteHeight = spriteHeight;
        this._tileMapWidth = tileMapWidth;
        this._tileMapHeight = tileMapHeight;
        this._spriteSheet = spriteMapImage;
        this._tileMap = null;
        this._facilityLastId = 0;
        this._facilityArray = [];
        this._generatorTypes = FacilityDefs.generatorTypes;
        this._addedFacilityDefs = [];
        this._prohibitedTerrainTiles = ["ocean", "mountain", "snow", "lake"];
        this._prohibitedTechTiles = ["city", "facility"];
        this._lastTileXY = null;
        this._STATUS = {
          NONE: 0,
          BUILDING: 1,
          REMOVING: 2,
          MODIFYING: 3,
          SELECT: 4
        };
        this._status = this.STATUS.NONE;
        this._selectedFacility = null;

        this._facilityDefinitions = FacilityDefs.facilities;
        this._facilityTypes = FacilityDefs.facilityTypes;
        this._facilityIndexes = FacilityDefs.facilityIndexes;

        this._facilityPlanningArray = [];

        //console.log("this._facilityTypes = ", this._facilityTypes);

        this._createTileMap(parentMap);
        if (spriteMapImage) {
          this.setSpriteSheet(spriteMapImage);
        }
      }

      get spriteWidth() {
        return this._spriteWidth;
      }

      get spriteHeight() {
        return this._spriteHeight;
      }

      get tileMap() {
        return this._tileMap;
      }

      get prohibitedTiles() {
        return this._prohibitedTiles;
      }

      get STATUS() {
        return this._STATUS;
      }

      get status() {
        return this._status;
      }

      get building() {
        return this._building;
      }

      get removing() {
        return this._removing;
      }

      set tileMap(tileMap) {
        this._tileMap = tileMap;
      }

      set status(status) {
        console.log("set status..." + status);
        this._status = status;
        this._facilityArray.forEach(facility => {
          facility.tile.sprite.removeAllEventListeners();
          switch (status) {
            case this.STATUS.SELECT:
              this._addClickEvent(facility);
              this._addMouseOverEvent(facility);
              this._addMouseOutEvent(facility);
              break;
            case this.STATUS.BUILDING:
              break;
            case this.STATUS.REMOVING:
              break;
            case this.STATUS.MODIFYING:
              break;
            case this.STATUS.NONE:
              this._addClickEvent(facility);
              this._addMouseOverEvent(facility);
              this._addMouseOutEvent(facility);
            default:
              break;
          }
        });
      }

      _getFacilityTypeIndex(type) {
        return this._facilityIndexes[type];
      }

      _addClickEvent(facility) {
        facility.tile.sprite.on(
          "click",
          (evt, facility) => {
            facility.selected = true;
            facility.infoBox.closeButton = true;
            facility.infoBox.position = {
              my: "left+10 bottom-10",
              of: evt.nativeEvent
            };
            facility.infoBox.openBox();
            facility.infoBox.closeBoxEvent(facility);
            facility.selected = true;
          },
          null,
          false,
          facility
        );
      }

      _addMouseOverEvent(facility) {
        facility.tile.sprite.on(
          "mouseover",
          (evt, facility) => {
            facility.infoBox.closeButton = false;
            facility.infoBox.position = {
              my: "left+10 bottom-10",
              of: evt.nativeEvent
            };
            facility.infoBox.openBox( /* evt.nativeEvent */);
          },
          null,
          false,
          facility
        );
      }

      _addMouseOutEvent(facility) {
        if (!facility.selected) {
          facility.tile.sprite.on(
            "mouseout",
            (evt, facility) => {
              facility.infoBox.closeBox();
            },
            null,
            false,
            facility
          );
        }
      }

      _createTileMap(parentMap) {
        this.tileMap = new TileMap(
          120,
          240,
          this._tileMapWidth,
          this._tileMapHeight,
          parentMap
        );
      }

      _checkTilePlacement(x, y) {
        // Technology Checks...
        let tileMaps = [...this._tileMap.parentMap.tileMaps];
        tileMaps.shift();
        if (tileMaps) {
          for (let tileMap of tileMaps) {
            let tile = tileMap.getTile(y, x);
            if (tile && this._prohibitedTechTiles.includes(tile.name)) {
              return null;
            }
          }
        }

        // Terrain Checks...
        let terrainTileMap = [...this._tileMap.parentMap.tileMaps][0];
        let tile = terrainTileMap.getTile(y, x);
        if (tile && this._prohibitedTerrainTiles.includes(tile.name)) {
          return null;
        }

        return tile.name;
      }

      _createTile(x, y, index = 20) {
        let tileXY = this.tileMap.getPoint(x, y);
        let tileName = this._checkTilePlacement(tileXY.x, tileXY.y);
        let facilityTypeList = null;
        let facilityTile = null;

        //console.log("this._checkTilePlacement(" + tileXY.x + ", " + tileXY.y + ") = " + this._checkTilePlacement(tileXY.x, tileXY.y));

        if (!tileName) {
          this.showMessageDialog("Problem:", "You can't place a facility there.");
          return -1;
        } else {
          facilityTypeList = this._getAllowedFacilities(tileName, tileXY.x, tileXY.y);

          let facilitySprite = new createjs.Sprite(this._spriteSheet, index);
          facilityTile = new Tile("facility", this._spriteWidth, this.spriteHeight, facilitySprite);
          let numX = this._tileSpriteWidth / this._tileMapWidth;
          let numY = this._tileSpriteHeight / this._tileMapHeight;
          facilityTile.scaleX = facilityTile.scaleY = 1;
          this.tileMap.setTile(tileXY.y, tileXY.x, facilityTile);
          for (let row = tileXY.y + 1; row < tileXY.y + numY; row++) {
            for (let col = tileXY.x + 1; col < tileXY.x + numX; col++) {
              this.tileMap.setTile(row, col, facilityTile, false);
            }
          }
        }
        return ({
          "tileXY": tileXY,
          "tile": facilityTile,
          "allowedFacilities": facilityTypeList
        })
      }

      _getAllowedFacilities(tileName, x, y) {
        let allowedFacilities = [];
        //console.log("this._facilityTypes = ", this._facilityTypes);
        for (let facilityType of this._facilityTypes) {
          for (let terrainType of Object.keys(facilityType.terrainTypes)) {
            let tileRange = facilityType.terrainTypes[terrainType];
            // console.log("tileName : terrainType : tileRange = " + tileName + " : " + terrainType + " : " + tileRange);
            let tiles = this._tileMap.parentMap.tileMaps[0].getTiles(y, x, tileRange);
            let terrainAllowed = false;
            for (let tile of tiles) {
              if (terrainType === tile.name) {
                //allowedFacilities.push(facilityType.facilityType);
                allowedFacilities.push(facilityType);
                terrainAllowed = true;
                break;
              }
            }
            if (terrainAllowed) break;
          }
        }
        //console.log("allowedFacilities = ", allowedFacilities);
        return allowedFacilities;
      }

      setSpriteSheet(spriteMapImage) {
        this._spriteSheet = new createjs.SpriteSheet({
          images: [spriteMapImage],
          frames: {
            width: this._spriteWidth,
            height: this._spriteHeight,
            regX: 0,
            regY: 0
          }
        });
      }

      createFacility(x, y) {
        console.log("createFacility - x : y", x + " : " + y)
        let facilityInfo = this._createTile(x, y);
        let facilityData = {};
        if (facilityInfo != -1) {
          facilityData = {
            fc: this,
            tileXY: facilityInfo.tileXY,
            facilityTypeList: facilityInfo.allowedFacilities,
            facilityAccepted: false,
            facility: new Facility({
              id: ++this._facilityLastId
            }, facilityInfo.tile),
            facilitySelected: "",
            facilityStatus: ""
          };
        }
        else
          return facilityData;

        this._showSelectDialog(facilityData);
      }

      _showSelectDialog(facilityData) {
        let facilitySelectDialog = new FacilitySelectDialog(facilityData);
        facilitySelectDialog.attachCloseEvent(facilityData.fc._showBuildDialog, facilityData);
        //facilitySelectDialog.attachCloseButton(facilityData.fc.removeFacility, facilityData);
        facilitySelectDialog.openDialog();
        facilitySelectDialog.attachCloseButton((facilityData) => {
          facilityData.fc._removeFacility(facilityData.fc.tileMap, facilityData.tileXY);
        }, facilityData);
      }

      _showBuildDialog(facilityData) {
        // if (facilityData.facilitySelected) {
        let facilityBuildDialog = new FacilityBuildDialog(facilityData);
        facilityBuildDialog.attachCloseEvent(facilityData.fc._finalizeFacilityBuild, facilityData);
        facilityBuildDialog.openDialog();
        facilityBuildDialog.attachCloseButton((facilityData) => {
          facilityData.fc._removeFacility(facilityData.fc.tileMap, facilityData.tileXY);
        }, facilityData);
        //      facilitySelectDialog.attachCloseButton(facilityData.fc.removeFacility, facilityData);
      }

      _finalizeFacilityBuild(facilityData) {
        // console.log("_finalize", facilityData);
        switch (facilityData.facilityStatus) {
          case "back":
            console.log("go back to select");
            facilityData.facilitySelected = "";
            facilityData.facilityStatus = "";
            facilityData.fc._showSelectDialog(facilityData);
            break;
          case "build":
            console.log("build the facility");
            break;
          case "cancel":
            console.log("cancel the facility build");
          default:
            facilityData.fc._removeFacility(facilityData.fc.tileMap, facilityData.tileXY);
        }
      }

      createFacilityDialog(x, y) {
        let facilityTypes = _getElegibleFacilityTypes(x, y);
      }

      showMessageDialog(title = null, msg = null, elementId = null) {
        let dialogBox = new DialogBoxInfo2(title, 250, 250);
        if (elementId) dialogBox.elementId = elementId;
        console.log("msg = " + msg);
        dialogBox.setContent("<p>" + msg + "</p>", 1, "", true);
        dialogBox.closeButton = true;
        dialogBox.openBox(() => { }, null);
      }

      showMessage(elementId, msg = null) {
        let messageElement = $("#" + elementId);
        let breaks = /* "<br/> <br/> <br/> <br/>" */ "";

        if (msg) messageElement.html(breaks + "<h3>" + msg + "</h3>");
        else messageElement.empty();
      }


      _confirmFacilityBuild(evt) {
        // // let tile = evt.data.fc.tileMap.getTile(evt.data.tileXY.y, evt.data.tileXY.x);
        // let facility = evt.data.facility;
        // facility.type =


        //   evt.data.fc._facilityArray.push(facility);
        // evt.data.fc.status = evt.data.fc.STATUS.SELECT;
        //evt.data.facilityAccepted = true;

      }

      _removeFacility(tileMap, tileXY) {
        tileMap.removeTile(tileXY.y, tileXY.x);
        //remove from array...
      }
    };
  });
























  // _selectResponse(evt, data) {
  //   if (evt) {
  //     //console.log("facility confirmed");
  //     let fieldIndex = $(evt.target).attr("fieldValue");
  //     let tile = data.fc.tileMap.getTile(data.tileXY.y, data.tileXY.x);
  //     let facility = new Facility(
  //       data.fc._predefinedFacilities[fieldIndex],
  //       tile
  //     );
  //     facility.selected = true;
  //     data.fc._facilityArray.push(facility);
  //     data.fc._predefinedFacilities.splice(fieldIndex, 1);

  //     data.fc.status = data.fc.STATUS.SELECT;

  //     facility.infoBox.closeButton = true;
  //     facility.infoBox.position = {
  //       my: "left+10 bottom-10",
  //       of: evt.nativeEvent
  //     };
  //     facility.infoBox.openBox();
  //   }
  //   else {
  //     data.fc.tileMap.removeTile(data.tileXY.y, data.tileXY.x);
  //   }
  // }


          // data.dialogBox = new DialogBoxInfo2("Select Facility To Build", 600, 750);
        // data.dialogBox.setContent(this._facilitySelectForm(data), 1, "Select Facility", true);
        // data.dialogBox.closeButton = true;

        // data.dialogBox.setCloseBoxEvent(
        //   (data) => {
        //     if (!data.facilitySelected) data.fc.tileMap.removeTile(data.tileXY.y, data.tileXY.x);
        //   }, data);

        // data.dialogBox.addEvent(".sfd-facility-button button", "click", this._sfdShowFacilityTypeDetail, data);
        // data.dialogBox.addEvent(".sfd-select-facility-data-btn", "click", this._sfdSelectFacilityType, data);

        // data.dialogBox.openBox(() => { }, null);

        // if (this._predefinedFacilities.length) {
        //   let selectBox = new DialogBoxSelect(
        //     "Select a predefined facility",
        //     700,
        //     500
        //   );
        //   selectBox.rows = this._formatFacilityData();
        //   selectBox.tableElementClass = "predefined-facility-table";
        //   selectBox.openBox(this._selectResponse, data);



      // _formatFacilityData() {
      //   let facilityDataArray = [];

      //   this._predefinedFacilities.forEach(facility => {
      //     let facilityRow =
      //       "Facility Type: " +
      //       facility.facilityType +
      //       " --- Generator Type: " +
      //       facility.generators["1"].generatorType +
      //       "<br/>Capaciy / Generator: " +
      //       facility.generators["1"].capacity +
      //       " --- Total Capacity: " +
      //       facility.generators["1"].capacity *
      //       Object.keys(facility.generators).length;
      //     facilityDataArray.push(facilityRow);
      //   });

      //   return facilityDataArray;
      // }


        ///////////////////////////////////////////////////
      // _facilitySelectForm(data) {
      //   let facilitySelectWindowHtml = "";
      //   let facilitySelectTabsHtml = "";
      //   let facilitySelectDetailsHtml = "";
      //   let facilitySelectDataHtml = "";

      //   let facilityTypesArray = data.fc._facilityTypes.map(obj => ({ ...obj, enabled: false }));
      //   //console.log("facilityTypesArray = ", facilityTypesArray);
      //   for (let facilityType of data.facilityTypeList) {
      //     let idx = data.fc._facilityIndexes[facilityType.facilityType];
      //     facilityTypesArray[idx].enabled = true;
      //   }

      //   // Select Facility Skeleton
      //   let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilitySelectDialogWindow);
      //   facilitySelectWindowHtml = $(compiledTemplate());

      //   // Select Facility Tabs
      //   compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityTypeButtons);
      //   let templateParms = {
      //     facilityTypes: facilityTypesArray
      //   };
      //   facilitySelectTabsHtml = $(compiledTemplate(templateParms));
      //   facilitySelectTabsHtml = $(facilitySelectWindowHtml).find("#sfd-facility-buttons").append(facilitySelectTabsHtml);

      //   // Select Facility Detail Windows.
      //   compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityDetailWindows);
      //   templateParms = {
      //     facilityTypes: facilityTypesArray
      //   }
      //   facilitySelectDetailsHtml = $(compiledTemplate(templateParms));
      //   facilitySelectDetailsHtml = $(facilitySelectWindowHtml).find("#sfd-facility-details").append(facilitySelectDetailsHtml);

      //   // Select Facility Accordian Data

      //   for (let facilityType of facilityTypesArray) {
      //     // console.log("facilityType = ", facilityType);
      //     compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityDetailData);
      //     templateParms = {
      //       facilityType: facilityType.facilityType,
      //       elementIdPrefix: facilityType.elementIdPrefix,
      //       generatorTypes: facilityType.generatorTypes,
      //       marginalCost: facilityType.marginalCost,
      //       localizedCost: facilityType.localizedCost,
      //       buildTime: facilityType.buildTime,
      //       operationalCost: facilityType.operationalCost,
      //       lifeExpectancy: facilityType.lifeExpectancy
      //     }
      //     facilitySelectDataHtml = $(compiledTemplate(templateParms));
      //     facilitySelectDataHtml = $(facilitySelectWindowHtml).find("#sfd-facility-detail-window-" + facilityType.elementIdPrefix).append(facilitySelectDataHtml);
      //   }

      //   //console.log("facilitySelectWindowHtml = ", facilitySelectWindowHtml);
      //   return facilitySelectWindowHtml;
      // }

      // _facilityTypeChange(evt) {
      //   //console.log("on facility type change...", evt.data);
      //   $("#facility-generator-type").text(evt.data.fc._getGeneratorType(evt.target.value).generatorType);
      //   $("#label-generator-type").text(evt.data.fc._getGeneratorType(evt.target.value).generatorType);
      //   $("#min-capacity-slider-label").text(evt.data.fc._getGeneratorType(evt.target.value).minCapacity + " MW");
      //   $("#max-capacity-slider-label").text(evt.data.fc._getGeneratorType(evt.target.value).maxCapacity + " MW");
      //   $("#slider-facility-capacity").attr("min", evt.data.fc._getGeneratorType(evt.target.value).minCapacity);
      //   $("#slider-facility-capacity").attr("max", evt.data.fc._getGeneratorType(evt.target.value).maxCapacity);
      //   $("#slider-facility-capacity").trigger("input");

      //   console.log(" $(#slider-facility-capacity).value", $("#slider-facility-capacity").val());
      // }

      // _getGeneratorType(facilityType) {
      //   for (let generator of this._generatorTypes) {
      //     if (facilityType === generator.facilityType)
      //       return generator
      //   }
      //   return null;
      // }




            // _sfdShowFacilityTypeDetail(evt) {
      //   //console.log("_sfdShowFacilityTypeDetail = ", evt);
      //   let facilityPrefix = $(evt.target).attr("name");
      //   if ($(evt.target).hasClass("selected")) {
      //     $(evt.target).removeClass("selected");
      //     $("#sfd-facility-detail-window-" + facilityPrefix).addClass("sfd-not-selected");
      //   }
      //   else {
      //     $(evt.target).addClass("selected");
      //     $("#sfd-facility-detail-window-" + facilityPrefix).removeClass("sfd-not-selected");
      //   }
      // }

      // _sfdSelectFacilityType(evt) {
      //   //console.log("_sfdSelectFacilityType = ", evt);
      //   evt.data.facilitySelected = true;
      //   evt.data.facility.type = $(evt.target).attr("name");
      //   evt.data.fc._facilityPlanningArray.push(evt.data.facility);

      //   evt.data.dialogBox.closeBox();

      //   let facilityBuildDialog = new FacilityBuildDialog(evt.data.facility.type);
      //   facilityBuildDialog.openDialog();
      // }


