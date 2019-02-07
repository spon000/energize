define([
	// Libs
	"jquery",

], function ($, FacilityDefs, Generator) {

	return (
		// Class that represents a facility.
		class Facility {
			constructor(id, tile = null, company = null) {
				this._id = id;
				this._tile = tile;
				this._company = company;
			}

			get id() {
				return this._id;
			}

			get tile() {
				return this._tile;
			}

			get company() {
				return this._company;
			}

			set tile(tile) {
				this._tile = tile;
			}

			set company(company) {
				this._company = company;
			}
		}
	);
});


