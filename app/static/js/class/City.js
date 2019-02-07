define([
], function () {
	return (
		// Class that represents a city.
		class City {
			constructor(id, name, population, watts, tile = null) {
				this._id = id;
				this._watts = watts;
				this._name = name;
				this._population = population;
				this._tile = tile;
			}

			// Getters...
			get id() {
				return this._id;
			}

			// Assumes value is in kilowatts.
			get name() {
				return this._name;
			}

			get population() {
				return this._population;
			}

			get stringPopulation() {
				let pop = (this._population / 1000000).toFixed(1);
				return (pop < 1 ? this._numberWithCommas(this._population) + "" : pop + " Million")
			}

			get stringWatts() {
				let watt = (this._watts / 1000).toFixed(1);
				return (watt < 1 ? this_numberWithCommas(this._watts) + "KW" : watt + "MW");
			}

			get tile() {
				return this._tile;
			}

			get watts() {
				return this._watts
			}

			// Setters... 
			set tile(tile) {
				this._tile = tile;
			}

			// Private methods
			_numberWithCommas(num) {
				return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		});
});