define([
  "jquery",
  "easeljs",
  "TileMap",
  "Tile",
  "TerrainMap",
  "grassTileDefs"
], function ($, createjs, TileMap, Tile, TerrainMap, grassTileDefs) {

  const init = (terrainMapImage, terrainTilesImage, terrainImageConfig, terrainSpriteConfig) => {
    let terrainMap = new TerrainMap(terrainMapImage);

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

    let terrainTileMap = new TileMap(
      terrainImageConfig.height,
      terrainImageConfig.width,
      terrainSpriteConfig.width,
      terrainSpriteConfig.height
    );
    for (let y = 0; y < terrainTileMap.rows; y++) {
      for (let x = 0; x < terrainTileMap.columns; x++) {
        let terrainTileSprite = _matchTile(
          y,
          x,
          terrainSpriteSheet,
          terrainMap
        );
        if (terrainTileSprite) {
          terrainTileMap.setTile(
            y,
            x,
            new Tile(
              terrainTileSprite.type,
              terrainSpriteConfig.width,
              terrainSpriteConfig.height,
              terrainTileSprite.sprite
            )
          );
        }
      }
    }
    return terrainTileMap;
  }

  // local vars and functions...
  const _matchTile = (row, column, spriteSheet, terrainMap) => {
    let tileType = terrainMap.getTerrainType(row, column);
    let tileProperties = _getTilePropertyIndexes(terrainMap, tileType, row, column);
    if (tileProperties) {
      return {
        type: tileProperties.tileType,
        sprite: _getSpriteFromSheet(
          tileProperties.tileRow,
          tileProperties.tileIndex,
          spriteSheet
        )
      };
    }
    return null;
  }

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
            tileIndex = Math.random() * 11;
          } else {
            grassSpriteRow += Math.floor(tileIndex / 16) + 1;
            tileIndex = tileIndex - Math.floor(tileIndex / 16) * 16;
          }
        } else {
          tileIndex = Math.random() * 11;
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
          tileIndex: Math.random() * 4
        };

      default:
        return null;
    }
  }

  const _getSpriteFromSheet = (row, index, spriteSheet) => {
    let totalIndex = row * spriteSheet.totalFrameCols + index;
    return new createjs.Sprite(spriteSheet, totalIndex);
  }

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
