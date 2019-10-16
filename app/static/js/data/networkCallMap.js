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
    "playerGenerators": {
      name: "playerGenerators",
      path: "/playergenerators" + gid
    },
    "playerCompany": {
      name: "playerCompany",
      path: "/playercompany" + gid
    },
    "playerCompanyEvents": {
      name: "playerCompanyEvents",
      path: "/playercompanyevents" + gid
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
    "updateGenerators": {
      name: "updateGenerators",
      path: "/updategenerators" + gid
    },
    "deleteGenerator": {
      name: "deleteGenerator",
      path: "/deletegenerator" + gid
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
    "updateFacility": {
      name: "updateFacility",
      path: "/updatefacility" + gid
    },
    "currentDate": {
      name: "currentDate",
      path: "/currentdate" + gid
    },
    "generatorDetailHtml": {
      name: "generatorDetailHtml",
      path: "/generatordetailhtml" + gid
    },
    "portfolioHtml": {
      name: "portfolioHtml",
      path: "/portfoliohtml" + gid
    },
    "quarterlyHtml": {
      name: "quarterlyHtml",
      path: "/quarterlyhtml" + gid
    },
    "turnButtonHtml": {
      name: "turnButtonHtml",
      path: "/turnbuttonhtml" + gid
    },
    "turnRunningDialogHtml": {
      name: "turnRunningDialogHtml",
      path: "/turnrunningdialoghtml" + gid
    },
    "eventDetailsHtml": {
      name: "eventDetailsHtml",
      path: "/eventdetailshtml" + gid
    },
  });
});				