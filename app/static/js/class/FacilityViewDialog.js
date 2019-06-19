define([
  // Libs
  "jquery",
  "jqueryui",
  "EventEmitter",
  "Handlebars",
  "FacilityViewTmplt",
  "Generator",
  "Facility",
  "ModelData",
  "Tabulator",
], function (
  $,
  JQUI,
  EventEmitter,
  Handlebars,
  FacilityViewTmplt,
  Generator,
  Facility,
  ModelData,
  Tabulator) {
    return (
      class FacilityViewDialog {
        constructor(facilityId, facilityTypeId = null) {
          console.log();
          // Dialog 
          this._dialog = null;
          this._facilityId = facilityId;
          this._facilityTypeId = facilityTypeId;
          this._ownedFacility = false;


          // Parameters
          this._width = 750;
          this._height = 650;
          this._unOwnedHeight = 360;
          this._isModel = true;
          this._position = {};
          this._title = "Facility Viewer";
          this._modelsLoaded = false;
          this._facilityModified = false;

          this._genListTable = null;
          this._dialogEvents = new EventEmitter();

          // Element Ids
          this._elementIdAnchor = "facility-dialog";
          this._elementIdDialog = "view-facility-dialog";
          this._elementIdFacilityHeader = "facility-header-window";
          this._elementIdFacilityPic = "facility-powerplant-pic";
          this._elementIdFacilityInfo = "facility-info-window";
          this._elementIdGeneratorListHeader = "generator-list-header";
          this._elementIdGeneratorList = "generator-list-window";
          this._elementIdFacilityFooter = "facility-footer-window";
          this._elementIdGenListTable = "vfd-gen-list-table"

          this._company = null;
          this._facility = null;
          this._generators = null;
          this._generatorTypes = null;
          this._facilityType = null;
          this._powerTypes = null;
          this._resourceTypes = null;

          // Event listener IDs

          // HTML for dialog
          this._facilityViewWindowHtml = "";
          this._facilityViewHeaderHtml = "";
          this._facilityViewPowerPicHtml = "";
          this._facilityViewFacilityInfoHtml = "";
          this._facilityViewGenListHeaderHtml = "";
          this._facilityViewGeneratorListHtml = "";
          this._facilityViewFooterHtml = "";


          // Load all needed data.
          this._modelData = new ModelData();
          this._modelData.getPlayerFacility(facilityId).then((data) => {
            console.log("loaded data = ", data);
            this._ownedFacility = data['owned_facility'];
            this._company = data['company'];
            this._facility = data['facility'];
            this._generators = data['generators'];
            this._modifications = data['modifications'];
            this._facilityType = data['facility_type'];
            this._generatorTypes = data['generator_types'];
            this._powerTypes = data['power_types'];
            this._resourceTypes = data['resource_types'];
            this._modificationTypes = data['modification_types'];
            this._modelsLoaded = true;
            this._initialize();
            this._initWindow();
            return this.openDialog();
          });
        }

        _initialize() {
          // Add extra property to facility type object.
          this._facilityType["simpletype"] = this._facilityType.maintype.split(" ")[0];
          this._facility["new_facility"] = this._facility.state == "new" ? true : false;
          this._facility["company_name"] = this._company.name;


          // Add PowerType and Resource Type record to each generatorType record.
          this._generatorTypes = this._generatorTypes.map(gt => {
            let powerType = this._powerTypes.find(pt => gt.power_type === pt.id)
            let resType = this._resourceTypes.find(rt => gt.resource_type === rt.id)
            gt['pt'] = powerType;
            gt['rt'] = resType;
            return gt;
          });

          // Add Generator Type record to each Generator record. And check if it's a new generator
          this._generators = this._generators.map(g => {
            g['modified'] = false;
            // g['new_generator'] = g.state == "new" ? true : false;
            let gentype = this._generatorTypes.find(gt => g.generator_type === gt.id)
            g['gentype_details'] = gentype;
            return g;
          });

          // Add total nameplace capacity of all available generators to facility object.
          this._facility['total_capacity'] = this._generators.reduce(((g_total, g_curr) => {
            return g_total + (g_curr.state == "available" ? g_curr.gentype_details.nameplate_capacity : 0)
          }), 0);

          console.log('this._generators = ', this._generators);
          console.log("this._facility = ", this._facility)
        }

        _initWindow() {
          // Register Handlebars help that formats floats into currency
          Handlebars.registerHelper('formatCurrency', function (value) {
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          });

          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityView);
          this._facilityViewWindowHtml = $(compiledTemplate());
          $(this._elementIdAnchor).empty();

          this._createTitle();
          this._createFacilityPowerPic();
          this._createFacilityInfo();
          this._createGeneratorListHeader();
          this._createGeneratorList();
          this._createFooter();
        }

        ///////////////////////////////////////////////////////////////
        // HTML template functions

        _createTitle() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityViewHeader);
          let templateParms = {
            facilityName: this._facility.name,
            simpleType: this._facilityType.simpletype
          }

          this._title = $(compiledTemplate(templateParms))[0]
          // console.log("this._title = ", this._title);
        }

        _createFacilityPowerPic() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityFacilityPicture);
          let templateParms = {
            maintype: this._facilityType.maintype,
            simpleType: this._facilityType.simpletype
          }

          this._facilityViewPowerPicHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdFacilityPic, this._facilityViewWindowHtml);
        }

        _createFacilityInfo() {
          console.log("this._modificationTypes = ", this._modificationTypes)
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityViewInfo);
          let templateParms = {
            owned: this._ownedFacility,
            facilityType: this._facilityType,
            facility: this._facility,
            modTypes: this._modificationTypes,
            company: this._company,
            numGenerators: this._generators.length,
            nameplaceCap: 1000
          }

          this._facilityViewFacilityInfoHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdFacilityInfo, this._facilityViewWindowHtml);
        }

        _createGeneratorListHeader() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.generatorListHeader);
          let templateParms = {
            owned: this._ownedFacility
          }
          this._facilityViewGenListHeaderHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdGeneratorListHeader, this._facilityViewWindowHtml);
        }


        _createGeneratorList() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.generatorViewList);
          let templateParms = {
            generators: this._generators,
            facility: this._facility
          }
          this._facilityViewGeneratorListHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdGeneratorList, this._facilityViewWindowHtml);
        }

        _createFooter() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityViewFooter);
          let templateParms = {
            applyOn: false  //this._applyButtonOn
          }

          this._facilityViewFooterHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdFacilityFooter, this._facilityViewWindowHtml);
        }

        _createEvents() {

          $("#" + this._elementIdAnchor).off();
          $("#" + this._elementIdAnchor).on("click", ".selectbox", this._showCheckboxes);
          // $("#" + this._elementIdAnchor).on("click", '.vfd-facility-checkbox', this._setup)
          $("#" + this._elementIdAnchor).on("click", "#vfd-add-gen-btn", this, this._addGenerator);
          // $("#" + this._anchorElementId).on("click", this._addGeneratorButtonId, this, this._addGenerator);
          $("#" + this._elementIdAnchor).on("click", "#vfd-footer-close-btn", this, this._closeDialog);

        }

        _initOnEvents() {
        }

        _addHtml(html, htmlId, windowHtml) {
          return $(windowHtml).find("#" + htmlId).append(html);
        }

        openDialog() {
          $("#" + this._elementIdAnchor).empty();
          $("#" + this._elementIdAnchor).append(this._facilityViewWindowHtml);

          this._dialog = $("#" + this._elementIdAnchor).dialog({
            //dialogClass: this._closeCSS,
            // title: this._title,
            scope: this,
            owned: this._ownedFacility,
            autoOpen: false,
            width: this._width,
            height: this._ownedFacility ? this._height : this._unOwnedHeight,
            position: this._position,
            modal: this._isModel,
            beforeClose: (evt) => {
              if (this._facilityModified) {
                this._openVerifyDialog(this);
                return false;
              }
            }
          });

          // Allow HTML in the Title bar.
          this._dialog.parent().find('.ui-dialog-title').html(this._title);

          $(this._dialog).on("dialogopen", (evt) => {
            if ($(evt.target).dialog("option", "owned")) {
              this._generatorListTable = this._generatorListTable();
              // console.log("this._generatorListTable = ", this._generatorListTable);
            }
            this._createEvents();
          });

          $(this._dialog).dialog("open");
        }

        _closeDialog(evt) {
          let dialog = evt.data._dialog;
          $(dialog).dialog("close");
        }

        _openVerifyDialog(scope) {
          let verifyDialog = $("#vfd-verify-dialog").dialog({
            dialogClass: ".no-close",
            autoOpen: false,
            title: "Warning: facility changes will be lost.",
            width: 400,
            height: 275,
            position: {},
            closeOnEscape: false,
            modal: true,
            buttons: [
              {
                text: "Yes",
                click: function () {
                  scope._facilityModified = false;
                  $("#vfd-verify-dialog-content").empty();
                  $(scope._dialog).dialog("close");
                  $(this).dialog("close");
                }
              },
              {
                text: "No",
                click: function () {
                  $("#vfd-verify-dialog-content").empty();
                  $(this).dialog("close");
                }
              }
            ]
          });

          $(verifyDialog).on("dialogopen", (evt, ui) => {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            this._addHtml(FacilityViewTmplt.verifyDialog, "vfd-verify-dialog-content", "#vfd-verify-dialog");
          });

          $(verifyDialog).dialog("open");
        }



        //////////////////////////////////////////////////////////////////////////
        // Create the generator list table

        _generatorListTable() {
          const generator_table_data = [];
          // console.log("this._generators = ", this._generators);
          this._generators.forEach((gen, index) => {
            let profit = "rgb(255, 0, 0)" //getProfit(gen);
            let age = "rgb(250, 218, 94)" //getAge(gen);
            let value = "rgb(0, 255, 0)" //getValue(gen);

            let profitColor = profit.color;
            let ageColor = age.color;
            let valueColor = value.color;

            generator_table_data.push({
              id: gen.id,
              check: false,
              name: "gen " + this._padZeroes((index + 1), 2),
              cap: gen.gentype_details.nameplate_capacity,
              prof: profit,
              age: age,
              value: value,
              bidp: "MC",
              maintp: "routine",
              state: gen.state
            });
          })

          const generatorTableDef = {
            height: 250,
            layout: "fitDataFill",
            data: generator_table_data,
            groupBy: ["state"],
            columns: [
              {
                title: "", field: "check", align: "center", headerSort: false, width: 20,
                formatter: this._checkbox_cell,
                onRendered: () => { console.log("checkbox rendered") },
                formatterParams: {

                }
              },
              { title: "Name", field: "name", width: 75 },
              {
                title: "Capacity", field: "cap", width: 120, align: "center",
                formatter: this._capacity_cell,
                onRendered: () => { console.log("capacity rendered") },
                formatterParams: {
                  gen_types: this._generatorTypes
                }
              },
              { title: "Profit", field: "prof", formatter: "color" },
              { title: "Age", field: "age", formatter: "color" },
              { title: "Value", field: "value", formatter: "color" },
              { title: "Bid Policy", field: "bidp" },
              { title: "Maint Policy", field: "maintp" },
              { title: "State", field: "state", visible: false }
            ]
          }

          return new Tabulator("#" + this._elementIdGenListTable, generatorTableDef);
        }

        //////////////////////////////////////////////////////////////////////////
        // Custom Generator Column Formatters

        _capacity_cell(cell, formatterParams) {
          let html = ""

          if (cell.getData().state == "new") {
            let templateParms = {
              genTypes: formatterParams.gen_types
            }
            html = Handlebars.compile(FacilityViewTmplt.selectCapacity)(templateParms);
          }
          else {
            html = `<label> ${cell.getValue()} MW </label>`;
          }

          return html;
        }

        _checkbox_cell(cell, formatterParams) {
          let html = ""

          if (cell.getData().state == "new") {
            html = `<button class="vfd-remove-gen-button"> - </button>`
          }
          else {
            html = `<input type='checkbox' class='generator-list-checkbox'>`
          }

          return html
        }

        _color_cell() {

        }




        //////////////////////////////////////////////////////////////////////////
        // Generator List Table methods
        _addGenerator(evt) {
          let scope = evt.data;
          console.log("_addGenerator()...", scope);
          scope._facilityModified = true;
          scope._setApply();

          let newGen = {
            "state": "new",
            "name": "gen " + scope._padZeroes((scope._generators.length + 1), 2),
            "cap": 0,
            "profit": 0,
            "age": 0,
            "value": 0,
            "bidp": "N/A",
            "maintp": "N/A",
            "modified": true,
            "id_type": scope._generatorTypes[0],
            "id_facility": scope._facilityId,
            "state_note": "under construction"
          }
          let genRow = scope._generatorListTable.rowManager.rows.find(row => row.getData().state === "available");
          genRow.getGroup().hide();
          let newGenRow = scope._generatorListTable.addRow(newGen).then((row) => row.scrollTo());

          console.log("this._generatorListTable = ", scope._generatorListTable);
          scope._generators.push(newGen);
        }


        getProfit(generator) {
          let profit = generator.revenue - generator.om_cost;
          let color = "rgb(255, 0, 0)";
          if (profit >= 250 && profiit <= 1000) color = "rgb(250, 218, 94)";
          else if (profit > 1000) color = "rgb(0,255,0)";

          return ({
            profit: profit,
            color: color
          });
        }

        getAge(generator) {
          let profit = generator.revenue - generator.om_cost;
          let color = "rgb(255, 0, 0)";
          if (profit >= 250 && profiit <= 1000) color = "rgb(250, 218, 94)";
          else if (profit > 1000) color = "rgb(0,255,0)";

          return ({
            profit: profit,
            color: color
          });
        }

        getValue(generator) {
          let profit = generator.revenue - generator.om_cost;
          let color = "rgb(255, 0, 0)";
          if (profit >= 250 && profiit <= 1000) color = "rgb(250, 218, 94)";
          else if (profit > 1000) color = "rgb(0,255,0)";

          return ({
            profit: profit,
            color: color
          });
        }

        _setApply(enable = true) {
          let btn = $(this._dialog).find("#vfd-footer-apply-btn");
          if (enable)
            $(btn).removeAttr("disabled");
          else
            $(btn).attr("disabled", "true");
        }


        //////////////////////////////////////////////////////////////////////////
        // Listener event functions.

        _showCheckboxes() {
          let checkboxes = $("#vfd-facility-checkboxes");

          if ($(checkboxes).attr("expanded") == "false") {
            $(checkboxes).css("display", "block");
            $(checkboxes).attr("expanded", "true");
          }
          else {
            $(checkboxes).css("display", "none");
            $(checkboxes).attr("expanded", "false");
          }
        }


        //////////////////////////////////////////////////////////////////////////
        // Misc methods

        // Add leading zeroes
        _padZeroes(num, size) {
          return (("000000000" + num).substr((-size)));
        }
      });
  });










  //   // https://stackoverflow.com/questions/15088215/handlebars-js-if-block-helper
      //   Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
      //     return ("" + arg1 == "" + arg2) ? options.fn(this) : options.inverse(this);
      //   });