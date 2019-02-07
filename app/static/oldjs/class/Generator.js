define([
  // Libs
  "jquery",
  "FacilityDefs"
], function ($, FacilityDefs) {
  return (
    class Generator {
      constructor(generatorParms) {
        this._type = generatorParms.type || "";
        this._id = generatorParms.id || 0;
        this._capacity = generatorParms.capacity || 0;
        this._age = generatorParms.age || 0;
        this._buildDate = generatorParms.date || 0;
        this._timeToBuild = generatorParms.buildTime || 0;
        this._cost = generatorParms.cost || 0;
      }

      get id() {
        return this._id;
      }

      get type() {
        return this._type;
      }

      get capacity() {
        return this._capacity;
      }

      set capacity(capacity) {
        this._capacity = capacity;
      }
    }
  );
});
