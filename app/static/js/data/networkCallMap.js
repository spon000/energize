define([
  // Libs
  // Classes
], function () {
  // The variable globalGameId resides in app/templates/game.html
  let gid = "?gid=" + globalGameId + "&";
  return ({
    "server": {
    },
    "gameTable": {
    },
    "companyTable": {
      name: "companyTable",
      path: "/company" + gid
    },
    "cityTable": {
      name: "cityTable",
      path: "/cities" + gid
    },
    "facilityTable": {
      name: "facilityTable",
      path: "/facilities" + gid
    },
    "viewCity": {
      name: "singleCity",
      path: "/viewcity" + gid
    },
    "viewFacility": {
      name: "viewFaciltiy",
      path: "/viewfacility" + gid
    },
    "playerFacility": {
      name: "playerFacility",
      path: "/playerfacility" + gid
    },
    "playerFacilities": {
      name: "playerFacilities",
      path: "/playerfacilities" + gid
    },
    "facilityTypesTable": {
      name: "facilityTypesTable",
      path: "/facilitytypes"
    },
    "generatorTypesTable": {
      name: "generatorTypesTable",
      path: "/generatortypes"
    },
    "powerTypesTable": {
      name: "powerTypesTable",
      path: "/powertypes"
    },
    "addGenerators": {
      name: "newGenerators",
      path: "/newgenerators" + gid
    },
    "addFacility": {
      name: "newFacility",
      path: "/newfacility" + gid
    },
    "deleteFacility": {
      name: "updateFacilityType",
      path: "/updatefacilitytype" + gid
    },
    "updateFacility": {
      name: "updateFacilityType",
      path: "/updatefacilitytype" + gid
    }
  });
});				