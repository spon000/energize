define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "FacilityViewTmplt",
  "FacilityDefs",
], function ($, JQUI, Handlebars, FacilityViewTmplt, FacilityDefs) {
  return (
    class FacilitySelectDialog {
      constructor(facilityData, dialogElementId = "view-facility-dialog") {
        // Parameters
        this._width = 750;
        this._height = 600;
        this._title = "Facility Viewer";
        this._anchorElementId = "dialog-box";
        this._dialogElementId = "#" + dialogElementId;
        this._errorElementId = "#vfd-error-dialog-box";
        this._facilityData = facilityData;
        this._isBoxOpen = false;
        this._isModel = true;
        this._position = {};

        // Event listener IDs

        // HTML for dialog
        this._facilityViewWindowHtml = "";

        this._status = true;
        this._errorMessage = ""
        this._closeEvent = null;
        this._closeEventData = null;

        // Initialize routines
        this._initWindow();
        this._createEvents();
      }

      _initWindow() {
        this._modifyWindow();
      }

      _modifyWindow() {
        $(this._dialogElementId).empty();
      }

      _createEvents() {
        $("#" + this._anchorElementId).off();
        $("#" + this._anchorElementId).on("click", this._facilityTypeButtonClass, this, this._showFacilityWindow);
        $("#" + this._anchorElementId).on("click", this._facilitySelectButtonClass, this, this._facilitySelectedButton);
      }

      _checkStatus() {
        console.log("_checkStatus()..." + this._status);
        if (!this._status) {
          console.log("_checkStatus(): error");
          this._openMessageDialogBox();
        }
      }

      _openMessageDialogBox() {
        $(this._errorElementId).dialog({
          title: "Error:",
          resizable: false,
          height: "auto",
          width: "auto",
          model: true,
          buttons: {
            "OK": function () {
              $(this).dialog("close");
            }
          }
        });
        $(this._errorElementId).empty();
        $(this._errorElementId).append("<p>" + this._errorMessage + "</p>");
      }

      openDialog() {
        $("#" + this._anchorElementId).empty();
        $("#" + this._anchorElementId).append(this._facilityViewtWindowHtml);

        $("#" + this._anchorElementId).dialog({
          title: this._title,
          width: this._width,
          height: this._height,
          position: this._position,
          modal: this._isModel
        });
      }

      closeDialog() {
        $("#" + this._anchorElementId).dialog("close");
        if (this._closeEvent) this._closeEvent(this._closeEventData);
      }

      attachCloseButton(responseFunction, data = null) {
        let responseObject = { rf: responseFunction, rd: data };
        $("#" + this._anchorElementId).dialog("widget").find('.ui-dialog-titlebar-close').off();
        $("#" + this._anchorElementId).dialog("widget").find('.ui-dialog-titlebar-close')
          .on("click", null, responseObject, (evt) => {
            console.log("evt = ", evt);
            evt.data.rf(evt.data.rd);
            $("#" + this._anchorElementId).dialog("close");
          });
      }

      attachCloseEvent(responseFunction, data = null) {
        this._closeEvent = responseFunction;
        this._closeEventData = data;
      }

      // Listener event functions.

    });
});