define([
  "jquery",
  "EventEmitter",
  "ResourceLoader",
  "networkCallMap",
  "ModelData"
], function ($, EventEmitter, ResourceLoader, networkCallMap) {

  return (
    class CanvasModel extends EventEmitter {
      constructor() {
        super()
      }


      /////////////////////////////////////////////////////////////////////
      // Add records to the database
      addFacility(col, row) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.addFacility.path + "row=" + row + "&col=" + col)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      createGenerator(generator) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerFacility.path + "fid=" + facilityId)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      /////////////////////////////////////////////////////////////////////
      // Update records in the database
      updateFacilityType(fid, type) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.updateFacilityType.path + "fid=" + fid + "&type=" + type)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });

      }



      /////////////////////////////////////////////////////////////////////
      // Get records from the database

      getPlayerFacility(facilityId = 0) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerFacility.path + "fid=" + facilityId)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getPlayerFacilities() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerFacilities.path)
          loaded.then((results) => {
            console.log("resultes = ", results);
            resolve(results)
          });
        });
      }


      getGenerators(facility) {

      }

      getFacilityTypes(facilityTypes = null) {

      }

      getCities(cities = null) {

      }

    });
});