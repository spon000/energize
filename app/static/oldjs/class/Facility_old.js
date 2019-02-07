define([
	// Libs
	"jquery",
	"FacilityDefs",
	"Generator"

], function ($, FacilityDefs, Generator) {

	return (
		// Class that represents a facility.
		class Facility {
			constructor(facilityParms, tile = null) {
				this._name = facilityParms.name || "";
				this._id = facilityParms.id || 0;
				this._planningDate = facilityParms.date || 0;

				this._facilityDefIndex = facilityParms.facilityDefIndex || 0;
				this._facilityDef = FacilityDefs.facilityTypes[this._facilityDefIndex];
				this._generatorTypeIndex = facilityParms.generatorTypeIndex || 0;
				this._generatorDef = this._facilityDef.generatorTypes[this._generatorTypeIndex];

				this._timeToBuild = facilityParms.buildTime || this._facilityDef.buildTime;
				this._totalCost = facilityParms.totalCost || this._facilityDef.totalCost

				this._generators = facilityParms.genList || [];

				this._STATUS = {
					PLANNED: 0,
					BUILDING: 1,
					BUILDING_PAUSED: 2,
					WORKING: 3,
					WORKING_MAINTENANCE: 4,
					DECOMISSIONED: 5,
				};
				this._status = facilityParms.status || this._STATUS.PLANNED;
				this._tile = tile;

				console.log("Facility = ", this);
			}

			get name() {
				return this._name;
			}

			get id() {
				return this._id;
			}

			get type() {
				return this._type;
			}

			get totalCapacity() {
				return this._totalCapacity;
			}

			get availableCapacity() {
				return this._availableCapacity;
			}

			get totalCost() {
				return this._totalCost;
			}

			get generators() {
				return this._generators;
			}

			get facilityBuilt() {
				return this._facilityBuilt;
			}

			get tile() {

				return this._tile;
			}

			get infoBox() {

				return this._infoBox;
			}

			// get selected() {
			// 	return this._selected;
			// }

			set name(name) {
				this._name = name;
			}

			set company(company) {
				this._company = company;
			}

			set player(player) {
				this._player = player;
			}

			set id(id) {
				this._id = id;
			}

			set type(type) {
				this._type = type;
			}

			set totalCapacity(totalCapacity) {
				this._totalCapacity = totalCapacity;
			}

			set totalCost(totalCost) {
				this._totalCost = totalCost;
			}

			set tile(tile) {

				this._tile = tile;
			}

			set facilityBuilt(built) {
				this._facilityBuilt = built;
			}

			// set infoBox(infoBox) {

			// 	this._infoBox = infoBox;
			// }

			// set selected(selected) {

			// 	this._selected = selected;
			// }

			addGenerator(generatorDef) {
				let generator = new Generator(generatorDef);
				this._generators.push(generator);
			}

			removeGenerator(generatorId) {
				this._generators.forEach((generator, index) => {
					if (generator.id === generatorId) {
						this._generators.splice(index, 1);
					}
				});
			}

			// _numberWithCommas(num) {
			// 	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			// }
		}
	);
});


