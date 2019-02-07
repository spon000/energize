define([
	"jquery",
	"Vector2",
	"easeljs",
	"TileMap",
	"Tile"

], function($, Vector2, Easeljs, TileMap, Tile) {
	
	let _tileSpriteWidth = 25;
	let _tileSpriteHeight = 25;
	let _tileSprite = null;
	let _overlayTiles = {};
	
	return {
		
		init: (canvasMapStage) => {
			
			let width = _tileSpriteWidth;
			let height = _tileSpriteHeight;
			
			if (canvasMapStage._tileMaps[0]) {
				width = canvasMapStage._tileMaps[0].width;
				height = canvasMapStage._tileMaps[0].height;
			}
			
			let indicatorGood = new createjs.Shape();
			indicatorGood.graphics.beginFill("rgba(240, 240, 240, 0.4");
			indicatorGood.graphics.drawRect(0, 0, width, height);
			indicatorGood.visible = false;
			
			let indicatorBad = new createjs.Shape();
			indicatorBad.graphics.beginFill("rgba(240, 0, 0, 0.4");
			indicatorBad.graphics.drawRect(0, 0, width, height);
			indicatorBad.visible = false;
			
			//console.log("_overlayTiles = ", _getOverlayTile());
			_setOverlayTile("goodSpot", new Tile("indicatorG", _tileSpriteHeight, _tileSpriteHeight, indicatorGood));
			_setOverlayTile("badSpot", new Tile("indicatorB", _tileSpriteHeight, _tileSpriteHeight, indicatorBad));
			canvasMapStage.stage.addChild(indicatorGood);
			canvasMapStage.stage.addChild(indicatorBad);
		},
		
		showIndicator: (propertyName = null, visible = false) => {
			
			if (propertyName)
				_getOverlayTile(propertyName).sprite.visible = visible;
			else {
				for (let tile in _getOverlayTile()) {
					_getOverlayTile()["" + tile].sprite.visible = visible
				}
			}
		},
		
		moveIndicator: (x, y, canvasMapStage, selectable = true) => {
			
			let tileMap = canvasMapStage._tileMaps[0];
			let indicatorTile = null;
			let scaleX = 1;
			let scaleY = 1;
			let width = _tileSpriteWidth * scaleX;
			let height = _tileSpriteHeight * scaleY;
			
			if (selectable) {
				indicatorTile = _getOverlayTile("goodSpot");
			}
			else {
				indicatorTile = _getOverlayTile("badSpot");
			}
			
			//console.log("indicatorTile = ", indicatorTile);
			//canvasMapStage.stage.setChildIndex(indicatorTile)
				
			if (tileMap) {
				scaleX = tileMap.scaleX;
				scaleY = tileMap.scaleY;
				width = tileMap._width * tileMap.scaleX;
				height = tileMap._height * tileMap.scaleY;
			}
			
			//console.log("width : height = " + width + " : " + height);
			let newX = Math.floor(x / width) * width;
			let newY = Math.floor(y / height) * height;
			
			//console.log("newX : newY = " + newX + " : " + newY);
			indicatorTile.sprite.x = newX;
			indicatorTile.sprite.y = newY;
			indicatorTile.sprite.scaleX = scaleX;
			indicatorTile.sprite.scaleY = scaleY;
		}
	};
	
	function _setOverlayTile(propertyName, tile) {
		
		_overlayTiles[propertyName] = tile;
	}
	
	function _getOverlayTile(propertyName = null) {
		
		if (propertyName)
			return _overlayTiles[propertyName];
		else 
			return _overlayTiles;
	}
	
	function _setPrevTileXY(prevTileXY) {
		
		_prevTileXY = prevTileXY;
	}
	
	function _getPrevTileXY() {
		
		return _prevTileXY;
	}
	
});

