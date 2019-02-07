define([
], function() {
	
	return( 

	// Class that represents a 2d vector.
	class Vector2 {
		
		constructor(x = 0, y = 0) {
			this._x = x;
			this._y = y;
		}

		// Getters...
		get x(){
			
			return this._x;
		}
		
		get y(){
			return this._y;
		}
		
		// Setters...
		set x(x) {
			this._x = x;
		}
		
		set y(y) {
			this._y = y;
		}
		
		// Methods...
		getSlope(v2) {
			if ((this._x - v2.x) == 0) 
				return NaN;
			else 
				return (this._y - v2.y) / (this._x - v2.x);
		}	
		
		getBorderIntersect(v2, width, height, truncate = false) {
			
			var xBorder = 0, yBorder = 0;
			var slope = this.getSlope(v2);
			
			if(this._x > v2.x) 
				xBorder = width;
			if(this._y > v2.y)
				yBorder = height;
			
			if(slope == NaN) {
				return new Vector2(this._x, yBorder);
			}
			else if(slope == 0) {
				return new Vector2(xBorder, this._y);
			} 
			else {
				// Get y-coordinate of line new vertice.
				var y2 = -(slope * (this._x - xBorder) - this._y);
				var x2 = -(((this._y - yBorder) / slope) - this._x); 
				if ((y2 < 0) || (y2 > this._height)) {
					if (truncate) x2 = Math.trunc(x2);
					return new Vector2(x2, yBorder);
				}
				else {
					if (truncate) y2 = Math.trunc(y2);
					return new Vector2(xBorder, y2);
				}
			}			
		}		

	});
});