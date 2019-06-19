requirejs.config({
  //By default load any module IDs from js
  baseUrl: "/static/js",
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
    phaser3: "lib/phaser3/phaser.min",
    socketio: "lib/socketio/socket.io",
    Tabulator: "lib/tabulator/tabulator.min",
    Vue: "https://cdn.jsdelivr.net/npm/vue/dist/vue",
    Vuex: "https://unpkg.com/vuex",

    // MVC classes
    CanvasController: "class/mvc/CanvasController",
    CanvasModel: "class/mvc/CanvasModel",
    CanvasView: "class/mvc/CanvasView",
    // BuildFacilityController: "class/mvc/BuildFacilityController",
    // BuildFacilityModel: "class/mvc/BuildFacilityModel",
    // BuildFacilityView: "class/mvc/BuildFacilityView",

    // HTML Templates
    // FacilityBuildDialog: "template/FacilityBuildTmplt",
    FacilitySelectTmplt: "template/FacilitySelectTmplt",
    FacilityViewTmplt: "template/FacilityViewTmplt",
    CityViewTmplt: "template/CityViewTmplt",

    // Javascript classes
    Biome: "class/Biome",
    City: "class/City",
    CityLayer: "class/CityLayer",
    Component: "class/Compnent",
    Dim2: "class/Dim2",
    EventEmitter: "class/EventEmitter",
    Facility: "class/Facility",
    FacilityLayer: "class/FacilityLayer",
    FacilitySelectDialog: "class/FacilitySelectDialog",
    FacilityViewDialog: "class/FacilityViewDialog",
    Game: "class/Game",
    Generator: "class/Generator",
    Layer: "class/Layer",
    LayerItem: "class/LayerItem",
    ModelData: "class/ModelData",
    PortfolioViewDialog: "class/PortfolioViewDialog",
    PubSub: "class/PubSub",
    ResourceLoader: "class/ResourceLoader",
    SocketIOCalls: "class/SocketIOCalls",
    Store: "class/Store",
    TerrainMap: "class/TerrainMap",
    Tile: "class/Tile",
    TileMap: "class/TileMap",
    TopMenu: "class/TopMenu",
    Vector2: "class/Vector2",
    View: "class/View",

    //Components
    CityView: "components/CiyView",

    //Central store files
    state: "store/state",
    cityActions: "store/cityActions",
    cityMutants: "store/cityMutants",

    // Data objects
    canvasData: "data/canvasData",
    facilityTileDefs: "data/facilityTileDefs",
    grassTileDefs: "data/grassTileDefs",
    networkCallMap: "data/networkCallMap",
    tileMapArray: "data/tileMapArray",
    tileTypeArray: "data/tileTypeArray",

    // Misc objects
    dateUtils: "misc/dateUtils",
    evtEmitter: "misc/evtEmitter",
    gameStore: "misc/gameStore",
    terrainLayer: "misc/terrainLayer",
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
    evtEmitter: {
      exports: "evtEmitter"
    },
    gameStore: {
      exports: "gameStore"
    },
    Handlebars: {
      exports: "handlebars"
    },
    socketio: {
      exports: "socketio"
    },
    tabulator: {
      exports: "Tabulator"
    }
  }
});

//////////////////////////////////////////////////////////////////////////
// Main.js starts here...
require([
  "Game",
  "phaser3",
], function (Game, Phaser) {
  console.log("global game id = ", globalGameId);
  game = new Game(globalGameId);
});
