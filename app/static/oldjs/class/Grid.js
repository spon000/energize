define([
	"jquery",
	"Vector2",
	"GridSquare",
	"easeljs"

], function($, Vector2, GridSquare) {
	
	return(

	// Class that represents a grid on a bitmap. Uses easeljs.
	class Grid {
		constructor(blockSizeX, blockSizeY, width, height, color, fillColor = null) {
			
			this. _blockSizeX = blockSizeX;
			this. _blockSizeY = blockSizeY;
			
			// Set width and height to number divisible by block size.
			this._width = width - (width % blockSizeX);
			this._height = height - (height % blockSizeY);
			this._color = color;
			this._fillColor = fillColor;
			
			this._gridWidth = this._width / blockSizeX;	
			this._gridHeight = this._height / blockSizeY;
			this._gridArray = new Array();
			
			this._gridContainer = new createjs.Container()
			this._setup();
		}
				
		// Getters...
		get container() {
			
			return this._gridContainer;
		}
		
		// Methods...
		
		getGridPoint(x, y) {
			
			let gx = (x - (x % this._blockSizeX)) / this._blockSizeX;
			let gy = (y - (y % this._blockSizeY)) / this._blockSizeY;
			return new Vector2(gx, gy);
		}
		
		getGridSquare(x, y) {
			
			let gridPoint = this.getGridPoint(x, y);
			console.log("gridPoint = ", gridPoint);
			let gridIndex = this._getGridIndex(gridPoint.x, gridPoint.y)
			return this._gridArray[gridIndex];
		}

		visible(visible = true) {
			
			this._gridContainer.visible = visible; 
		}
		
		addTiles(tiles, tileFunction){
		}
		
		_setup() {
			
			for (let y = 0; y < this._gridHeight; y++) {
				for (let x = 0; x < this._gridWidth; x++) {
					let gs = new GridSquare(this._blockSizeX, this._blockSizeY, 1, this._color);
					gs.setCoordinates(x * this._blockSizeX, y * this._blockSizeY);
					this._gridArray.push(gs);
					this._gridContainer.addChild(gs.square);
				}
			}
		}	
		
		_getGridIndex(x, y) {
			
			return y * this._gridWidth + x;
		}
		
	});
});
	