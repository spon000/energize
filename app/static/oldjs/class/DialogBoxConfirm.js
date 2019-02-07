define	([
	// Libs
	"jquery",
	"Vector2",
	"easeljs"

], function($, Vector2, easeljs) {
	
	return(

	// Class that represents a model info box on the canvas.
	class ModalConfirmBox {
		
		constructor(title, elementClass = "modal-confirm-class", elementId = "") {
			
			this._elementId = elementId;
			this._title = title;
			this._fields = 	{};
			this._visible = false;
			this._elementClass = elementClass;
			this._htmlOutput = "";
		}
	});
});