define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "evtEmitter",
  "FacilityViewTmplt",
  "Generator",
  "Facility",
  "ModelData",
  "Tabulator",
], function (
  $,
  JQUI,
  Handlebars,
  evtEmitter,
  FacilityViewTmplt,
  Generator,
  Facility,
  ModelData,
  Tabulator) {
    return (
      class FacilityViewDialog {
        constructor(facilityId, facilityTypeList = null, closeHandler = null) {
          console.log("facilityTypeList =", facilityTypeList);
          // Dialog 
          this._dialog = null;
          this._facilityId = facilityId;
          this._facilityTypeList = facilityTypeList;
          this._ownedFacility = false;
          this._closeHandler = closeHandler;
          this._deleteFacility = false;
          this._newFacility = false;
          this._selectFacilityType = false;

          // Parameters
          this._width = 750;
          this._height = 650;
          this._unOwnedHeight = 360;
          this._isModel = true;
          this._position = {};
          this._title = "Facility Viewer";
          this._facilityModified = facilityTypeList ? true : false;
          this._genListTable = null;
          this._qtrsPerYear = 4;


          // Element Ids
          this._elementIdAnchor = "facility-view-dialog";
          this._elementIdDialog = "view-facility-dialog";
          this._elementIdFacilityHeader = "facility-header-window";
          this._elementIdFacilityPic = "facility-powerplant-pic";
          this._elementIdFacilityInfo = "facility-info-window";
          this._elementIdGeneratorListHeader = "generator-list-header";
          this._elementIdGeneratorList = "generator-list-window";
          this._elementIdFacilityFooter = "facility-footer-window";
          this._elementIdGenListTable = "vfd-gen-list-table"

          this._currentDate = null;
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

          Promise.all([
            this._modelData.getCurrentDate(),
            this._modelData.getPlayerFacility(facilityId)
          ]).then((data) => {
            // console.log("loaded data = ", data);
            this._currentDate = data[0]['currentDate'];
            return data;
          }).then((data) => {
            // console.log("loaded data = ", data);
            let fdata = data[1];
            this._ownedFacility = fdata['owned_facility'];
            this._company = fdata['company'];
            this._facility = fdata['facility'];
            this._generators = fdata['generators'];
            this._modifications = fdata['modifications'];
            this._facilityType = fdata['facility_type'];
            this._generatorTypes = fdata['generator_types'];
            this._powerTypes = fdata['power_types'];
            this._resourceTypes = fdata['resource_types'];
            this._modificationTypes = fdata['modification_types'];

            this._newFacility = this._facility.state == "new" ? true : false;
            if (this._newFacility)
              this._setBack();

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

          // console.log('this._generators = ', this._generators);
          // console.log("this._facility = ", this._facility)
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
            applyOn: this._facilityModified
          }

          this._facilityViewFooterHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdFacilityFooter, this._facilityViewWindowHtml);
        }


        //////////////////////////////////////////////////////////////////////////
        // Init event listener functions.

        _createEvents() {

          $("#" + this._elementIdAnchor).off();
          $("#" + this._elementIdAnchor).on("click", ".selectbox", this._showCheckboxes);
          // $("#" + this._elementIdAnchor).on("click", '.vfd-facility-checkbox', this._setup)
          $("#" + this._elementIdAnchor).on("click", "#vfd-add-gen-btn", this, this._addGenerator);

          $("#" + this._elementIdAnchor).on("click", "#vfd-footer-apply-btn", this, this._applyUpdates);
          $("#" + this._elementIdAnchor).on("click", "#vfd-footer-close-btn", this, this._closeDialog);
          $("#" + this._elementIdAnchor).on("click", "#vfd-footer-back-btn", this, this._backToSelect);
        }

        //////////////////////////////////////////////////////////////////////////
        // Listener event functions.

        _backToSelect() {
          let scope = evt.data;
          this._backToSelect = true;
          this._openVerifyDialog(scope, (scope) => {
            evtEmitter.emit("changefacility", {
              facilityId: this._facilityId,
              facilityTypeList: this._facilityTypeList
            });
          });

          $("#vfd-footer-close-btn").click();
        }

        _applyUpdates() {

        }

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

        _initOnEvents() {
        }


        //////////////////////////////////////////////////////////////////////////
        // Opening and Closing the dialog 
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
          this._dialog.parent().find('.ui-dialog-title').css("z-index", "1000");
          this._dialog.parent().find('.ui-dialog-title').html(this._title);

          $(this._dialog).on("dialogopen", (evt) => {
            if ($(evt.target).dialog("option", "owned")) {
              this._generatorListTable = this._generatorListTable();
              // console.log("this._generatorListTable = ", this._generatorListTable);
            }
            this._createEvents();
          });

          $(this._dialog).dialog("open");

          $(this._dialog).on("dialogclose", this, (evt, ui) => {
            if (this._closeHandler) {
              this._closeHandler(evt);
            }
            if (this._deleteFacility) {
              console.log("delete facility. id = ", this._facilityId);
              evtEmitter.emit("deletefacility", {
                facilityId: this._facilityId
              });
            }
            $("#" + this._elementIdAnchor).empty();
          });
        }

        _closeDialog(evt) {
          let dialog = evt.data._dialog;
          $(dialog).dialog("close");
        }

        _openVerifyDialog(scope, closeFunction = null) {
          $("#vfd-verify-dialog").empty()
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
                click: function (evt) {
                  console.log("clicked yes...");
                  scope._facilityModified = false;
                  scope._deleteFacility = true;
                  // $("#vfd-verify-dialog").empty();
                  $(this).dialog("close");
                  $(scope._dialog).dialog("close");
                  if (closeFunction) closeFunction(scope)
                  // $(this).dialog.empty();
                }
              },
              {
                text: "No",
                click: function (evt) {
                  // $("#vfd-verify-dialog").empty();
                  $(this).dialog("close");
                }
              }
            ]
          });

          $(verifyDialog).on("dialogopen", (evt, ui) => {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            if (this._newFacility)
              this._addHtml(FacilityViewTmplt.verifyNewDialog, "vfd-verify-dialog-content", "#vfd-verify-dialog");
            else
              this._addHtml(FacilityViewTmplt.verifyChangeDialog, "vfd-verify-dialog-content", "#vfd-verify-dialog");
          });

          $(verifyDialog).dialog("open");

        }

        //////////////////////////////////////////////////////////////////////////
        // Misc methods

        // Add leading zeroes
        _padZeroes(num, size) {
          return (("000000000" + num).substr((-size)));
        }

        _addHtml(html, htmlId, windowHtml) {
          return $(windowHtml).find("#" + htmlId).append(html);
        }

        _setBack(enable = true) {
          let btn = $(this._dialog).find("#vfd-footer-back-btn");
          if (enable)
            $(btn).removeAttr("disabled");
          else
            $(btn).attr("disabled", "true");
        }

        _setApply(enable = true) {
          let btn = $(this._dialog).find("#vfd-footer-apply-btn");
          if (enable)
            $(btn).removeAttr("disabled");
          else
            $(btn).attr("disabled", "true");
        }



        //////////////////////////////////////////////////////////////////////////
        //
        // Generator list table functions 
        //
        //////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////
        // Create the generator list table

        _generatorListTable() {
          const generator_table_data = [];
          // console.log("this._generators = ", this._generators);
          this._generators.forEach((gen, index) => {
            let profit = "rgb(255, 0, 0)" //getProfit(gen);
            let condition = "rgb(250, 218, 94)" //getCondition(gen);
            let age = this._getAge(gen).color;

            let profitColor = profit.color;
            let conditionColor = condition.color;
            let ageColor = age.color;

            generator_table_data.push({
              id: gen.id,
              name: "generator" + this._padZeroes((index + 1), 2),
              cap: gen.gentype_details.nameplate_capacity,
              prof: profit,
              age: age,
              cond: condition,
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
              { title: "Name", field: "name", width: 100, align: "right" },
              {
                title: "Capacity", field: "cap", width: 120, align: "center",
                formatter: this._capacity_cell,
                onRendered: () => { console.log("capacity rendered") },
                formatterParams: {
                  gen_types: this._generatorTypes
                }
              },
              { title: "Profit", field: "prof", formatter: "color", width: 80 },
              { title: "Age", field: "age", formatter: "color", width: 80 },
              { title: "Condition", field: "cond", formatter: "color", width: 80 },

              { title: "Bid Policy", field: "bidp", align: "center" },
              { title: "Maint Policy", field: "maintp", align: "center" },
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

        _getAge(generator) {
          console.log("generator = ", generator);
          let currentQtrs = ((this._currentDate.current_year - 1) * this._qtrsPerYear) + this._currentDate.current_quarter
          // startQtrs = (parseInt(generator.start_prod_dategenerator.substr(2, 4)) - 1) * this._qtrsPerYear) + 0))

          return {
            color: "rgb(0, 255, 0)",
            age: 20
          }
        }
        // let profit = generator.revenue - generator.om_cost;
        // let color = "rgb(255, 0, 0)";
        // if (profit >= 250 && profiit <= 1000) color = "rgb(250, 218, 94)";
        // else if (profit > 1000) color = "rgb(0,255,0)";

        // return ({
        //   profit: profit,
        //   color: color
        // });


        //     _getValue(generator) {
        //     let profit = generator.revenue - generator.om_cost;
        //     let color = "rgb(255, 0, 0)";
        //     if(profit >= 250 && profiit <= 1000) color = "rgb(250, 218, 94)";
        //           else if (profit > 1000) color = "rgb(0,255,0)";

        // return ({
        //   profit: profit,
        //   color: color
        // });
        //         }
        //         //////////////////////////////////////////////////////////////////////////
        //         //
        //         // End of Generator list table functions 
        //         //
        //         //////////////////////////////////////////////////////////////////////////

      });
  });










  //   // https://stackoverflow.com/questions/15088215/handlebars-js-if-block-helper
      //   Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
      //     return ("" + arg1 == "" + arg2) ? options.fn(this) : options.inverse(this);
      //   });