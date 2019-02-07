requirejs.config({
  //By default load any module IDs from js
  baseUrl: "static/js",
  //except, if the module ID starts with "app",
  //load it from the js/app directory. paths
  //config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  paths: {
    // Core libraries
    jquery: "lib/jquery/jquery.3.3.1.min",
    jqueryui: "lib/jquery-ui/jquery-ui.min",
    // "bootstrap.bundle.4.1.1.min" contains needed popper.js library.
    "jq.bootstrap": "lib/bootstrap/bootstrap.bundle.4.1.1.min",
    easeljs: "lib/easeljs/easeljs.1.0.0.min",
    Handlebars: "lib/handlebars/handlebars-v4.0.12",
    //"dojo": "//download.dojotoolkit.org/release-1.13.0/dojo",

    // Javascript classes
    Game: "class/Game",
    Player: "class/Player",
    Interfact: "class/Interface",

    CanvasMap: "class/CanvasMap",
    DataStructures: "class/DataStructures",
    Layer: "class/Layer",
    Vector2: "class/Vector2",
    Tile: "class/Tile",
    TileMap: "class/TileMap",
    TileMapLayer: "class/TileMapLayer",
    TerrainMap: "class/TerrainMap",
    Biome: "class/Biome",
    Keys: "class/Keys",
    City: "class/City",
    Facility: "class/Facility",
    Generator: "class/Generator",
    FacilityController: "class/FacilityController",
    FacilityBuildDialog: "class/dialog/FacilityBuildDialog",
    FacilitySelectDialog: "class/dialog/FacilitySelectDialog",
    FacilityViewDialog: "class/dialog/FacilityViewDialog",


    DialogBoxInfo: "class/DialogBoxInfo",
    DialogBoxInfo2: "class/DialogBoxInfo2",
    DialogBoxSelect: "class/DialogBoxSelect",
    DialogBoxConfirm: "class/DialogBoxConfirm",

    TopMenu: "class/TopMenu",
    SideMenu: "class/SideMenu",

    // Template files
    FacilitySelectTmplt: "template/FacilitySelectTmplt",
    FacilityBuildTmplt: "template/FacilityBuildTmplt",
    FacilityViewTmplt: "template/FacilityViewTmplt",

    // Definition files
    GrassTileDefs: "misc/GrassTileDefs",
    TerrainLayer: "misc/TerrainLayer",
    CityLayer: "misc/CityLayer",
    OverlayLayer: "misc/OverlayLayer",
    InterfaceX: "misc/Interface",
    FacilityDefs: "misc/FacilityDefs",
    TopMenuDefs: "misc/TopMenuDefs"
  },

  // Allows you to use non AMD (Asynchronus Module Definition)
  // supported libraries that have dependencies on other libraries.
  // "deps" lists dependencies required by the module.
  shim: {
    "jq.bootstrap": {
      deps: ["jquery"]
    },
    easeljs: {
      exports: "createjs"
    },
    Handlebars: {
      exports: "handlebars"
    }
  }
});

