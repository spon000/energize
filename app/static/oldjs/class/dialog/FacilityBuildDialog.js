define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "FacilityBuildTmplt",
  "FacilityDefs",
  "Generator",
  "Facility"
], function ($, JQUI, Handlebars, FacilityBuildTmplt, FacilityDefs, Generator, Facility) {
  return (

    class FacilityBuildDialog {
      constructor(facilityData, dialogElementId = "bfd-facility-window") {

        // Parameters
        this._width = 750;
        this._height = 640;
        this._title = "Build New Facility";
        this._anchorElementId = "dialog-box";
        this._dialogElementId = "#" + dialogElementId;
        this._errorElementId = "#bfd-error-dialog-box";
        this._facilityData = facilityData;
        this._facilityType = this._facilityData.facilitySelected;
        this._isBoxOpen = false;
        this._isModel = true;
        this._position = {};

        // Event listener IDs
        this._addGeneratorButtonId = "#bfd-add-generator-button";
        this._removeGeneratorButtonClass = ".bfd-remove-generator-button";
        this._selectGeneratorTypeClass = ".bfd-select-generator-type";
        this._selectGeneratorCapacityClass = ".bfd-select-generator-capacity";
        this._backToSelectButtonId = "#bfd-back-button";
        this._buildFacilityButtonId = "#bfd-build-button";
        this._cancelFacilityButtonId = "#bfd-cancel-button";

        // HTML for dialog
        this._facilityBuildWindowHtml = "";
        this._facilityBuildHeaderHtml = "";
        this._facilityBuildGeneratorListHtml = "";
        this._facilityBuildSummaryHtml = "";
        this._facilityBuildButtonsHtml = "";

        // Facility def info
        let facilityDefIndex = FacilityDefs.facilityIndexes[this._facilityType];
        this._facilityDef = FacilityDefs.facilityTypes[facilityDefIndex];
        this._generatorTypeIndex = 0;
        this._generatorList = [];

        this._totalCapacityAvailable = 0;
        this._totalCapacityAllocated = 0;
        this._totalFacilityCost = 0;

        this._status = true;
        this._errorMessage = "";
        this._closeEvent = null;
        this._closeEventData = null;

        // Initialize routines
        this._initWindow();
        this._createEvents();
      }

      _initWindow() {
        this._generatorList.push({
          generatorDetailsIndex: 0
        });
        this._totalCapacityAvailable = this._calculateAvailableCapacity();
        this._totalFacilityCost = this._calculateTotalFacilityCost();

        let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilityBuildDialogWindow);
        this._facilityBuildWindowHtml = $(compiledTemplate());
        this._modifyWindow();
      }

      _modifyWindow() {
        $(this._dialogElementId).empty();
        this._createHeader();
        this._createGeneratorList();
        this._createSummary();
        this._createButtons();
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
        //console.log("DialogInfoBox - openBox()... width : height" + this._width + " : " + this._height);
        $("#" + this._anchorElementId).empty();
        $("#" + this._anchorElementId).append(this._facilityBuildWindowHtml);

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
      _addGenerator(evt) {
        let bfd = evt.data;
        let generatorType = bfd._facilityDef.generatorTypes[bfd._generatorTypeIndex];
        let index = 0;
        let availCapacity = bfd._totalCapacityAvailable - generatorType.generatorCapacities[index].capacity;
        if (availCapacity >= 0) {
          bfd._generatorList.push({
            generatorDetailsIndex: index
          });
          bfd._calculateSummary();
          bfd._modifyWindow();
          bfd._status = true;
        }
        else {
          bfd._errorMessage = "Can't add anymore generators - No capacity available";
          bfd._status = false;
        }

        bfd._checkStatus();
      }

      _removeGenerator(evt) {
        let bfd = evt.data;
        let index = $(evt.target).attr("idx");
        if (bfd._generatorList.length > 1) {
          bfd._generatorList.splice(index, 1);
          bfd._calculateSummary();
          bfd._modifyWindow();
          bfd._status = true;
        }
        else {
          bfd._errorMessage = "Can't remove anymore generators - At least one generator is required";
          bfd._status = false;
        }

        bfd._checkStatus();
      }

      _changeGeneratorType(evt) {
        let bfd = evt.data;
        let index = $(evt.target)[0].selectedIndex;
        bfd._generatorTypeIndex = index;
        bfd._generatorList = [];
        bfd._generatorList.push({
          generatorDetailsIndex: 0
        });
        bfd._calculateSummary();
        bfd._modifyWindow();
      }

      _changeGeneratorCapacity(evt) {
        let bfd = evt.data;
        let generatorIndex = $(evt.target).find(":selected").attr("genindex");
        let prevIndex = bfd._generatorList[generatorIndex].generatorDetailsIndex;
        let index = $(evt.target)[0].selectedIndex;
        bfd._generatorList[generatorIndex].generatorDetailsIndex = index;
        if (bfd._calculateAvailableCapacity() >= 0) {
          bfd._calculateSummary();
          bfd._modifyWindow();
          bfd._status = true;
        }
        else {
          bfd._generatorList[generatorIndex].generatorDetailsIndex = prevIndex;
          bfd._modifyWindow();
          bfd._errorMessage = "Can't increase generator capacity - not enough available capacity";
          bfd._status = false;
        }

        bfd._checkStatus();
      }

      _backButton(evt) {
        evt.data._facilityData.facilityStatus = "back";
        evt.data.closeDialog();
      }

      _buildButton(evt) {
        let facilityData = evt.data._facilityData;
        let facilityDialogData = evt.data;
        let facilityDef = facilityDialogData._facilityDef;
        let genTypeIndex = facilityDialogData._generatorTypeIndex;
        // console.log("facilityData = ", facilityData);
        // console.log("facilityDialogData = ", facilityDialogData);
        // console.log("facilityDef = ", facilityDef);
        // console.log("genTypeIndex = ", genTypeIndex);
        // console.log("facilityDialogData._generatorList = ", facilityDialogData._generatorList);
        for (let genIndex of facilityDialogData._generatorList) {
          let generatorDetails = facilityDef.generatorTypes[genTypeIndex].generatorCapacities[genIndex.generatorDetailsIndex];
          //console.log("generatorDetails = ", generatorDetails);
          facilityData.facility.addGenerator({
            type: facilityDialogData._facilityDef.generatorTypes[facilityDialogData._generatorTypeIndex].name,
            capacity: generatorDetails.capacity,
            cost: generatorDetails.cost,
            age: 0,
            timeToBuild: facilityDef.buildTime
          });
        }
        evt.data._facilityData.facilityStatus = "build";
        console.log("facility = ", facilityData.facility);
        evt.data.closeDialog();
      }

      _cancelButton(evt) {
        evt.data._facilityData.facilityStatus = "cancel";
        evt.data.closeDialog();
      }
    });
});