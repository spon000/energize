define	([
	// Libs
	"jquery",
	"jqueryui",
	"Vector2",
	"easeljs"

], function($, JQUI, Vector2, easeljs) {
	
	return(

	// Class that represents a dalog box with information.
	// The fields structure should be as follows:
	// 	{ 
	//    <tabTitle> :
	//    <tabContent> : {
	//			<field>: [
	//				<fieldNameString>,
	//				<fieldValue>
	//			],
	//		...
	//	}
	// Ex: {population: ["Population: ", "8 million"]} 
	class DialogBoxInfo {
		
		constructor(title, height, width, elementId = "dialog-box") {
			
			this._elementId = elementId;
			this._title = title;
			this._height = height;
			this._width = width;
			this._tabs = {}
			this._fields = 	{};
			this._htmlOutput = "";
			this._tableElementClass = "";
			this._closeButton = false;
			this._closeCSS = "no-close-button";
			this._confirmButtonsClass = "confirm-buttons";
			this._confirmButtonsHtml = "";
			this._confirmButtonsResponse = null;
			this._confirmButtonsData = null;
			this._position = {};

		}
		
		get title() {
			
			return this._title;
		}
		
		get fields() {
			
			return this._fields;
		}

		get closeButton() {

			return this._closeButton;
		}

		get position() {

		}
		
		set title(title) {
			
			this._title = title;
		}
		
		set fields(fields) {
			
			this._fields = fields;
		}

		set closeButton(cb) {

			this._closeButton = cb;
			if (cb) this._closeCSS = "";
			else this._closeCSS = "no-close-button";
		}

		set position(position) {

			for (let pos in position) this._position[pos] = position[pos];
		}

		set tableElelemntClass(className) {

			this._tableElementClass = className;
		}

		setConfirmButtons(responseFunction, data, msg = "Confirm?") {

			if (responseFunction) {
				this._confirmButtonsHtml = 
					"<div class='" + this._confirmButtonsClass + "'>" +
						"<h4 class='confirm-msg'>" + msg + "</h4>" +
						"<span>" + 
							"<button class='confirm-yes'>Yes</button>" +
							"<button class='confirm-no'>No</button>" +
						"</span>"
					"</div>";
			}
			else {
				this._confirmButtonsHtml = "";
			}
		}

		
		closeBox() {

			//console.log("DialogInfoBox - closeBox()...");
			$("#" + this._elementId).empty();
			$("#" + this._elementId).dialog("destroy");
		}
		
		openBox(position = {}) {

			//console.log("DialogInfoBox - openBox()... width : height" + this._width + " : " + this._height);
			$("#" + this._elementId).empty();
			$("#" + this._elementId).append(this._createHTMLFieldTable());
			if (this._confirmButtonsHtml) {
				$("#" + this._elementId).append(this._confirmButtonsHtml);
				// $("#confirm-yes").click(evt)
			}
			// $("#" + this._elementId).append(this._confirmButtons());
			//console.log("this._position = ", this._position);
			$("#" + this._elementId).dialog({
				dialogClass: this._closeCSS,
				title: this._title,
				width: this._width,
				height: this._height,
				position: this._position
			});
		}
		
		addField(fieldName) {
			
		}

		_createHTMLFieldTable() {
			
			this._htmlOutput = 
			"<table class='" + this._tableElementClass + "'>";
			for(let field in this._fields) {
				this._htmlOutput += 
				"<tr>" +
					"<td>" + this._fields[field][0] + "</td>" +
					"<td>" + this._fields[field][1] + "</td>" +
				"</tr>";				
			}
			this._htmlOutput +=
			"</table>";

			return this._htmlOutput;
		}
	});
});

