define([
	// Libs
	"jquery",
	
	// Classes
], function($) {
	
	return(
	
	class {
		
		constructor(width, height) {
			
			this._width = width;
			this._height = height;
			this._map = new Array();
			
			for(let y = 0;y < height; y++) {
				this._map.push(new Array)
				for(let x = 0;x < width; x++ ) {
					this._map[y].push(0);
				}
			}
		}
		
		// Getters...
		get map() {
			
			return this._map;
		}

		// Setters...
		set mapValue(parmsObject) {
			
			this._map[parmsObject.y][parmsObject.y] = parmsObject.value;
		}
		
		// Methods...
		getMapValue(x, y) {
			
			return this._map[y][x];
		}
		
		clear() {
			
			for(let y = 0; y < this._width; y++) {
				for(let X = 0;x < width; x++ ) {
					this._map[y][x] = 0;
				}
			}
		}
		
		applyMaps(parmsObject) {
		}
	});
});