define	([
	// Libs
	"jquery",
	"jqueryui"

], function($, JQUI) {
	
	return(

	class Field {

    constructor(name, title, value, editable = false) {

      this._name = name;
      this._title = title;
      this._value = value;
      this._editable = editable;
    }

    get name() {

      return this._name;
    }

    get title() {

      return this._title;
    }

    get value() {

      return this._value;
    }

    set title(title) {
      
      this._title = title;
    }

    set value(value) {

      this._value = value;
    }

    formatValue(type) {

    }

    htmlOutput() {

      let htmlOutput = 
        "<tr>" +
          "<td>" + this._title + "</td>" +
          "<td>" + this._value + "</td>" +
        "</tr>";				
    }
  });
});
