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
    },
    "facilitySpriteConfig": {
      "name": "facilitySprites",
      "path": "static/img/tiles/tech-tilesd.png",
      "width": 50,
      "height": 50,
    }
  });
});				