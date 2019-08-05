define([
  "jquery",
  "networkCallMap",
], function ($, networkCallMap) {

  return (
    class ModelData {
      constructor() {
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

      addGenerator(generator) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerFacility.path + "fid=" + facilityId)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      addGenerators(generators) {

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
      // Delete records in the database
      deleteFacility(fid) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.deleteFacility.path + "fid=" + fid)
          loaded.then((results) => {
            console.log("resultes = ", results);
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
            console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getPlayerFacilities() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerFacilities.path)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getGenerators(facility) {

      }

      getFacilityTypes() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.facilityTypes.path)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getCities(cities = null) {

      }

      getCompany() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerCompany.path)
          loaded.then((results) => {
            console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getCurrentDate() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.currentDate.path)
          loaded.then((results) => {
            console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

    });
});