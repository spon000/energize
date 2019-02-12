define([
  // Libs
  "Dim2"
  // Classes
], function (Dim2) {
  return ({
    "canvasConfig": {
      "scaleMap": [new Dim2(.2, .2), new Dim2(.4, .4), new Dim2(1, 1), new Dim2(2, 2)],
      "width": 1200,
      "height": 600
    },
    "terrainImageConfig": {
      "name": "terrainBitmap",
      "path": "static/img/world-map-240x120b.png",
      "width": 240,
      "height": 120,
    },
    "terrainSpriteConfig": {
      "name": "terrainSprite",
      "path": "static/img/tiles/terrain-tiles.png",
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
      "path": "static/img/tiles/tech-tilesd.png",
      "width": 50,
      "height": 50,
      "sprites": [
        { "type": "cityblock1", "frame": 0 }
      ]
    },
    "facilitySpriteConfig": {
      "name": "facilitySprites",
      "path": "static/img/tiles/tech-tilesd.png",
      "width": 50,
      "height": 50,
      "sprites": [
        // type 1 - 8 match facility_type table ID field.
        // type 0 is generic facility icon.
        { "type": 0, "frame": 20 },
        { "type": 1, "frame": 21 },
        { "type": 2, "frame": 22 },
        { "type": 3, "frame": 23 },
        { "type": 4, "frame": 24 },
        { "type": 5, "frame": 25 },
        { "type": 6, "frame": 26 },
        { "type": 7, "frame": 27 },
        { "type": 8, "frame": 28 }
      ]
    }
  });
});				