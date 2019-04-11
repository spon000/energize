define([
  "jquery",
  "jqueryui",
  "Handlebars",
  "FacilitySelectDialog",
  "EventEmitter",
], function ($, $UI, Handlebars, FacilitySelectDialog, EventEmitter) {

  return (
    class BuildFacilityView extends EventEmitter {
      constructor(dialogElementId, bFModel) {
        super();
        this._dialogElementId = dialogElementId;
        this._buildFacilityModel = bFModel;
      }

      showDialog() {
        $(this._dialogElementId).empty();
      }

    });
});