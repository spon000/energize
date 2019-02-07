define([
	"jquery"
], function ($) {

	return (
		// Class that controls the UI of the editor.
		// This class requires JQuery.

		class Interface {

			constructor(parms) {
				this._canvasMap = parms.canvasMap || {};
				this._facilityController = parms.facilityController || {};
				this._cityLayer = parms.cityLayer || {};

				this._dataStructures = parms.dataStructures || {};
			}

			// Getters...
			get canvasMap() {
				return this._canvasMap;
			}

			get facilityController() {
				return this._facilityController;
			}

			get cityLayer() {
				return this._cityLayer;
			}

			get dataStructures() {
				return this._dataStructures;
			}



		});

});



