define([
  // Libs
  // Classes
], function () {
  return ({
    "prohibitedTerrainTiles": [
      { "type": "ocean", "range": 0 },
      { "type": "mountain", "range": 0 },
      { "type": "snow", "range": 0 },
      { "type": "lake", "range": 0 }
    ],
    "prohibitedTechTiles": [
      { "type": "city", "range": 1 },
      { "type": "facility", "range": 3 },
    ],

    "allowedFacilityTypesByTerrain": [
      ""
    ]
  });
});