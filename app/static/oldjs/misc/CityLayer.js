define([
	"jquery",
	"Vector2",
	"easeljs",
	"TileMap",
	"Tile",
	"City"

], function ($, Vector2, Easeljs, TileMap, Tile, City) {

	let _tileSpriteWidth = 50;
	let _tileSpriteHeight = 50;
	let _tileMapWidth = 25;
	let _tileMapHeight = 25;
	let _cityTileMap = null;
	let _citySpriteSheet = null;
	let _cityArray = [];

	return {

		init: (cityImage, canvasMapStage) => {
			console.log("CityLayer.init()...");

			//console.log(tileSpriteWidth + " : " + tileSpriteHeight);

			_setCitySpriteSheet(new createjs.SpriteSheet({
				images: [cityImage],
				frames: { width: _tileSpriteWidth, height: _tileSpriteHeight, regX: 0, regY: 0 }
			}));

			_setCityTileMap(new TileMap(120, 240, _tileMapWidth, _tileMapHeight, canvasMapStage));
			return _getCityTileMap();
		},

		createCities: (cityInfoArray, displayInfoBox = true, index = 0) => {

			//console.log("cityInfoArray = ", cityInfoArray);
			cityInfoArray.forEach((cityInfo) => {
				cityInfo.population /= 1000000;
				cityInfo.daily_consumption /= 1000;
				let cityTileSprite = new createjs.Sprite(_getCitySpriteSheet(), index);
				let cityTile = new Tile("city", _tileSpriteHeight, _tileSpriteHeight, cityTileSprite, false);
				let city = new City(cityInfo.name, cityInfo.population, cityInfo.daily_consumption, cityTile);
				let numX = _tileSpriteWidth / _tileMapWidth;
				let numY = _tileSpriteHeight / _tileMapHeight;

				cityTile.data = city;
				if (cityInfo.population > 7) {
					cityTile.scaleX = cityTile.scaleY = 3;
				} else if (cityInfo.population > 1) {
					cityTile.scaleX = cityTile.scaleY = 2;
				} else {
					cityTile.scaleX = cityTile.scaleY = 1;
				}

				numX *= cityTile.scaleX;
				numY *= cityTile.scaleY;
				let firstTile = true;
				for (let row = cityInfo.row; row < (cityInfo.row + numY); row++) {
					for (let col = cityInfo.column; col < cityInfo.column + numX; col++) {
						_getCityTileMap().setTile(row, col, cityTile, firstTile);
						firstTile = false;
					}
				}
				_addCity(city);
			});

			if (displayInfoBox) {
				_setDisplayInfo();
			}

			//console.log("tileMap = ", _getCityTileMap());
			return _getCityArray();
		},

		getTileMap: () => {
			return _getCityTileMap();
		},

		getTileAttributes: () => {
			return new Vector2(_tileSpriteWidth, _tileSpriteHeight);
		}
	};

	function _addCity(city) {

		_cityArray.push(city);
		return _cityArray.length;
	}

	function _getCityArray() {

		return _cityArray;
	}

	function _setDisplayInfo() {

		console.log("_setDisplayInfo()...");
		_cityArray.forEach((city) => {

			let citySprite = city.tile.sprite;

			city.infoBox.position = {}
			citySprite.on("mouseover", (evt, city) => {
				city.infoBox.position = { my: "left+10 bottom-10", of: evt.nativeEvent };
				city.infoBox.openBox(/* evt.nativeEvent */);
			}, null, false, city);


			citySprite.on("mouseout", (evt, city) => {
				city.infoBox.closeBox();
			}, null, false, city);
		});
	}

	function _setCityTileMap(tileMap) {
		_cityTileMap = tileMap;
	}

	function _getCityTileMap() {
		return _cityTileMap;
	}

	function _setCitySpriteSheet(spriteSheet) {
		_citySpriteSheet = spriteSheet;
	}

	function _getCitySpriteSheet() {
		return _citySpriteSheet;
	}
});
