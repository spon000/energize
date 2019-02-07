define([
  // Libs
  "jquery",

  // Classes
  "Vector2",
  "Biome"
], function ($, Vector2, Biome) {
  return (
    // Class that represents a noise map using the provided library.
    class TerrainMap {
      constructor(mapImage = null) {
        this._mapImage = mapImage;
        this._biome = new Biome();
        this._mapImageData = this._exportToImageData();

        //console.log("this._mapImageData = ", this._mapImageData);

        if (mapImage) {
          this._width = mapImage.width;
          this._height = mapImage.height;
        } else {
          this._width = 0;
          this._height = 0;
        }
      }

      // Getters...
      get mapImage() {
        return this._mapImage;
      }

      // Setters...
      set mapImage(mapImage) {
        this._mapImage = mapImage;
        this._width = mapImage.width;
        this._height = mapImage.height;
      }

      //Methods...
      getTerrainType(row, column) {
        if (
          this._mapImageData &&
          (row >= 0 && row < this._height) &&
          (column >= 0 && column < this._width)
        ) {
          let rgbIndex = (row * this._width + column) * 4;
          let hexString = this._biome.toHexRGB([
            this._mapImageData.data[rgbIndex],
            this._mapImageData.data[rgbIndex + 1],
            this._mapImageData.data[rgbIndex + 2]
          ]);
          //console.log("hexString = " + hexString);
          return this._biome.getBiome(hexString);
        }
        return null;
      }

      _exportToImageData() {
        if (this._mapImageData) {
          return this._mapImageData;
        } else if (this._mapImage) {
          var canvas = document.createElement("canvas");
          var context = canvas.getContext("2d");

          canvas.width = this._mapImage.width;
          canvas.height = this._mapImage.height;
          context.drawImage(this._mapImage, 0, 0);
          this._mapImageData = context.getImageData(
            0,
            0,
            this._mapImage.width,
            this._mapImage.height
          );
          return this._mapImageData;
        } else {
          return null;
        }
      }
    }
  );
});
