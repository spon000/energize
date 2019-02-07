define([
	"jquery",
	"Vector2",
	"easeljs"

], function ($, Vector2, Easeljs) {

	return (
		// This class requires JQuery.

		class Layer {

			constructor(width, height) {
				this._width = width;
				this._height = height;
				this._originX = 0;
				this._originY = 0;
				this._container = null;
			}

			// Getters...
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

			get container() {
				return this._container;
			}

			// Setters...
			set container(container) {
				this._container = container;
			}

			// Methods...

		});
});
