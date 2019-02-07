define([], function () {
  return (
    // Class of constants used to define colors of terrain.
    class Biome {
      constructor() {
        this._SNOW = "#fffafa";
        this._WATER = "#010101";
        this._LAKE = "#44447a";
        this._OCEAN = "#99d9ea";
        this._OCEAN_OUTLET = "#00a2e8";
        this._LAKE_OUTLET = "#7092be";
        this._BEACH = "#a09077";
        this._TAIGA = "#99aa77";
        this._GRASSLAND = "#88aa55";
        this._ARID_GRASSLAND = "#ffdd99";
        this._TEMPERATE_DECIDUOUS_FOREST = "#679459";
        this._CONIFERS = "#c9e952";
        this._TEMPERATE_DESERT = "#c9d29b";
        this._MOUNTAIN = "#888888";
        this._RIVER = "#0101fe";
        this._CITY = "#999999";
        this._FACILITY = "#aeaeae";
      }

      // Getters...
      get SNOW() {
        return this._SNOW;
      }

      get WATER() {
        return this._WATER;
      }

      get LAKE() {
        return this._LAKE;
      }

      get OCEAN() {
        return this._OCEAN;
      }

      get BEACH() {
        return this._BEACH;
      }

      get TAIGA() {
        return this._TAIGA;
      }

      get GRASSLAND() {
        return this._GRASSLAND;
      }

      get TEMPERATE_DECIDUOUS_FOREST() {
        return this._TEMPERATE_DECIDUOUS_FOREST;
      }

      get TEMPERATE_DESERT() {
        return this._TEMPERATE_DESERT;
      }

      get MOUNTAIN() {
        return this._MOUNTAIN;
      }

      // Methods...
      // terrainColors(noiseValue) {
      //   if (noiseValue < 0.23) return this._WATER;
      //   else if (noiseValue < 0.235) return this._BEACH;
      //   else if (noiseValue < 0.8) return this._GRASSLAND;
      //   else if (noiseValue < 0.95) return this._MOUNTAIN;
      //   else return this._SNOW;
      // }

      // heightColors(noiseValue) {
      //   var color1d = Math.trunc(noiseValue * 255);
      //   return this.toHexRGB([color1d, color1d, color1d]);
      // }

      toHexRGB(rgbArray) {
        // return hex RGB value.
        let hexColorString =
          "#" +
          ("0" + rgbArray[0].toString(16)).slice(-2) +
          ("0" + rgbArray[1].toString(16)).slice(-2) +
          ("0" + rgbArray[2].toString(16)).slice(-2);
        return hexColorString;
      }

      toRGBArray(hexColorString) {
        // Assume the RGB hex string format is "#??????"
        let rgbArray = [
          parseInt("0x" + hexColorString.slice(1, 3)),
          parseInt("0x" + hexColorString.slice(3, 5)),
          parseInt("0x" + hexColorString.slice(5, 7))
        ];
        return rgbArray;
      }

      getBiome(rgbHexString) {
        switch (rgbHexString) {
          case this._SNOW:
            return "snow";
          case this._MOUNTAIN:
            return "mountain";
          case this._BEACH:
            return "beach";
          case this._WATER:
            return "water";
          case this._OCEAN:
            return "ocean";
          case this._OCEAN_OUTLET:
            return "ocean-outlet";
          case this._LAKE:
            return "lake";
          case this._LAKE_OUTLET:
            return "lake-outlet";
          case this._GRASSLAND:
            return "grass";
          case this._ARID_GRASSLAND:
            return "arid-grass";
          case this._RIVER:
            return "river";
          case this._CITY:
            return "city";
          case this._CONIFERS:
            return "conifers";
          case this._TEMPERATE_DECIDUOUS_FOREST:
            return "deciduous";
          default:
            return "unknown";
        }
      }
    }
  );
});
