define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "FacilityViewTmplt",
  "Generator",
  "Facility",
  "ModelData"
], function ($, JQUI, Handlebars, FacilityViewTmplt, Generator, Facility, ModelData) {
  return (

    class FacilityViewDialog {
      constructor(parms) {
        console.log("parms = ", parms);
        // Dialog 
        this._dialog = null;

        // Parameters
        this._width = 750;
        this._height = 640;
        this._isModel = true;
        this._position = {};
        this._title = "Facility Viewer";

        // Element Ids
        this._elementIdAnchor = "facility-dialog";
        this._elementIdDialog = "view-facility-dialog";
        this._elementIdFacilityHeader = "facility-header-window";
        this._elementIdFacilityInfo = "facility-info-window";
        this._elementIdGeneratorList = "generator-list-window"

        // Constructor args
        this._facility = parms.facility || null;
        this._generators = parms.generators || null;
        this._facilityType = parms.facilityType || null;
        this._powerTypes = parms.powerTypes || null;
        this._generatorTypes = parms.generatorTypes || null;
        this._company = parms.company || null;


        // Add extra property to facility type object.
        this._facilityType["simpletype"] = this._facilityType.maintype.split(" ")[0];

        // Add PowerType and Resource Type record to each generatorType record.
        this._generatorTypes = this._generatorTypes.map(gt => {
          let powType = this._powerTypes.find(pt => gt.id_power_type === pt.id)
          // let resType = this._resourceTypes.find(rt => gt.id_resource_type === rt.id)
          gt['pt'] = powType;
          // gt['rt'] = resType;
        });

        console.log("generatorTypes = ", this._generatorTypes);
        // GeneratorType, PowerType, and ResourceType records to each generator.
        this._generators = this._generators.map(g => {
          let genType = this._generatorTypes.find(gt => {
            console.log('gt = ', gt);
            g.generator_type === gt.id
          })
          g["gt"] = genType;
        });

        console.log('this._generators = ', this._generators);

        // Event listener IDs


        // HTML for dialog
        this._facilityViewWindowHtml = "";
        this._facilityViewHeaderHtml = "";
        this._facilityViewFacilityInfoHtml = "";
        this._facilityViewGeneratorListHtml = "";


        modelData = new ModelData()
        modelData.getFacilities().then((results) => {
          console.log("here we are...");
        });

        // console.log("this._generators[0].generator_type =", this._generators[0].generator_type)
        // console.log("find = ", this._generatorTypes.find(gt => gt.id === this._generators[0].generator_type));
        // //console.log("cap = ", this._generators.map(g => this._generatorTypes.find(gt => gt.id === g.id_type)));

        // Initialize Dialog
        // this._initWindow();
        // this._createEvents();
      }

      _initWindow() {
        let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityView);
        this._facilityViewWindowHtml = $(compiledTemplate());
        $(this._elementIdAnchor).empty();

        this._createHeader();
        this._createFacilityInfo();
        this._createGeneratorList();
      }

      _createHeader() {
        let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityViewHeader);
        let templateParms = {
          facilityName: this._facility.name,
          simpleType: this._facilityType.simpletype
        }

        this._facilityViewHeaderHtml = this._addHtml($(compiledTemplate(templateParms)), this._elementIdFacilityHeader, this._facilityViewWindowHtml);
      }

      _createFacilityInfo() {
        let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityViewInfo);
        let templateParms = {
          facilityType: this._facilityType,
          facility: this._facility,
          company: this._company,
          numGenerators: this._generators.length,
          nameplaceCap: 1000
        }

        this._facilityViewFacilityInfoHtml = this._addHtml($(compiledTemplate(templateParms)), this._elementIdFacilityInfo, this._facilityViewWindowHtml);
      }

      _createGeneratorList() {
        // console.log("this._generators = ", this._generators);
        // console.log("this._generatorTypes = ", this._generatorTypes);

        let compiledTemplate = Handlebars.compile(FacilityViewTmplt.generatorViewList);
        let templateParms = {
          // generators: this._generators,
          // generatorType: this._generatorType
        }

        this._facilityViewGeneratorListHtml = this._addHtml($(compiledTemplate(templateParms)), this._elementIdGeneratorList, this._facilityViewWindowHtml);
      }

      // _createGeneratorList() {
      //   let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilityGeneratorList);
      //   let templateParms = {
      //     generatorList: this._generatorList,
      //     generatorDetails: this._facilityDef.generatorTypes[this._generatorTypeIndex]
      //   }

      //   // https://stackoverflow.com/questions/15088215/handlebars-js-if-block-helper
      //   Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
      //     return ("" + arg1 == "" + arg2) ? options.fn(this) : options.inverse(this);
      //   });

      //   // console.log("templateParms.generatorDetails = ", templateParms.generatorDetails);
      //   this._facilityBuildGeneratorListHtml = $(compiledTemplate(templateParms));
      //   this._facilityBuildGeneratorListHtml = $(this._facilityBuildWindowHtml).find(this._dialogElementId).append(this._facilityBuildGeneratorListHtml);
      // }

      // _createSummary() {
      //   this._calculateSummary();
      //   let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilitySummary);
      //   let templateParms = {
      //     totalCapcity: this._totalCapacityAllocated,
      //     totalCost: this._totalFacilityCost,
      //     totalBuildTime: this._facilityDef.buildTime,
      //     lifeExpectancy: this._facilityDef.lifeExpectancy
      //   }
      //   this._facilityBuildSummaryHtml = $(compiledTemplate(templateParms));
      //   this._facilityBuildSummaryHtml = $(this._facilityBuildWindowHtml).find(this._dialogElementId).append(this._facilityBuildSummaryHtml);
      // }

      // _createButtons() {
      //   let compiledTemplate = Handlebars.compile(FacilityBuildTmplt.facilityConfirmButtons);
      //   let templateParms = {
      //     totalCapcity: 0,
      //     totalCost: this._totalFacilityCost,
      //     totalBuildTime: this._facilityDef.buildTime,
      //     lifeExpectancy: this._facilityDef.lifeExpectancy

      //   }
      //   this._facilityBuildButtonsHtml = $(compiledTemplate(templateParms));
      //   this._facilityBuildButtonsHtml = $(this._facilityBuildWindowHtml).find(this._dialogElementId).append(this._facilityBuildButtonsHtml);
      // }

      _createEvents() {
        $("#" + this._elementIdAnchor).off();
        // $("#" + this._anchorElementId).on("click", this._addGeneratorButtonId, this, this._addGenerator);
        // $("#" + this._anchorElementId).on("click", this._removeGeneratorButtonClass, this, this._removeGenerator);
        // $("#" + this._anchorElementId).on("change", this._selectGeneratorTypeClass, this, this._changeGeneratorType);
        // $("#" + this._anchorElementId).on("change", this._selectGeneratorCapacityClass, this, this._changeGeneratorCapacity);

        // $("#" + this._anchorElementId).on("click", this._backToSelectButtonId, this, this._backButton);
        // $("#" + this._anchorElementId).on("click", this._buildFacilityButtonId, this, this._buildButton);
        // $("#" + this._anchorElementId).on("click", this._cancelFacilityButtonId, this, this._cancelButton);
      }

      _addHtml(html, htmlId, windowHtml) {
        return $(windowHtml).find("#" + htmlId).append(html);
      }


      openDialog() {
        $("#" + this._elementIdAnchor).empty();
        $("#" + this._elementIdAnchor).append(this._facilityViewWindowHtml);

        this._dialog = $("#" + this._elementIdAnchor).dialog({
          //dialogClass: this._closeCSS,
          title: this._title,
          width: this._width,
          height: this._height,
          position: this._position,
          modal: this._isModel
        });

        return new Promise(resolve => {
          this._dialog.on("dialogclose", (evt, ui) => {
            this._dialog.off("dialogclose");
            resolve(null);
          });
        })
      }

      closeDialog() {
        $("#" + this._elementIdAnchor).dialog("close");
        if (this._closeEvent) this._closeEvent(this._closeEventData);
      }



      // Listener event functions.



    });
});