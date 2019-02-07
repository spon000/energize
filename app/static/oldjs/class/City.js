define([
	// Libs
	"jquery",
	"Vector2",
	"DialogBoxInfo",
	"easeljs",

], function ($, Vector2, DialogInfoBox, easeljs) {

	return (

		// Class that represents a city.
		class City {

			constructor(name, population, mw, tile = null) {

				this._name = name;
				this._tile = tile;
				this._infoBox = new DialogInfoBox("City - " + this._name, 120, 320);
				this._population = population;
				this._consumeMW = mw;

				//console.log("Pop : MW = " + population + " : " + mw);

				if (this._population < 1) {
					this._population = this._numberWithCommas(this._population * 1000000);
				}
				else {
					this._population = this._population + " million";
				}

				this._consumeMW = (mw + " MW");
				//console.log("Pop : MW = " + this._population + " : " + this._consumeMW);
				//this._infoBox.setConfirmButtons((evt, data) => {}, this);
				this._infoBox.fields = {
					"population": ["Population: ", this._population],
					"consumeMW": ["Consumes: ", this._consumeMW]
				};
			}

			get tile() {

				return this._tile;
			}

			get infoBox() {

				return this._infoBox;
			}

			set tile(tile) {

				this._tile = tile;
			}

			_numberWithCommas(num) {

				return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		});
});