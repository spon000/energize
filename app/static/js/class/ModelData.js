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
            // console.log("results = ", results);
            resolve(results)
          });
        });
      }

      addGenerators(fid, fTypeId, generators = []) {
        return new Promise(resolve => {
          if (!generators.length)
            generators.push({ state: "new" })

          let serializedGenerators = JSON.stringify(generators);

          const loaded = $.get(networkCallMap.addGenerators.path + "fid=" + fid + "&ftid=" + fTypeId + "&gens=" + serializedGenerators);
          loaded.then((results) => {
            // console.log("addGenerators results = ", results);
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
            // console.log("results = ", results);
            resolve(results)
          });
        });
      }

      updateFacility(fid, facility) {
        return new Promise(resolve => {
          let serializedFacility = encodeURIComponent(JSON.stringify(facility));

          console.log("serializedFacility = ", serializedFacility);
          const loaded = $.get(networkCallMap.updateFacility.path + "fid=" + fid + "&facility=" + serializedFacility);

          loaded.then((results) => {
            // console.log("updateFacilityType results = ", results);
            resolve(results)
          });
        });
      }

      updateGenerators(fid, generators) {
        return new Promise(resolve => {
          let serializedGenerators = JSON.stringify(generators)
          const loaded = $.get(networkCallMap.updateGenerators.path + "fid=" + fid + "&gens=" + serializedGenerators)

          loaded.then((results) => {
            // console.log("updateGenerators results = ", results);
            resolve(results)
          });
        });
      }

      updateGlobalBidPolicy(option) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.updateGlobalBidPolicy.path + "option=" + option);

          loaded.then((results) => {
            // console.log("updateGlobalBidPolicy results = ", results);
            resolve(results)
          });
        });
      }

      updateGlobalMaintPolicy(option) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.updateGlobalMaintPolicy.path + "option=" + option);

          loaded.then((results) => {
            // console.log("updateGlobalMaintPolicy results = ", results);
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
            // console.log("deleteFacility results = ", results);
            resolve(results)
          });
        });
      }

      delGenerator(genId) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.deleteGenerator.path + "genid=" + genId)
          loaded.then((results) => {
            // console.log("delGenerator results = ", results);
            resolve(results)
          });
        });
      }

      delGeneratorsInFacility(fid) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.delGenerators.path + "fid=" + fid)
          loaded.then((results) => {
            // console.log("delGeneratorsInFacility results = ", results);
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
            // console.log("getPlayerFacility results = ", results);
            resolve(results)
          });
        });
      }

      getPlayerFacilities() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerFacilities.path)
          loaded.then((results) => {
            // console.log("results = ", results);
            resolve(results)
          });
        });
      }

      getPlayerGenerators() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerGenerators.path)
          loaded.then((results) => {
            // console.log("results = ", results);
            resolve(results)
          })
        });
      }

      getGeneratorDetailHtml(genId) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.generatorDetailHtml.path + "genid=" + genId)
          loaded.then((results) => {
            // console.log("results = ", results);
            resolve(results)
          });
        });
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
            // console.log("getCompany resultes = ", results);
            resolve(results)
          });
        });
      }

      getCompanyEvents() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.playerCompanyEvents.path)
          loaded.then((results) => {
            // console.log("getCompany resultes = ", results);
            resolve(results)
          });
        });
      }

      getCurrentDate() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.currentDate.path)
          loaded.then((results) => {
            // console.log("getCurrentDate resultes = ", results);
            resolve(results)
          });
        });
      }


      getPortfolioHtml() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.portfolioHtml.path)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getQuarterlyHtml() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.quarterlyHtml.path)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getTurnButtonHtml() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.turnButtonHtml.path)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getTurnRunningDialogHtml() {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.turnRunningDialogHtml.path)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

      getEventDetailsHtml(promptId) {
        return new Promise(resolve => {
          const loaded = $.get(networkCallMap.eventDetailsHtml.path + "prmtid=" + promptId)
          loaded.then((results) => {
            // console.log("resultes = ", results);
            resolve(results)
          });
        });
      }

    });
});