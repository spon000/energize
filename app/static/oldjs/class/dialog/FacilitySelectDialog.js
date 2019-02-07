define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "FacilitySelectTmplt",
  "FacilityDefs",
], function ($, JQUI, Handlebars, FacilitySelectTmplt, FacilityDefs) {
  return (

    class FacilitySelectDialog {
      constructor(facilityData, dialogElementId = "select-facility-dialog") {

        // Parameters
        this._width = 750;
        this._height = 600;
        this._title = "Select Facility To Build";
        this._anchorElementId = "dialog-box";
        this._dialogElementId = "#" + dialogElementId;
        this._errorElementId = "#sfd-error-dialog-box";
        this._facilityData = facilityData;
        this._isBoxOpen = false;
        this._isModel = true;
        this._position = {};

        // Event listener IDs
        this._facilityTypeButtonClass = ".sfd-facility-button button";
        this._facilitySelectButtonClass = ".sfd-select-facility-data-btn";

        // HTML for dialog
        this._facilitySelectWindowHtml = "";
        this._selectFacilityButtonsHtml = "";
        this._selectFacilityWindowsHtml = "";
        this._selectFacilityDetailsHtml = "";

        // Facility def info
        this._facilityTypesArray = this._facilityData.fc._facilityTypes.map(obj => ({ ...obj, enabled: false }));

        this._status = true;
        this._errorMessage = ""
        this._closeEvent = null;
        this._closeEventData = null;

        // Initialize routines
        this._initWindow();
        this._createEvents();
      }

      _initWindow() {

        for (let facilityType of this._facilityData.facilityTypeList) {
          //console.log("facilityType = ", facilityType);
          let index = FacilityDefs.facilityIndexes[facilityType.facilityType];
          this._facilityTypesArray[index].enabled = true;
        }

        let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilitySelectDialogWindow);
        this._facilitySelectWindowHtml = $(compiledTemplate());
        this._modifyWindow();
      }

      _modifyWindow() {

        $(this._dialogElementId).empty();
        this._createFacilityButtons();
        this._createFacilityWindows();
        this._createFacilityDetails();
      }

      _createFacilityButtons() {

        let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityTypeButtons);
        let templateParms = {
          facilityTypes: this._facilityTypesArray
        };
        this._selectFacilityButtonsHtml = $(compiledTemplate(templateParms));
        this._selectFacilityButtonsHtml = $(this._facilitySelectWindowHtml).find("#sfd-facility-buttons").append(this._selectFacilityButtonsHtml);
      }

      _createFacilityWindows() {

        let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityWindows);
        let templateParms = {
          facilityTypes: this._facilityTypesArray
        }
        this._selectFacilityWindowsHtml = $(compiledTemplate(templateParms));
        this._selectFacilityWindowsHtml = $(this._facilitySelectWindowHtml).find("#sfd-facility-details").append(this._selectFacilityWindowsHtml);
      }

      _createFacilityDetails() {

        for (let facilityType of this._facilityTypesArray) {
          // console.log("facilityType = ", facilityType);
          let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityDetailData);
          let templateParms = {
            facilityType: facilityType.facilityType,
            elementIdPrefix: facilityType.elementIdPrefix,
            generatorTypes: facilityType.generatorTypes,
            marginalCost: facilityType.marginalCost,
            localizedCost: facilityType.localizedCost,
            buildTime: facilityType.buildTime,
            operationalCost: facilityType.operationalCost,
            lifeExpectancy: facilityType.lifeExpectancy
          }
          this._selectFacilityDetailsHtml = $(compiledTemplate(templateParms));
          this._selectFacilityDetailsHtml = $(this._facilitySelectWindowHtml).find("#sfd-facility-detail-window-" + facilityType.elementIdPrefix).append(this._selectFacilityDetailsHtml);
        }
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
        //console.log("DialogInfoBox - openBox()... width : height" + this._width + " : " + this._height);
        $("#" + this._anchorElementId).empty();
        $("#" + this._anchorElementId).append(this._facilitySelectWindowHtml);

        $("#" + this._anchorElementId).dialog({
          //dialogClass: this._closeCSS,
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

      _showFacilityWindow(evt) {
        let facilityPrefix = $(evt.target).attr("name");
        if ($(evt.target).hasClass("selected")) {
          $(evt.target).removeClass("selected");
          $("#sfd-facility-detail-window-" + facilityPrefix).addClass("sfd-not-selected");
        }
        else {
          $(evt.target).addClass("selected");
          $("#sfd-facility-detail-window-" + facilityPrefix).removeClass("sfd-not-selected");
        }
      }

      _facilitySelectedButton(evt) {
        evt.data._facilityData.facilitySelected = $(evt.target).attr("name");
        evt.data.closeDialog();
      }

    });
});