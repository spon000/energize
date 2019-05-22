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

      createFacility(facility) {

      }

      updateFacility(facility) {

      }

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