define([
  "jquery",
  "easeljs",
  "grassTileDefs",
  "ProgressBar",
  "TerrainMap",
  "Tile",
  "TileMap",
  "tileTypeArray",
], function ($, createjs, grassTileDefs, ProgressBar, TerrainMap, Tile, TileMap, tileTypeArray) {

  const init = (terrainMapImage, terrainTilesImage, terrainImageConfig, terrainSpriteConfig) => {
    // let progressBar = new ProgressBar()
    // progressBar.barStart();

    console.log("init running")
    let terrainMap = new TerrainMap(terrainMapImage);
    let tileMapName = "terrain";

    // Uncomment to get copy of terrain tilemap in a 2D array 
    // let tileMapArray = new Array();
    // let tileTypeArray = new Array();

    // create spritesheet.
    let terrainSpriteSheet = new createjs.SpriteSheet({
      images: [terrainTilesImage],
      frames: {
        width: terrainSpriteConfig.width,
        height: terrainSpriteConfig.height,
        regX: 0,
        regY: 0
      }

    });

    terrainSpriteSheet.totalFrameCols = terrainSpriteConfig.frameCols;
    terrainSpriteSheet.totalFrameRows = terrainSpriteConfig.frameRows;

    // Get images from tilese and paste them into a canvas element 
    let imageMapCanvas = document.createElement('canvas');
    imageMapCanvas.setAttribute("width", "6000");
    imageMapCanvas.setAttribute("height", "3000");
    // let imageMapCanvas = new OffscreenCanvas(6000, 3000)
    let imageMapContext = imageMapCanvas.getContext("2d");

    // let tilesetCanvas = document.createElement('canvas');
    // tilesetCanvas.setAttribute("width", "500");
    // tilesetCanvas.setAttribute("height", "500");
    // // let tilesetCanvas = new OffscreenCanvas(500, 500)
    // let tilesetContext = tilesetCanvas.getContext("2d");
    // let tilesetImage = terrainSpriteSheet.getFrame(0).image;
    // tilesetContext.drawImage(tilesetImage, 0, 0);

    let terrainTileMap = new TileMap(
      terrainImageConfig.height,
      terrainImageConfig.width,
      terrainSpriteConfig.width,
      terrainSpriteConfig.height,
      tileMapName
    );

    // let barWidthTotalCalcs = terrainTileMap.rows * terrainTileMap.columns;
    // let barWidthInc = Math.floor(barWidthTotalCalcs / 100);
    // console.log("barWidthInc = ", barWidthInc);


    // let interval = setInterval(() => {
    //   clearInterval(interval);
    // }, 5000)
    //let worker = new Worker("../terrainWorker.js");

    for (let y = 0; y < terrainTileMap.rows; y++) {
      // Uncomment to get copy of terrain tilemap in a 2D array 
      // tileMapArray.push(new Array());
      // tileTypeArray.push(new Array());
      for (let x = 0; x < terrainTileMap.columns; x++) {
        // progressBar.barWidth = 
        // if ((((x + 1) * (y + 1)) % barWidthInc) == 0) {
        //   // console.log("x * y % inc = " + (x + 1) + " * " + (y + 1) + " % " + barWidthInc + " = " + ((x + 1) * (y + 1)) % barWidthInc);
        //   progressBar.barWidth++;
        //   console.log("progressBar.barWidth = ", progressBar.barWidth);
        // }

        // let terrainTileSprite = _matchTile(
        //   y,
        //   x,
        //   terrainSpriteSheet,
        //   terrainMap,
        //   tilesetContext
        // );

        // Uncomment to get copy of terrain tilemap in a 2D array 
        // let tileNumber = terrainTileSprite.tileProperties.tileRow * terrainSpriteConfig.frameCols + terrainTileSprite.tileProperties.tileIndex;
        // tileMapArray[y].push(tileNumber);
        // tileTypeArray[y].push(terrainTileSprite.tileProperties.tileType);

        if (true /*terrainTileSprite*/) {
          terrainTileMap.setTile(
            y,
            x,
            new Tile(
              0,
              tileTypeArray[y][x], // terrainTileSprite.type,
              terrainSpriteConfig.width,
              terrainSpriteConfig.height,
              null
              // terrainTileSprite.sprite
            ),
            false
          );
          // imageMapContext.putImageData(terrainTileSprite.image, x * 25, y * 25);
        }
      }
    }

    // Uncomment to get copy of terrain tilemap in a 2D array 
    // console.log("tileMapArray = ", JSON.stringify(tileMapArray));
    // console.log("tileTypeArray = ", JSON.stringify(tileTypeArray));
    // let terrainImage = imageMapCanvas.convertToBlob({
    //   type: "image/png"
    // }).then((result) => {
    //   console.log("terrainImage = ", terrainImage);
    // });

    // image in Canvas
    // let terrainImage = document.createElement('img')
    // terrainImage.src = imageMapCanvas.toDataURL("image/png");

    // image on server
    let terrainImage = document.createElement('img')
    terrainImage.src = '../static/img/world-map-6000x3000.png';
    terrainImage.onload = () => {
      let terrainBitmap = new createjs.Bitmap(terrainImage);
      terrainTileMap.addBitmapToContainer(terrainBitmap);
    }


    // Save image to img tag
    // let tImg = imageMapCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    // document.write('<img src="' + tImg + '"/>');


    // console.log("window.location.href = ", window.location.href);
    //terrainImage.src = imageMapCanvas.toDataURL("image/png");

    // let terrainBitmap = new createjs.Bitmap(terrainImage);
    // // console.log("terrainBitmap =", terrainBitmap);
    // terrainTileMap.addBitmapToContainer(terrainBitmap);

    return terrainTileMap;
  }

  // local vars and functions...
  // const _matchTile = (row, column, spriteSheet, terrainMap, tilesetContext) => {
  //   let tileType = terrainMap.getTerrainType(row, column);
  //   let tileProperties = _getTilePropertyIndexes(terrainMap, tileType, row, column);
  //   if (tileProperties) {
  //     // let sprite = _getSpriteFromSheet(tileProperties.tileRow, tileProperties.tileIndex, spriteSheet);
  //     // let image = _getImageFromSheet(tileProperties.tileRow, tileProperties.tileIndex, tilesetContext);
  //     return {
  //       type: tileProperties.tileType,
  //       tileProperties: tileProperties,
  //       sprite: null,
  //       image: null,
  //       // sprite: _getSpriteFromSheet(
  //       //   tileProperties.tileRow,
  //       //   tileProperties.tileIndex,
  //       //   spriteSheet
  //       // )
  //     };
  //   }
  //   return null;
  // }

  const _getTilePropertyIndexes = (terrainMap, tileType, row, column) => {
    switch (tileType) {
      case "snow":
        return {
          tileType: tileType,
          tileRow: 0,
          tileIndex: _checkTile(terrainMap, row, column, ["snow", "mountain", "winter"])
        };

      case "mountain":
        return {
          tileType: tileType,
          tileRow: 1,
          tileIndex: _checkTile(terrainMap, row, column, ["snow", "mountain", "winter"])
        };

      case "winter":
        return {
          tileType: tileType,
          tileRow: 0,
          tileIndex: _checkTile(terrainMap, row, column, ["snow", "mountain", "winter"])
        };

      case "river":
        return {
          tileType: tileType,
          tileRow: 3,
          tileIndex: _checkTile(terrainMap, row, column, [
            "river",
            "ocean-outlet",
            "lake-outlet"
          ])
        };

      case "conifers":
        return {
          tileType: tileType,
          tileRow: 4,
          tileIndex: _checkTile(terrainMap, row, column, ["conifers"])
        };

      case "deciduous":
        return {
          tileType: tileType,
          tileRow: 5,
          tileIndex: _checkTile(terrainMap, row, column, ["deciduous"])
        };

      case "water":
        return {
          tileType: tileType,
          tileRow: 10,
          tileIndex: 0
        };

      case "lake":
        return {
          tileType: tileType,
          tileRow: 10,
          tileIndex: 0
        };

      case "lake-outlet":
        return {
          tileType: tileType,
          tileRow: 12,
          tileIndex: _checkTile(terrainMap, row, column, ["river"])
        };

      case "ocean":
        return {
          tileType: tileType,
          tileRow: 11,
          tileIndex: 0
        };

      case "ocean-outlet":
        return {
          tileType: tileType,
          tileRow: 12,
          tileIndex: _checkTile(terrainMap, row, column, ["river"])
        };

      case "grass":
        let tileIndexLookup = _checkTile(
          terrainMap,
          row,
          column,
          [
            "snow",
            "mountain",
            "winter",
            "grass",
            "river",
            "ocean-outlet",
            "lake-outlet",
            "deciduous",
            "conifers",
            "arid-grass"
          ],
          8
        );
        let grassSpriteRow = 6;
        let tileIndex = grassTileDefs["" + tileIndexLookup];

        if (tileIndex) {
          if (tileIndex == 46) {
            tileIndex = Math.floor(Math.random() * 11);
          } else {
            grassSpriteRow += Math.floor(tileIndex / 16) + 1;
            tileIndex = tileIndex - Math.floor(tileIndex / 16) * 16;
          }
        } else {
          tileIndex = Math.floor(Math.random() * 11);
        }

        return {
          tileType: tileType,
          tileRow: grassSpriteRow,
          tileIndex: tileIndex
        };

      case "arid-grass":
        return {
          tileType: tileType,
          tileRow: 13,
          tileIndex: Math.floor((Math.random() * 4))
        };

      default:
        return null;
    }
  }

  const _getSpriteFromSheet = (row, index, spriteSheet) => {
    let totalIndex = row * spriteSheet.totalFrameCols + index;
    // if (row === 1) {
    //   console.log(`row = ${row}, spriteSheet.totalFrameCols = ${spriteSheet.totalFrameCols}, index = ${index}, totalIndex = ${totalIndex}`);
    // }
    return new createjs.Sprite(spriteSheet, totalIndex);
  }

  ///////////////////////////////////
  const _getImageFromSheet = (row, col, tilesetContext) => {
    return tilesetContext.getImageData(col * 25, row * 25, 25, 25);
  }
  //////////////////////////////////

  // This function is within getTilePropertyName function.
  const _checkTile = (terrainMap, row, column, checkTileArray, bitmask = 4, reverseBorder = false) => {
    let bitmaskString = "";
    let tilePropertyString = "";

    for (let i = 0; i < 4; i++) {
      let checkRow = [];
      let checkCol = [];
      switch (i) {
        case 0:
          if (bitmask != 4) {
            checkRow.push(row - 1);
            checkCol.push(column - 1);
          }
          checkRow.push(row - 1);
          checkCol.push(column);
          break;
        case 1:
          if (bitmask != 4) {
            checkRow.push(row - 1);
            checkCol.push(column + 1);
          }
          checkRow.push(row);
          checkCol.push(column - 1);
          break;
        case 2:
          checkRow.push(row);
          checkCol.push(column + 1);
          if (bitmask != 4) {
            checkRow.push(row + 1);
            checkCol.push(column - 1);
          }
          break;
        case 3:
          checkRow.push(row + 1);
          checkCol.push(column);
          if (bitmask != 4) {
            checkRow.push(row + 1);
            checkCol.push(column + 1);
          }
          break;
      }

      for (j = 0; j < bitmask / 4; j++) {
        let terrainType = terrainMap.getTerrainType(checkRow[j], checkCol[j]);
        //console.log("check row : column = " + checkRow[j] + " : " + checkCol[j] + " = " + terrainType);
        //console.log("terrainType = " + terrainType);
        let sameTerrain = 0;
        if (!terrainType) {
          //console.log("no terrainType...");
          if (!reverseBorder) {
            sameTerrain = 1;
          }
        } else {
          if ($.inArray(terrainType, checkTileArray) >= 0) {
            sameTerrain = 1;
          }
        }
        bitmaskString = sameTerrain + "" + bitmaskString;
      }
    }

    let bitmaskNumber = parseInt(bitmaskString, 2);
    if (bitmask != 4) {
      if (bitmaskNumber & parseInt("00000001", 2)) {
        if (
          !(bitmaskNumber & parseInt("00000010", 2)) ||
          !(bitmaskNumber & parseInt("00001000", 2))
        ) {
          bitmaskNumber = bitmaskNumber & parseInt("11111110", 2);
        }
      }
      if (bitmaskNumber & parseInt("00000100", 2)) {
        if (
          !(bitmaskNumber & parseInt("00000010", 2)) ||
          !(bitmaskNumber & parseInt("00010000", 2))
        ) {
          bitmaskNumber = bitmaskNumber & parseInt("11111011", 2);
        }
      }
      if (bitmaskNumber & parseInt("00100000", 2)) {
        if (
          !(bitmaskNumber & parseInt("00001000", 2)) ||
          !(bitmaskNumber & parseInt("01000000", 2))
        ) {
          bitmaskNumber = bitmaskNumber & parseInt("11011111", 2);
        }
      }
      if (bitmaskNumber & parseInt("10000000", 2)) {
        if (
          !(bitmaskNumber & parseInt("01000000", 2)) ||
          !(bitmaskNumber & parseInt("00010000", 2))
        ) {
          bitmaskNumber = bitmaskNumber & parseInt("01111111", 2);
        }
      }
    }

    //console.log("bitmaskString = " + bitmaskString);
    return bitmaskNumber;
  }

  return init;
});
