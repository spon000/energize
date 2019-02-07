define([
	"Dim2",
	"easeljs",
	"TileMap",
	"Tile",
	"City"

], function (Dim2, createjs, TileMap, Tile, City) {
	return (
		class CityLayer {
			constructor(citySpriteImage, citySpriteConfig, terrainImageConfig, terrainSpriteConfig, citiesData) {
				this._citiesData = citiesData;
				this._citySpriteImage = citySpriteImage;
				this._citySpriteConfig = citySpriteConfig;
				this._cityList = [];
				this._tileMap = null;
				this._terrainImageConfig = terrainImageConfig;
				this._terrainSpriteConfig = terrainSpriteConfig;
				this._scaleMap = [new Dim2(1, 1), new Dim2(2, 2), new Dim2(3, 3)];
			}

			// Getters...
			get citiesData() {
				return this._citiesData;
			}

			get tileMap() {
				return this._tileMap;
			}

			// Setters...
			set citiesData(citiesData) {
				this._citiesData = citiesData;
				this.createTileMap();
			}

			// Public methods
			createTileMap() {
				this._tileMap = new TileMap(
					this._terrainImageConfig.height,
					this._terrainImageConfig.width,
					this._terrainSpriteConfig.width,
					this._terrainSpriteConfig.height
				);
				this._createCityTiles();
				return this._tileMap;
			}

			// Private methods
			_createCityTiles() {
				this._cityList = [];
				let citySpriteSheet = new createjs.SpriteSheet({
					images: [this._citySpriteImage],
					frames: {
						width: this._citySpriteConfig.width,
						height: this._citySpriteConfig.height
					}
				});

				this._citiesData.forEach((cityData) => {
					let citySprite = new createjs.Sprite(citySpriteSheet, 0)
					let tile = this._scaleTile(cityData, new Tile("city", this._citySpriteConfig.width, this._citySpriteConfig.height, citySprite, false));
					let city = new City(cityData.id, cityData.name, cityData.population, cityData.daily_consumption, tile);
					this._cityList.push(city);
				});
			}

			_scaleTile(cityData, tile) {
				if (cityData.population >= 1000000)
					tile.scaleX = tile.scaleY = 3;
				else if (cityData.population >= 500000)
					tile.scaleX = tile.scaleY = 2;
				else
					tile.scaleX = tile.scaleY = 1;

				let numX = Math.floor(tile.width / this._terrainSpriteConfig.width) * tile.scaleX;
				let numY = Math.floor(tile.height / this._terrainSpriteConfig.height) * tile.scaleY;
				let firstTile = true;
				for (let row = cityData.row; row < (cityData.row + numY); row++) {
					for (let col = cityData.column; col < cityData.column + numX; col++) {
						this._tileMap.setTile(row, col, tile, firstTile);
						firstTile = false;
					}
				}
				return tile;
			}
		});
});
