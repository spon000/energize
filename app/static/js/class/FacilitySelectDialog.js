define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "FacilitySelectTmplt"
], function ($, JQUI, Handlebars, FacilitySelectTmplt) {
  return (

    class FacilitySelectDialog {
      constructor(facilityTypes, allowedFacilities) {

        // Selected facility
        this._selectedFacility = null;

        // Dialog 
        this._dialog = null;

        // Parameters
        this._width = 750;
        this._height = 600;
        this._title = "Select Facility To Build";

        // Element Ids
        this._elementIdAnchor = "selectfacilitydialog";
        this._elementIdDialog = "select-facility-dialog";
        this._elementIdButtons = "sfd-facility-buttons";
        this._elementIdDetails = "sfd-facility-details";
        this._elementIdWindow = "sfd-facility-detail-window-";
        this._elementClassWindow = "sfd-facility-detail-window";

        this._facilityTypes = facilityTypes.map(obj => (
          {
            ...obj,
            simpletype: obj.maintype.split(" ")[0]
          }
        ));

        this._facilityButtons = this._removeDuplicates(facilityTypes, "maintype").map(obj => (
          {
            ...obj,
            simpletype: obj.maintype.split(" ")[0],
            enabled: allowedFacilities.find(id => "" + obj.id === id) ? true : false,
          }
        ));

        this._isModel = true;
        this._position = {};

        // Event listener classes
        this._facilityTypeButtonClass = "sfd-facility-btn";
        this._facilitySelectButtonClass = "sfd-select-facility-data-btn";

        // HTML for dialog
        this._facilitySelectWindowHtml = "";
        this._selectFacilityButtonsHtml = "";
        this._selectFacilityWindowsHtml = "";
        this._selectFacilityDetailsHtml = "";

        // Facility def info
        this._closeEvent = null;
        this._closeEventData = null;

        // Initialize Dialog HTML
        this._initWindow();

        // Create Event responses
        this._createEvents();
      }

      ////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////
      // Private methods
      //
      ////////////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////////
      // Initialize methods
      _initWindow() {
        let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilitySelectDialogWindow);
        this._facilitySelectWindowHtml = $(compiledTemplate());
        $(this._elementIdAnchor).empty();
        this._createFacilityButtons();
        this._createFacilityWindows();
        this._createFacilityDetails();
      }

      _createEvents() {
        $("#" + this._elementIdAnchor).off();
        $("#" + this._elementIdAnchor).on("click", "." + this._facilityTypeButtonClass, this, this._showFacilityWindow);
        $("#" + this._elementIdAnchor).on("click", "." + this._facilitySelectButtonClass, this, this._facilitySelectedButton);
      }


      ////////////////////////////////////////////////////////////////
      // Populate template methods
      _createFacilityButtons() {
        let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityTypeButtons);
        let templateParms = {
          facilityButtons: this._facilityButtons
        };
        this._selectFacilityButtonsHtml = $(compiledTemplate(templateParms));
        this._selectFacilityButtonsHtml = $(this._facilitySelectWindowHtml).find("#" + this._elementIdButtons).append(this._selectFacilityButtonsHtml);
      }

      _createFacilityWindows() {
        let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityWindows);
        let templateParms = {
          facilityTypes: this._facilityTypes
        };
        this._selectFacilityWindowsHtml = $(compiledTemplate(templateParms));
        this._selectFacilityWindowsHtml = $(this._facilitySelectWindowHtml).find("#" + this._elementIdDetails).append(this._selectFacilityWindowsHtml);
      }

      _createFacilityDetails() {
        for (let facilityType of this._facilityTypes) {
          // console.log("facilityType = ", facilityType);
          let compiledTemplate = Handlebars.compile(FacilitySelectTmplt.facilityDetailData);
          let templateParms = {
            facilityTypeName: facilityType.name,
            facilityId: facilityType.id,
            fixedCost: this._toMoney(facilityType.fixed_cost_build),
            fixedOperateCost: this._toMoney(facilityType.fixed_cost_operate),
            marginalCost: this._toMoney(facilityType.marginal_cost_build),
            marginalOperateCost: this._toMoney(facilityType.marginal_cost_operate),
            minimumArea: Math.floor(facilityType.minimum_area) + " square meters",
            buildTime: facilityType.build_time + " turns",
            simpletype: facilityType.simpletype
          }
          this._selectFacilityDetailsHtml = $(compiledTemplate(templateParms));
          this._selectFacilityDetailsHtml = $(this._facilitySelectWindowHtml).find("#" + this._elementIdWindow + facilityType.id).append(this._selectFacilityDetailsHtml);
        }
      }


      ////////////////////////////////////////////////////////////////
      // Utility methods
      _removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
      }

      _convertQuartersToYears(quarters) {
        let years = Math.floor(quarters / 4);
        let months = quarters % 4;
        return (years + " years, " + months + " months");
      }

      _toMoney(amount) {
        return "$" + (amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
      }


      ////////////////////////////////////////////////////////////////
      // Listener event methods.
      _showFacilityWindow(evt) {
        let scope = evt.data;
        let facilityTypeName = $(evt.target).attr("name");
        // console.log("facilityTypeName = ", facilityTypeName);

        if ($(evt.target).hasClass("selected")) {
          $(evt.target).removeClass("selected");
          $("." + scope._elementClassWindow + "[name='" + facilityTypeName + "']").addClass("sfd-not-selected");
        }
        else {
          $(evt.target).addClass("selected");
          $("." + scope._elementClassWindow + "[name='" + facilityTypeName + "']").removeClass("sfd-not-selected");
        }
      }

      _facilitySelectedButton(evt) {
        let scope = evt.data;
        scope._selectedFacility = $(evt.target).attr("facility-id");
        scope.closeDialog();
      }

      ////////////////////////////////////////////////////////////////      
      ////////////////////////////////////////////////////////////////
      // Public methods
      //
      ////////////////////////////////////////////////////////////////


      ////////////////////////////////////////////////////////////////
      // Open and close the dialog methods
      openDialog() {
        this._selectedFacility = null;
        $("#" + this._elementIdAnchor).empty();
        $("#" + this._elementIdAnchor).append(this._facilitySelectWindowHtml);
        this._dialog = $("#" + this._elementIdAnchor).dialog({
          title: this._title,
          width: this._width,
          height: this._height,
          position: this._position,
          modal: this._isModel
        });

        return new Promise(resolve => {
          this._dialog.on("dialogclose", (evt, ui) => {
            this._dialog.off("dialogclose");
            resolve(this._selectedFacility);
          });

        })
      }

      closeDialog() {
        this._dialog.dialog("close");
      }

    });
});