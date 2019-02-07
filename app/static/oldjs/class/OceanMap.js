define([
	// Libs
	"jquery",
	"alea",
	"simplex-noise",
	
	// Classes
	"Vector2",
	"NoiseMap"
], function($, Alea, SimpexNoise, Vector2, NoiseMap) {
	
	return(

	// Class that represents a noise map using the provided library.
	class OceanMap {
		
		constructor(vertices, width, height, edge = "left") {
			
			// if (edge = "left")
				// this.vertices = new Array(new Vector2(Math.trunc(width / 20), 0), new Vector2(Math.trunc(width / 20), height);
			// else if (edge = "right")
				// this.vertices = new Array(new Vector2(Math.trunc(width - (width / 20), 0), new Vector2(Math.trunc(width - (width / 20), height);
			// else if (edge = "top")
				// this.vertices = new Array(new Vector2(0, Math.trunc(height / 20), new Vector2(width , Math.trunc(height / 20));
			// else 
				// this.vertices = new Array(new Vector2(0, Math.trunc(height - (height / 20), new Vector2(width, Math.trunc(height - height / 20));

			// //this._vertices = vertices;
			// this._width = width;
			// this._height = height;
			// this._edge = edge;
			
			// this._noiseMap = new NoiseMap(this._width, this._height);
			// this._map = this._noiseMap.map;
			
		}
	});
});

		
		
