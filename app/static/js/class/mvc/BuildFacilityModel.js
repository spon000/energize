define([
  "jquery",
  "ResourceLoader",
  "Handlebars",
  "FacilitySelectDialog",
  "EventEmitter"
], function ($, ResourceLoader, Handlebars, FacilitySelectDialog, EventEmitter) {

  return (
    class CanvasModel extends EventEmitter {
      constructor(facilityTypes) {
        super();
        this._facilityTypes = facilityTypes;
      }

      getCompiledHTML(facilityListIds) {
        let compiledTemplate = Handlebars.compile(FacilitySelectDialog.facilitySelectDialogWindow);
        // let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityTypeButtons);
        // let templateParms = {
        //   facilityTypes: this._facilityTypesArray
        // };
        return compiledTemplate;
      }

    });
});
