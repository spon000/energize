define([
  "Dim2",
  "EventEmitter",
], function (Dim2, EventEmitter) {

  return (
    class BuildFacilityController extends EventEmitter {
      constructor(bFModel, bFView, facilityListIds) {
        super();
        this._buildFacilityModel = bFModel;
        this._buildFacilityView = bFView;
        this._facilityListIds = facilityListIds;
      }

      start() {
        let html = this._buildFacilityModel.getCompiledHTML(facilityListIds);
        this._buildFacilityView.showDialog(html);


      }

      // let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilitySelectDialogWindow);


      // _modifyWindow() {

      //   $(this._dialogElementId).empty();
      //   this._createFacilityButtons();
      //   this._createFacilityWindows();
      //   this._createFacilityDetails();
      // }

      // _createFacilityButtons() {

      //   let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityTypeButtons);
      //   let templateParms = {
      //     facilityTypes: this._facilityTypesArray
      //   };
      //   this._selectFacilityButtonsHtml = $(compiledTemplate(templateParms));
      //   this._selectFacilityButtonsHtml = $(this._facilitySelectWindowHtml).find("#sfd-facility-buttons").append(this._selectFacilityButtonsHtml);
      // }

      // _createFacilityWindows() {

      //   let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityWindows);
      //   let templateParms = {
      //     facilityTypes: this._facilityTypesArray
      //   }
      //   this._selectFacilityWindowsHtml = $(compiledTemplate(templateParms));
      //   this._selectFacilityWindowsHtml = $(this._facilitySelectWindowHtml).find("#sfd-facility-details").append(this._selectFacilityWindowsHtml);
      // }

      // _createFacilityDetails() {

      //   for (let facilityType of this._facilityTypesArray) {
      //     // console.log("facilityType = ", facilityType);
      //     let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityDetailData);
      //     let templateParms = {
      //       facilityType: facilityType.facilityType,
      //       elementIdPrefix: facilityType.elementIdPrefix,
      //       generatorTypes: facilityType.generatorTypes,
      //       marginalCost: facilityType.marginalCost,
      //       localizedCost: facilityType.localizedCost,
      //       buildTime: facilityType.buildTime,
      //       operationalCost: facilityType.operationalCost,
      //       lifeExpectancy: facilityType.lifeExpectancy
      //     }
      //     this._selectFacilityDetailsHtml = $(compiledTemplate(templateParms));
      //     this._selectFacilityDetailsHtml = $(this._facilitySelectWindowHtml).find("#sfd-facility-detail-window-" + facilityType.elementIdPrefix).append(this._selectFacilityDetailsHtml);
      //   }
      // }

    });
});