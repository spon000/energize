define([
	// Libs
], function () {
	return (

		// Class that represents a square on the grid.
		class Tile {
			constructor(id, name, width, height, sprite = null, scaleToMap = true) {
				this._name = name;
				this._id = id;
				this._sprite = sprite;
				this._bitmap = null;
				this._width = width;
				this._height = height;
				this._originX = 0;
				this._originY = 0;
				this._scaleX = 1;
				this._scaleY = 1;
				this._scaleToMap = scaleToMap;
				if (this._sprite) this._sprite.tickEnabled = false;
			}

			// Getters...
			get name() {
				return this._name;
			}

			get id() {
				return this._id;
			}

			get sprite() {
				return this._sprite;
			}

			get bitmap() {
				return this._bitmap;
			}

			get width() {
				return this._width;
			}

			get height() {
				return this._height;
			}

			get originX() {
				return this._originX;
			}

			get originY() {
				return this._originY;
			}

			get scaleX() {
				return this._scaleX;
			}

			get scaleY() {
				return this._scaleY;
			}

			get scaleToMap() {
				return this._scaleToMap;
			}

			// Setters...
			set name(name) {
				this._name = name;
			}

			set sprite(sprite) {
				this._sprite = sprite;
				this._sprite.tickEnabled = false;
			}

			set bitmap(bitmap) {
				this._bitmap = bitmap;
			}

			set width(width) {
				this._width = width;
			}

			set height(height) {
				this._height = height;
			}

			set originX(originX) {
				this._originX = originX;
			}

			set originY(originY) {
				this._originY = originY;
			}

			set scaleX(scaleX) {
				this._scaleX = scaleX;
				this._sprite.scaleX = scaleX;
				if (this._bitmap) this._bitmap.scaleX = scaleX;
			}

			set scaleY(scaleY) {
				this._scaleY = scaleY;
				this._sprite.scaleY = scaleY;
				if (this._bitmap) this._bitmap.scaleY = scaleY;
			}

			set scaleToMap(scaleToMap) {
				this._scaleToMap = scaleToMap;
			}

			// Methods
			setScale(scaleX, scaleY) {
				this._scaleX = scaleX;
				this._scaleY = scaleY;
				this._sprite.scaleX = scaleX;
				this._sprite.scaleY = scaleY;
				if (this._bitmap) {
					this._bitmap.scaleX = scaleX;
					this._bitmap.scaleY = scaleY;
				}
				this._width = this._width * scaleX;
				this._height = this._height * scaleY;
			}
		});
});