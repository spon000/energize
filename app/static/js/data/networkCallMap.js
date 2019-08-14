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
    "playerCompany": {
      name: "playerCompany",
      path: "/playercompany" + gid
    },
    "facilityTypes": {
      name: "facilityTypes",
      path: "/facilitytypes"
    },
    "facilityTypesTable": {
      name: "facilityTypesTable",
      path: "/facilitytypestable"
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
      name: "deleteFacility",
      path: "/deletefacility" + gid
    },
    "updateFacilityType": {
      name: "updateFacilityType",
      path: "/updatefacilitytype" + gid
    },
    "currentDate": {
      name: "currentDate",
      path: "/currentdate" + gid
    },
    "generatorDetailHtml": {
      name: "generatorDetailHtml",
      path: "/generatordetailhtml" + gid
    }
  });
});				