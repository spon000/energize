define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "FacilityViewTmplt",
  "Generator",
  "Facility"
], function ($, JQUI, Handlebars, FacilityViewTmplt, Generator, Facility) {
  return (

    class FacilityBuildDialog {
      constructor(facilityType, generatorTypes, facility = null) {

        console.log("facilityType = ", facilityType);

        // Dialog 
        this._dialog = null;

        // Parameters
        this._width = 750;
        this._height = 640;
        this._isModel = true;
        this._position = {};
        this._title = "Facility Viewer";

        // Element Ids
        this._elementIdAnchor = "infodialogbox";
        this._elementIdDialog = "view-facility-dialog"

        // Constructor args
        this._facility = facility;
        this._facilityType = facilityType;
        this._generatorTypes = generatorTypes

        // Add extra property to facility type object.
        this._facilityType["simpletype"].facilityType.maintype.split(" ")[0];


        // Event listener IDs


        // HTML for dialog
        this._facilityViewDialogWindowHtml = "";


        // // Facility def info
        // let facilityDefIndex = FacilityDefs.facilityIndexes[this._facilityType];
        // this._facilityDef = FacilityDefs.facilityTypes[facilityDefIndex];
        // this._generatorTypeIndex = 0;
        // this._generatorList = [];

        // this._totalCapacityAvailable = 0;
        // this._totalCapacityAllocated = 0;
        // this._totalFacilityCost = 0;

        // this._status = true;
        // this._errorMessage = "";
        // this._closeEvent = null;
        // this._closeEventData = null;

        // Initialize routines
        this._initWindow();


        // this._createEvents();
      }

      _initWindow() {
        let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityViewDialogWindow);
        this._facilityViewDialogWindowHtml = $(compiledTemplate());
        $(this._elementIdAnchor).empty();


        // this._generatorList.push({
        //   generatorDetailsIndex: 0
        // });
        // this._totalCapacityAvailable = this._calculateAvailableCapacity();
        // this._totalFacilityCost = this._calculateTotalFacilityCost();

        // let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilityBuildDialogWindow);
        // this._facilityBuildWindowHtml = $(compiledTemplate());
        // this._modifyWindow();
      }

      _modifyWindow() {
        $(this._dialogElementId).empty();
        // this._createHeader();
        // this._createGeneratorList();
        // this._createSummary();
        // this._createButtons();
      }

      _createHeader() {
        let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilityHeader);
        let templateParms = {
          facilityDef: this._facilityDef,
          selectedIndex: this._generatorTypeIndex,
          totalCapacityAvailable: this._totalCapacityAvailable
        }

        // https://stackoverflow.com/questions/15088215/handlebars-js-if-block-helper
        Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
          return ("" + arg1 == "" + arg2) ? options.fn(this) : options.inverse(this);
        });

        this._facilityBuildHeaderHtml = $(compiledTemplate(templateParms));
        this._facilityBuildHeaderHtml = $(this._facilityBuildWindowHtml).find(this._dialogElementId).append(this._facilityBuildHeaderHtml);
      }

      _createGeneratorList() {
        let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilityGeneratorList);
        let templateParms = {
          generatorList: this._generatorList,
          generatorDetails: this._facilityDef.generatorTypes[this._generatorTypeIndex]
        }

        // https://stackoverflow.com/questions/15088215/handlebars-js-if-block-helper
        Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
          return ("" + arg1 == "" + arg2) ? options.fn(this) : options.inverse(this);
        });

        // console.log("templateParms.generatorDetails = ", templateParms.generatorDetails);
        this._facilityBuildGeneratorListHtml = $(compiledTemplate(templateParms));
        this._facilityBuildGeneratorListHtml = $(this._facilityBuildWindowHtml).find(this._dialogElementId).append(this._facilityBuildGeneratorListHtml);
      }

      _createSummary() {
        this._calculateSummary();
        let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilitySummary);
        let templateParms = {
          totalCapcity: this._totalCapacityAllocated,
          totalCost: this._totalFacilityCost,
          totalBuildTime: this._facilityDef.buildTime,
          lifeExpectancy: this._facilityDef.lifeExpectancy
        }
        this._facilityBuildSummaryHtml = $(compiledTemplate(templateParms));
        this._facilityBuildSummaryHtml = $(this._facilityBuildWindowHtml).find(this._dialogElementId).append(this._facilityBuildSummaryHtml);
      }

      _createButtons() {
        let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilityConfirmButtons);
        let templateParms = {
          totalCapcity: 0,
          totalCost: this._totalFacilityCost,
          totalBuildTime: this._facilityDef.buildTime,
          lifeExpectancy: this._facilityDef.lifeExpectancy

        }
        this._facilityBuildButtonsHtml = $(compiledTemplate(templateParms));
        this._facilityBuildButtonsHtml = $(this._facilityBuildWindowHtml).find(this._dialogElementId).append(this._facilityBuildButtonsHtml);
      }

      _createEvents() {
        $("#" + this._anchorElementId).off();
        $("#" + this._anchorElementId).on("click", this._addGeneratorButtonId, this, this._addGenerator);
        $("#" + this._anchorElementId).on("click", this._removeGeneratorButtonClass, this, this._removeGenerator);
        $("#" + this._anchorElementId).on("change", this._selectGeneratorTypeClass, this, this._changeGeneratorType);
        $("#" + this._anchorElementId).on("change", this._selectGeneratorCapacityClass, this, this._changeGeneratorCapacity);

        $("#" + this._anchorElementId).on("click", this._backToSelectButtonId, this, this._backButton);
        $("#" + this._anchorElementId).on("click", this._buildFacilityButtonId, this, this._buildButton);
        $("#" + this._anchorElementId).on("click", this._cancelFacilityButtonId, this, this._cancelButton);
      }

      _calculateSummary() {
        this._totalCapacityAvailable = this._calculateAvailableCapacity();
        this._totalCapacityAllocated = this._calculateTotalAllocatedCapacity();
        this._totalFacilityCost = this._calculateTotalFacilityCost();
      }

      _calculateTotalAllocatedCapacity() {
        let generatorType = this._facilityDef.generatorTypes[this._generatorTypeIndex];
        let totalCapacity = 0;
        for (let generator of this._generatorList) {
          totalCapacity += generatorType.generatorCapacities[generator.generatorDetailsIndex].capacity;
        }

        return totalCapacity;
      }

      _calculateTotalFacilityCost() {
        let generatorType = this._facilityDef.generatorTypes[this._generatorTypeIndex];
        let totalCost = this._facilityDef.localizedCost;
        for (let generator of this._generatorList) {
          totalCost += generatorType.generatorCapacities[generator.generatorDetailsIndex].cost;
        }

        return totalCost;
      }

      _calculateAvailableCapacity() {
        let generatorType = this._facilityDef.generatorTypes[this._generatorTypeIndex];
        let totalCapacity = generatorType.maxCapacity;
        for (let generator of this._generatorList) {
          totalCapacity -= generatorType.generatorCapacities[generator.generatorDetailsIndex].capacity;
        }

        return totalCapacity;
      }

      _checkStatus() {
        console.log("_checkStatus()..." + this._status);
        if (!this._status) {
          //console.log("_checkStatus(): error");
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
        console.log("DialogInfoBox - openBox()... width : height" + this._width + " : " + this._height);
        $("#" + this._anchorElementId).empty();
        $("#" + this._anchorElementId).append(this._facilityViewDialogWindowHtml);

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
            //evt.preventDefault();
          });
      }

      attachCloseEvent(responseFunction, data = null) {
        this._closeEvent = responseFunction;
        this._closeEventData = data;
      }

      // Listener event functions.



    });
});