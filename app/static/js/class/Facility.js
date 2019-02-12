define([
], function () {
  return (
    // Class that represents a city.
    class Facility {
      constructor(id, facility_type, id_company, name, state, player_number, build_turn, start_build_date, start_prod_date, area, tile = null) {
        this._id = id;
        this._facility_type = facility_type;
        this._id_company = id_company;
        this._name = name;
        this._state = state;
        this._player_number = player_number;
        this._build_turn = build_turn;
        this._start_build_date = start_build_date;
        this._start_prod_date = start_prod_date;
        this._tile = tile;
      }
    });
});