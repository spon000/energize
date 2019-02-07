define([
	// Libs
], function () {
	return (

		// Class that represents a square on the grid.
		class Tile {
			constructor(name, width, height, sprite = null, scaleToMap = true) {
				this._name = name;
				this._sprite = sprite;
				this._width = width;
				this._height = height;
				this._originX = 0;
				this._originY = 0;
				this._scaleX = 1;
				this._scaleY = 1;
				this._scaleToMap = scaleToMap;
				this._tileMap = null;
				this._data = null;

				if (this._sprite) this._sprite.tickEnabled = false;
			}

			// Getters...
			get name() {

				return this._name;
			}

			get sprite() {

				return this._sprite;
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

			get tileMap() {

				return this._tileMap;
			}

			get data() {

				return this._data;
			}

			// Setters...
			set name(name) {

				this._name = name;
			}

			set sprite(sprite) {

				this._sprite = sprite;
				this._sprite.tickEnabled = false;
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
			}

			set scaleY(scaleY) {

				this._scaleY = scaleY;
				this._sprite.scaleY = scaleY;
			}

			set scaleToMap(scaleToMap) {

				this._scaleToMap = scaleToMap;
			}

			set tileMap(tileMap) {

				this._tileMap = tileMap;
			}

			set data(data) {

				this._data = data;
			}

			// Methods
			setScale(scaleX, scaleY) {
				this._scaleX = scaleX;
				this._scaleY = scaleY;
				this._sprite.scaleX = scaleX;
				this._sprite.scaleY = scaleY;
				this._width = this._width * scaleX;
				this._height = this._height * scaleY;
			}
		});
});