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

    // MVC classes
    CanvasController: "class/mvc/CanvasController",
    CanvasModel: "class/mvc/CanvasModel",
    CanvasView: "class/mvc/CanvasView",

    // Javascript classes
    Biome: "class/Biome",
    City: "class/City",
    CityLayer: "class/CityLayer",
    Dim2: "class/Dim2",
    EventEmitter: "class/EventEmitter",
    Facility: "class/Facility",
    FacilityLayer: "class/FacilityLayer",
    Game: "class/Game",
    ResourceLoader: "class/ResourceLoader",
    TerrainMap: "class/TerrainMap",
    Tile: "class/Tile",
    TileMap: "class/TileMap",
    TopMenu: "class/TopMenu",
    Vector2: "class/Vector2",

    // Data objects
    canvasData: "data/canvasData",
    facilityTileDefs: "data/facilityTileDefs",
    grassTileDefs: "data/grassTileDefs",
    networkCallMap: "data/networkCallMap",

    // Misc objects
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
    Handlebars: {
      exports: "handlebars"
    }
  }
});

//////////////////////////////////////////////////////////////////////////
// Main.js starts here...
require([
  "Game",
], function (
  Game
) {
    console.log("JS: main.js starting...");
    game = new Game();
  });
