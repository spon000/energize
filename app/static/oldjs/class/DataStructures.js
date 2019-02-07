define([
  // Libs
  "jquery"

], function ($) {

  return (

    // Class that represents a city.
    class DataStructures {
      constructor(parms = {}) {
        this._gameData = parms.gameData || [];
        this._playerCompany = parms.playerCompany || [];
        this._cities = parms.cities || [];
        this._facilities = parms.facilities || [];
        this._generators = parms.generators || [];

        this._facilityTypes = parms._facilityTypes || [];
        this._generatorTypes = parms._generatorTypes || [];
        this._powerTypes = parms._powerTypes || [];
        this._resourceTypes = parms._resourceTypes || [];
      }

      // Getters...
      get gameData() {
        return this._gameData;
      }

      get playerCompany() {
        return this._playerCompany;
      }

      get cities() {
        return this._cities;
      }

      get facilities() {
        return this._facilities;
      }

      get generators() {
        return this._generators;
      }

      get facilityTypes() {
        return this.facilityTypes;
      }

      get generatorTypes() {
        return this.generatorTypes;
      }

      get powerTypes() {
        return this.powerTypes;
      }

      get resourceTypes() {
        return this.resourceTypes;
      }

      // Setters...
      set gameData(gameData) {
        this._gameData = gameData;
      }

      set playerCompany(playerCompany) {
        this._playerCompany = playerCompany;
      }

      set cities(cities) {
        this._cities = cities;
      }

      set facilities(facilities) {
        this._facilities = facilities;
      }

      set generators(generators) {
        this._generators = generators;
      }

      set facilityTypes(facilityTypes) {
        this._facilityTypes = facilityTypes;
      }

      set generatorTypes(generatorTypes) {
        this._generatorTypes = generatorTypes;
      }

      set powerTypes(powerTypes) {
        this._powerTypes = powerTypes;
      }

      set resourceTypes(resourceTypes) {
        this._resourceTypes = resourceTypes;
      }

    });
});

