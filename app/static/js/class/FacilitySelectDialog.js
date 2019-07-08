define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "FacilitySelectTmplt",
  "ModelData",
  "evtEmitter"
], function ($, JQUI, Handlebars, FacilitySelectTmplt, ModelData, evtEmitter) {
  return (

    class FacilitySelectDialog {
      constructor(facilityTypeList, facilityId, closeHandler = null) {
        console.log(`FacilitySelectDialog parms: ${facilityTypeList}, ${facilityId}, ${closeHandler}`);

        // Selected facility
        this._selectedFacilityId = null;
        this._facilityTypeList = facilityTypeList;
        this._facilityId = facilityId;


        // Dialog 
        this._dialog = null;
        this._closeHandler = closeHandler;

        // JQueryUI Dialog Parameters
        this._width = 860;
        this._height = 525;
        this._unselectedHeight = 200;
        this._isModel = true;
        this._position = {};
        this._title = "Select Facility To Build";

        // Element Ids
        this._elementIdAnchor = "facility-select-dialog";
        this._elementIdDialog = "select-facility-dialog";
        this._elementIdButtons = "sfd-facility-buttons";
        this._elementIdDetails = "sfd-facility-details";
        this._elementIdWindow = "sfd-facility-detail-window-";
        this._elementClassWindow = "sfd-facility-detail-window";

        // Load all needed data.
        this._modelData = new ModelData();
        this._modelData.getFacilityTypes().then((data) => {
          // console.log("loaded data = ", data);
          this._facilityTypes = data['facility_types'];
          this._generatorTypes = data['generator_types'];
          this._powerTypes = data['power_types'];
          this._resourceTypes = data['resource_types'];

          // Add extra properties to the each facility type object. Also remove the "new" facility type.
          this._facilityTypes = this._facilityTypes.filter(ft => ft.maintype != "new").map(ft => (
            {
              ...ft,
              simpletype: ft.maintype.split(" ")[0]
            }
          ));

          this._facilityButtons = this._removeDuplicates(this._facilityTypes, "maintype").map(ft => (
            {
              ...ft,
              enabled: this._facilityTypeList.find(id => "" + ft.id === id) ? true : false,
            }
          ));

          // console.log("facilityButtons = ", this._facilityButtons);

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

          this.openDialog();
        });
      }

      ////////////////////////////////////////////////////////////////
      // Getters

      get selectedFacilityId() {
        return this._selectedFacilityId;
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
        $("#" + this._elementIdAnchor).empty();
        this._createFacilityButtons();
        this._createFacilityWindows();
        this._createFacilityDetails();
        console.log("anchorID = ", $("#" + this._elementIdAnchor));
      }

      _createEvents() {
        console.log("create events...")
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

        this._selectFacilityButtonsHtml = this._addHtml($(compiledTemplate(templateParms)),
          this._elementIdButtons, this._facilitySelectWindowHtml)


        // console.log("this._facilitySelectWindowHtml = ", this._facilitySelectWindowHtml.html());
        // this._selectFacilityButtonsHtml = $(compiledTemplate(templateParms));
        // console.log("this._selectFacilityButtonsHtml = ", this._selectFacilityButtonsHtml);
        // this._selectFacilityButtonsHtml = $(this._facilitySelectWindowHtml).find("#" + this._elementIdButtons).append(this._selectFacilityButtonsHtml);
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
            minimumArea: Math.floor(facilityType.minimum_area),
            buildTime: facilityType.build_time + "",
            simpletype: facilityType.simpletype
          }
          this._selectFacilityDetailsHtml = $(compiledTemplate(templateParms));
          this._selectFacilityDetailsHtml = $(this._facilitySelectWindowHtml).find("#" + this._elementIdWindow + facilityType.id).append(this._selectFacilityDetailsHtml);
        }
      }

      ////////////////////////////////////////////////////////////////
      // Utility methods--*****
      _addHtml(html, htmlId, windowHtml) {
        return $(windowHtml).find("#" + htmlId).append(html);
      }

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
        scope._selectedFacilityId = $(evt.target).attr("facility-id");
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
        console.log("open dialog...")
        this._selectedFacilityId = null;
        $("#" + this._elementIdAnchor).empty();
        $("#" + this._elementIdAnchor).append(this._facilitySelectWindowHtml);

        this._dialog = $("#" + this._elementIdAnchor).dialog({
          scope: this,
          title: this._title,
          width: this._width,
          height: this._height,
          position: this._position,
          modal: this._isModel,
        });


        $(this._dialog).on("dialogclose", this, (evt, ui) => {
          if (this._closeHandler) {
            this._closeHandler(evt);
          }

          if (this._selectedFacilityId) {
            console.log("selected facility type = ", this._selectedFacilityId);
            evtEmitter.emit("updatefacility", {
              facilityId: this._facilityId,
              facilityTypeId: this._selectedFacilityId,
              facilityTypeList: this._facilityTypeList
            });
          }
          else {
            console.log("delete facility. id = ", this._facilityId);
            evtEmitter.emit("deletefacility", {
              facilityId: this._facilityId
            });
          }

          $("#" + this._elementIdAnchor).empty();
          this._dialog.dialog("destroy");
        });
      }

      closeDialog() {
        this._dialog.dialog("close");
      }

    });
});