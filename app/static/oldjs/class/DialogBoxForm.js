define	([
	// Libs
	"jquery",
	"Vector2",
	"easeljs"

], function($, Vector2, easeljs) {
	
	return(

	// Class that represents a model form box on the canvas.
	class ModelFormBox {
		
		constructor(title, elementId = "") {
			
			this._elementId = elementId;
			this._title = title;
			this._fields = 	{};
			this._elementClass = elementClass;
			this._htmlOutput = "";
		}
		
		get title() {
			
			return this._title;
		}
		
		set title(title) {
			
			this._title = title;
		}
		
		hideForm() {
			
		}
		
		showForm() {
			
		}
		
		addField(fieldName, type, format) {
			
		}
		
		addFields(fieldArray) {
			
		}
		
		setField (fieldName, fieldValue) {
			
		}
		
		createHTMLOutput() {
			this._htmlOutput = "<div>" +
				"<h4>" + this._title + "</h4> <hr/> <br/>";
			// for(let field in this._fields) {
			// 	this._htmlOutput += "<span>";
			// 	this._htmlOutput += "<label>" + field.name + ":</label>";
			// 	this._htmlOutput += "<lable>" + field.fieldValue + ""
			// 	this._htmlOutput += "</span> <br/>";
			// });
			this._htmlOutput += "</div>"
		}
	});
});
