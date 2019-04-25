define([
], function () {
  return (
    // Class that represents a city.
    class Generator {
      constructor(args) {
        this._id = args.id || 0;
        this._id_type = args.id_type || 0;
        this._id_game = args.id_game || 0;
        this._id_facility = args.id_facility || 0;
        this._state = args.state || "build";
        this._build_turn = args.build_turn || 0;
        this._start_build_date = args.start_build_date || "012010";
        this._start_prod_date = args.start_prod_date || "092015";
      }

      setFacilityProperties(properties /* object */) {
        for (let property in properties) {
          this["_" + property] = properties[property];
        }
      }

      getFacilityProperties() {
        return ({
          "id": this._id,
          "id_type": this._id_type,
          "id_game": this._id_game,
          "id_facility": this._id_facility,
          "state": this._state,
          "build_turn": this._build_turn,
          "start_build_date": this._start_build_date,
          "start_prod_date": this._start_prod_date,
        });
      }
    });
});