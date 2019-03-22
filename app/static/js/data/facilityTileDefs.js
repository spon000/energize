define([
  // Libs
  // Classes
], function () {
  return ({
    "prohibitedTechTiles": [
      { "city": 2 },
      { "facility": 3 },
    ],

    "allowedFacilityTypesByTerrain": {
      // FacilityTypeID found in facility_type database table
      "1": {
        "prohibited": {
          "0": ["ocean", "mountain", "snow", "lake"]
        },
        "allowed": {
          "0": ["river", "lake-outlet", "ocean-outlet"],
          "1": ["lake", "ocean"]
        }
      },
      "2": {
        "prohibited": {
          "0": ["ocean", "mountain", "snow", "lake"]
        },
        "allowed": {
          "0": ["river", "lake-outlet", "ocean-outlet"],
          "1": ["lake", "ocean"]
        }
      },
      "3": {
        "prohibited": {
          "0": ["ocean", "mountain", "snow", "lake", "deciduous", "conifers", "river", "lake-outlet", "ocean-outlet"]
        },
        "allowed": {
          "0": ["grass", "arid-grass"],
        }
      },
      "4": {
        "prohibited": {
          "0": ["ocean", "mountain", "snow", "lake", "deciduous", "conifers", "river", "lake-outlet", "ocean-outlet"]
        },
        "allowed": {
          "0": ["grass", "arid-grass"],
        }
      },
      "5": {
        "prohibited": {
          "0": ["ocean", "mountain", "snow", "lake"]
        },
        "allowed": {
          "0": ["grass", "arid-grass", "deciduous", "conifers"],
        }
      },
      "6": {
        "prohibited": {
          "0": ["ocean", "mountain", "snow", "lake"]
        },
        "allowed": {
          "0": ["grass", "arid-grass", "deciduous", "conifers"],
        }
      },
      "7": {
        "prohibited": {
          "0": ["ocean", "mountain", "snow", "lake"]
        },
        "allowed": {
          "0": ["lake-outlet", "ocean-outlet", "river"],
          "1": ["lake-outlet", "ocean-outlet", "river", "lake"]
        }
      },
      "8": {
        "prohibited": {
          "0": ["ocean", "mountain", "snow", "lake", "deciduous", "conifers", "ocean-outlet"]
        },
        "allowed": {
          "0": ["lake-outlet", "river"]
        }
      }
    }
  });
});
