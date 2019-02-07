define([
	"jquery",
	"Vector2",
	"easeljs",
	"TileMap",
	"Tile",
	"Facility"
	//	"ModalSelectBox"

], function ($, Vector2, Easeljs, TileMap, Tile, Facility, /* ModalSelectBox */) {

	let _tileSpriteWidth = 50;
	let _tileSpriteHeight = 50;
	let _tileMapWidth = 25;
	let _tileMapHeight = 25;
	let _facilityTileMap = null;
	let _facilitySpriteSheet = null;
	let _facilityDefs = null;
	let _facilityArray = [];

	let FL = {

		init: (facilityImage, facilityInfoObject) => {
			console.log("FacilityLayer.init()...");

			_setFacilitySpriteSheet(new createjs.SpriteSheet({
				images: [facilityImage],
				frames: { width: _tileSpriteWidth, height: _tileSpriteHeight, regX: 0, regY: 0 }
			}));

			_setFacilityTileMap(new TileMap(120, 240, _tileMapWidth, _tileMapHeight));
			_setFacilityDefs(facilityInfoObject);

			//console.log("FacilityDefs = ", _getFacilityDefs());

			return _getFacilityTileMap();
		},

		createFacility: (x, y) => {

			let facilityTileMethod = _getCreateTileMethod();
			let facilityTile = facilityTileMethod(x, y);

			//selectPredefinedFacility(facilityTile);

		},

		createFacilityTile: (x, y, index = 8) => {

			let tileXY = _getFacilityTileMap().getPoint(x, y);
			//console.log("Facility Layer - column : row = " + tileXY.x + " : " + tileXY.y);
			let facilityTileSprite = new createjs.Sprite(_getFacilitySpriteSheet(), index);
			let facilityTile = new Tile("facility", _tileSpriteHeight, _tileSpriteHeight, facilityTileSprite)
			let numX = _tileSpriteWidth / _tileMapWidth;
			let numY = _tileSpriteHeight / _tileMapHeight;

			facilityTile.scaleX = facilityTile.scaleY = 1;
			_getFacilityTileMap().setTile(tileXY.y, tileXY.x, facilityTile);
			for (let row = tileXY.y + 1; row < tileXY.y + numY; row++) {
				for (let col = tileXY.x + 1; col < tileXY.x + numX; col++) {
					_getFacilityTileMap().setTile(row, col, facilityTile, false);
				}
			}

			return facilityTile;
		},

		removeFacility: (x, y) => {

			let tileXY = _getFacilityTileMap().getPoint(x, y);
			_getFacilityTileMap().setTile(tileXY.y, tileXY.x, null);
		},

		getTileMap: () => {

			return _getFacilityTileMap();
		},

		getTileAttributes: () => {

			return new Vector2(_tileSpriteWidth, _tileSpriteHeight);
		}
	};

	function selectPredefinedFacility(tile) {

		//let selectBox = new ModalSelectBox("Predefined Facilities");

		selectBox.elementId = "select-box-div";
		_facilityDefs.facilities.forEach((facility) => {
			let field =
				"FT: " + facility.facilityType +
				"\tGT: " + facility.generator.generatorType +
				"\tC/G: " + facility.generator.capacity +
				"\tTC: " + facility.generator.capacity * facility.numGenerators;

			selectBox.addField(field);
		});

		selectBox.showBox((element, fl) => {

			let fieldIndex = element.getAttribute("fieldValue");
			console.log("facilityDefs = ", _facilityDefs[fieldIndex]);
			// let facility = new Facility(



		}, FL);

	}

	function _getCreateTileMethod() {

		return FL.createFacilityTile;
	}

	function _getFacilityDefs() {

		return _facilityDefs;
	}

	function _setFacilityDefs(fDefs) {

		_facilityDefs = fDefs;
	}

	function _setFacilityTileMap(tileMap) {
		_facilityTileMap = tileMap;
	}

	function _getFacilityTileMap() {
		return _facilityTileMap;
	}

	function _setFacilitySpriteSheet(spriteSheet) {
		_facilitySpriteSheet = spriteSheet;
	}

	function _getFacilitySpriteSheet() {
		return _facilitySpriteSheet;
	}

	return FL;

});

