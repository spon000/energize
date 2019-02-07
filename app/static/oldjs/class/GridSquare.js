define([
	// Libs
	"jquery",
	"Vector2",
	"easeljs"

], function($, Vector2) {
	
	return(

	// Class that represents a square on the grid.
	class GridSquare {
		
		constructor(width, height, lineWidth, color, fillColor = null) {
			
			this._origin = new Vector2(0, 0);
			this._width = width;
			this._height = height;
			this._color = color;  
			this._fillColor = fillColor;
			
			this._square = new createjs.Shape();
			this._square.graphics.setStrokeStyle(lineWidth);
			
			this._square.graphics.beginStroke(this._toRGBAString(color));
			this._square.graphics.beginFill(this._toRGBAString(fillColor));
			
			this._square.graphics.drawRect(0, 0, width, height);
		}
		
		// Getters...
		
		
		// Methods...
		setCoordinates(x, y){
			this._square.x = x;
			this._square.y = y;
		}
		
		addTile(tile) {
			
		}
		
		_toRGBAString(hexColorString) {
			
			if (!hexColorString) return null;
			
			// Assume the RGB hex string format is "#????????" last number is alpha
			return "rgba(" + parseInt("0x"+hexColorString.slice(1,3)) +
								"," + parseInt("0x"+hexColorString.slice(3,5)) +
								"," + parseInt("0x"+hexColorString.slice(5,7)) +
								"," + (parseInt("0x"+hexColorString.slice(7,9)) / 255).toFixed(2) + ")";
		}		
	});
});
