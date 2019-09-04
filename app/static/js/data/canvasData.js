define([
  // Libs
  "Dim2",
  // Classes
], function (Dim2) {
  return ({
    "canvasConfig": {
      "scaleMap": [new Dim2(.2, .2), new Dim2(.4, .4), new Dim2(1, 1)],
      // "scaleMap": [new Dim2(.5, .5), new Dim2(1, 1)],
      "initialZoomLevel": 0,
      "initialOriginX": 0,
      "initialOriginY": 0,
      "width": 1200,
      "height": 600
    },
    "phaserConfig": {
      "width": 1200,
      "height": 600,
      "parent": "map-view"
    },
    "terrainImageConfig": {
      "name": "terrainBitmap",
      "path": "/static/img/world-map-240x120c.png",
      "width": 240,
      "height": 120,
    },
    "terrainSpriteConfig": {
      "name": "terrainSprite",
      "path": "/static/img/tiles/terrain-tiles.png",
      "width": 25,
      "height": 25,
      "frameCols": 20,
      "frameRows": 30,
      "regX": 0,
      "regY": 0,
      "scaleToMap": true
    },
    "citySpriteConfig": {
      "name": "citySprites",
      "path": "/static/img/tiles/tech-tilesd.png",
      "width": 50,
      "height": 50,
      "sprites": [
        { "type": "cityblock1", "frame": 0 }
      ]
    },
    "playerMarkerConfig": {
      "name": "playerMarks",
      "path": "/static/img/tiles/player_highlight2.png",
      "width": 100,
      "height": 100,
      "sprites": [
        { "type": "playermarker", "frame": 0 }
      ]
    },
    "facilitySpriteConfig": {
      "name": "facilitySprites",
      "path": "/static/img/tiles/facility_icons_1300x100.png",
      "width": 100,
      "height": 100,
      "sprites": [
        // type 1 - 8 match facility_type table ID field.
        // type 9 is generic facility icon.
        { "type": 1, "frame": 3 },
        { "type": 2, "frame": 3 },
        { "type": 3, "frame": 5 },
        { "type": 4, "frame": 4 },
        { "type": 5, "frame": 2 },
        { "type": 6, "frame": 2 },
        { "type": 7, "frame": 0 },
        { "type": 8, "frame": 1 },
        { "type": 9, "frame": 12 }
      ]
    }
  });
});				