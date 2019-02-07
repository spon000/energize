define	([
	// Libs
	"jquery",
	"jqueryui",
	"Vector2",
	"easeljs"

], function($, jui, Vector2, easeljs) {
	
	return(

	// Class that represents a model info box on the canvas.
	class ModalSelectBox {
		
		constructor(title, width, height, elementId = "dialog-box") {
			
			this._elementId = elementId;
			this._title = title;
			this._selectableRows = 	[];
			this._height = height;
			this._width = width;
			
			this._htmlOutput = "";
			this._tableElementClass = "";
		}
		
		get title() {
			
			return this._title;
		}
		get fields() {
			
			return this._fields;
		}
		
		get elementId() {
			
			return this._elementId;
		}

		get rows() {

			return this._selectableRows;
		}

		get tableElementClass() {

			return this._tableElementClass;
		}
		
		set elementId(elementId) {
			
			this._elementId = elementId;
		}

		set title(title) {
			
			this._title = title;
		}	
		
		set rows(rows) {

			this._selectableRows = rows;
		}

		set tableElementClass(className) {

			this._tableElementClass = className;
		}
		
		closeBox() {
			
			console.log("DialogSelectBox - closeBox()..." + this._elementId);

			//$("#" + this._elementId).css("display", "none");
			$("#" + this._elementId).empty();
			$("#" + this._elementId).dialog("destroy");
		}
		
		openBox(responseFunction, data) {
			
			console.log("DialogSelectBox - openBox()...");
			$("#" + this._elementId).empty();
			$("#" + this._elementId).append(this._createHTMLTableOutput());
			$("#" + this._elementId).dialog({
				title: this._title,
				width: this._width,
				height: this._height,
				modal: true,
				close: (evt, ui) => {
					this.closeBox();
					responseFunction(null, data);
				}
			});	

			$("#" + this._elementId + " tr").click((evt) => {
				console.log("testing select... ", evt);
				this.closeBox();
				responseFunction(evt, data);
			});
		}		
		
		_createHTMLTableOutput() {
			
			let index = 0;
			let className = this._tableElementClass + " no-text-highlight";

			this._htmlOutput =
			"<table class='" + className + "' id='select-box-table'>";
			this._selectableRows.forEach((row) => {
				this._htmlOutput +=
				"<tr>" +
					"<td fieldvalue='" + index++ + "'>" + row + "</td>" +
				"</tr>";
			});
			this._htmlOutput += 
			"</table>";
				
			return this._htmlOutput ;
		}
	});
});