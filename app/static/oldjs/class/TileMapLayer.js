define([
	// Libs
	"jquery",
	"TileMap",
	"Tile",
	"easeljs"
], function ($, TileMap, Tile, createjs) {
	return (
		// Class that represents a tilemap Layer
		class TileMapLayer {
			constructor(parms = {}) {
				this._spriteWidth = parms.spriteWidth || 0;
				this._spriteHeight = parms.spriteHeight || 0;
				this._tileWidth = parms.tileWidth || 0;
				this._tileHeight = parms.tileHeight || 0;
				this._tileRows = parms.tileRows || 0;
				this._tileCols = parms.tileCols || 0;
				this._tileMapVisible = parms.visible || false;
				this._scaleToMap = parms.scaleToMap || false;
				this._spriteTemplateImage = parms.spriteTemplateImage || null;
				this._spriteSheet = parms.spriteSheet || null;
				this._tileMap = null;

				this.createTileMap(this._spriteTemplateImage);
			}

			// Getters
			get spriteWidth() {
				return this._spriteWidth;
			}

			get spriteHeight() {
				return this._spriteHeight;
			}

			get tileWidth() {
				return this._tileWidth;
			}

			get tileHeight() {
				return this._tileHeight;
			}

			get tileMap() {
				return this._tileMap;
			}

			get tileRows() {
				return this._tileRows;
			}

			get tileCols() {
				return this._tileCols;
			}

			get visible() {
				return this.tileMapVisible;
			}

			// Setters
			set spriteWidth(spriteWidth) {
				this._spriteWidth = spriteWidth;
			}

			set spriteHeight(spriteHeight) {
				this._spriteHeight = spriteHeight;
			}

			set tileWidth(tileWidth) {
				this._tileWidth = tileWidth;
			}

			set tileHeight(tileHeight) {
				this._tileHeight = tileHeight;
			}

			set tileRows(tileRows) {
				this._tileRows = tileRows;
			}

			set tileCols(tileCols) {
				this._tileCols = tileCols;
			}

			set visible(visible) {
				this._tileMapVisible = visible;
				this._tileMap.container.visible = visible;
			}

			// Methods ...
			// createTileMap - creates a tilemap
			createTileMap(spriteTemplateImage) {
				if (spriteTemplateImage) {
					this._spriteTemplateImage = spriteTemplateImage;
					this._spriteSheet = new createjs.SpriteSheet({
						images: [this._spriteTemplateImage],
						frames: { width: this._spriteWidth, height: this._spriteHeight, regX: 0, regY: 0 }
					});
				}

				if (this._spriteSheet) {
					this._tileMap = new TileMap(this._tileRows, this._tileCols, this._tileWidth, this._tileHeight);
				}
			}

			createTile(tileName, spriteIndex) {
				const sprite = new createjs.Sprite(this._spriteSheet, spriteIndex);
				return (new Tile(tileName, this._spriteWidth, this._spriteHeight, sprite, this._scaleToMap));
			}

			addTileToMap(x, y, tile = null) {
				this._tileMap.setTile(x, y, tile);
			}

			// End Class
		}
	);
});



