define([
], function () {
  return (
    // Class that represents a city.
    class Facility {
      constructor(args) {
        this._id = args.id || 0;
        this._id_type = args.id_type || 0;
        this._id_game = args.id_game || 0;
        this._id_company = args.id_company || 0;
        this._name = args.name;
        this._state = args.state || "build";
        this._player_number = args.player_number || 0;
        this._build_turn = args.build_turn || 0;
        this._start_build_date = args.start_build_date || "012010";
        this._start_prod_date = args.start_prod_date || "092015";
        this._column = args.column || 0;
        this._row = args.row || 0;
        this._layer = args.layer || 2;
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
          "id_company": this._id_company,
          "name": this._id_name,
          "state": this._state,
          "player_number": this._player_number,
          "build_turn": this._build_turn,
          "start_build_date": this._start_build_date,
          "start_prod_date": this._start_prod_date,
          "column": this._column,
          "row": this._row,
          "layer": this._layer
        });
      }
    });
});