// Main.js starts here...
require([
  "jquery",
  "CanvasMap",
  "DataStructures",
  "Vector2",
  "TerrainLayer",
  "CityLayer",
  "Interface",
  "FacilityController",

], function (
  $,
  CanvasMap,
  DataStructures,
  Vector2,
  TerrainLayer,
  CityLayer,
  Interface,
  FacilityController,
  ) {
    console.log("JS: main.js starting...");

    let canvasMapStage = new CanvasMap("map-viewport-window");

    let resourceList = [
      { name: "world", type: "img", path: "static/img/world-map-240x120b.png" },
      { name: "terrain", type: "img", path: "static/img/tiles/terrain-tiles.png" },
      { name: "city", type: "img", path: "static/img/tiles/tech-tilesd.png" },
      { name: "cityTable", type: "ajax", path: "/cities" },
      { name: "facilityTable", type: "ajax", path: "/facilities" },
      { name: "playerCompany", type: "ajax", path: "/company" },
      { name: "currentGame", type: "ajax", path: "/gamedata" },
      { name: "facilityTypes", type: "ajax", path: "/facilitytypes" },
      { name: "generatorTypes", type: "ajax", path: "/generatortypes" },
      { name: "powerTypes", type: "ajax", path: "/powertypes" }
    ]

    let dataStructures = new DataStructures();

    const loadResources = resources => Promise.all(resources.map(checkResource));
    loadResources(resourceList).then(resourceResults => {


      //console.log("loadResources.then()...");
      let resourcesObject = {};
      resourceResults.forEach(resourceResult => {
        //console.log("resourceResult = ", resourceResult);
        resourcesObject[resourceResult.name] = resourceResult.data;
      });
      //console.log("resourcesObject = ", resourcesObject);

      // Populate DataStructures object
      dataStructures.gameData = resourcesObject.currentGame.game;
      dataStructures.playerCompany = resourcesObject.playerCompany_ajax.player_company;
      dataStructures.cities = resourcesObject.cityTable_ajax.cities;
      dataStructures.facilities = resourcesObject.facilityTable_ajax.facilities;

      let terrainTileMap = TerrainLayer.init(
        resourcesObject.world_img,
        resourcesObject.terrain_img,
        120,
        240
      );

      let cityTileMap = CityLayer.init(resourcesObject.city_img);
      CityLayer.createCities(resourcesObject.cityTable_ajax.cities);

      canvasMapStage.addTileMap(terrainTileMap);
      canvasMapStage.addTileMap(cityTileMap);

      // FacilityController manages facility layers.
      let facilityController = new FacilityController(50, 50, 25, 25,
        canvasMapStage,
        resourcesObject.city_img
      );

      const playerCompany = resourcesObject.playerCompany_ajax.player_company;
      console.log("playerCompany = ", playerCompany);
      const facilityList = resourcesObject.facilityTable_ajax.facilities;

      // These object methods also call canvasMapStage.addTileMap() to add the tileMap to the canvas.
      facilityController.highlightPlayerFacilities(canvasMapStage, facilityList, playerCompany.player_number);
      //canvasMapStage.addTileMap();
      facilityController.addFacilitiesToMap(canvasMapStage, facilityList);

      const interface = new Interface({
        canvasMap: canvasMapStage,
        facilityController: facilityController,
        cityLayer: CityLayer,
        playerCompany: playerCompany,
        dataStructures: dataStructures
      })

      //Interface.init(canvasMapStage, facilityController, playerCompany);

      // These need to be declared in ascending order!
      canvasMapStage.addZoomLevel(new Vector2(5, 5));
      canvasMapStage.addZoomLevel(new Vector2(10, 10));
      canvasMapStage.addZoomLevel(new Vector2(25, 25));
      canvasMapStage.addZoomLevel(new Vector2(50, 50));

      canvasMapStage.addScaleLevel(new Vector2(0.2, 0.2));
      canvasMapStage.addScaleLevel(new Vector2(0.4, 0.4));
      canvasMapStage.addScaleLevel(new Vector2(1, 1));
      canvasMapStage.addScaleLevel(new Vector2(2, 2));

      canvasMapStage.zoomLevel = 0;
      canvasMapStage.startCanvasTimer();
    });

    //////////////////////////////////////////////////////////////////////////////////////////
    // Function to asynchronously load either image or json object resource. Returns a promise.
    const checkResource = (resource) => {
      //console.log("checkResource()...");
      switch (resource.type) {
        case "img":
          //console.log("checkResource() = img");
          return new Promise(resolve => {
            const img = new Image();
            //console.log("new Image()");
            img.onload = (evt) => {
              //console.log("img.onload!!");
              resolve({ data: evt.target, name: resource.name + "_" + resource.type });
            }
            img.onerror = () => {
              //console.log("img.onerror!!");
              resolve({ path, status: "error" });
            }
            img.src = resource.path
          });
        case "ajax":
          //console.log("checkResource() = ajax");
          return $.get(resource.path).promise().then(results => ({
            data: results, name: resource.name + "_" + resource.type
          }));
        default:
          //console.log("checkResource() = null");
          return null;
      }
    }

  });




     // switch (playerCompany.state) {
      //   case "build":
      //     facilityController.status = facilityController.STATUS.BUILDING;
      //     $("#facility-btn").addClass(["building", "no-hover"]);
      //     break;
      //   default:
      //     facilityController.status = facilityController.STATUS.NONE;
      // }
