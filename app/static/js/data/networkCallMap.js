define([
  // Libs
  // Classes
], function () {
  let gid = "?gid=" + globalGameId + "&";
  return ({
    // The variable globalGameId resides in app/templates/game.html
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
    }
  });
});				