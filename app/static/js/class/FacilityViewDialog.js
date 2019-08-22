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
          this._width = 850;
          this._height = 650;
          this._unOwnedHeight = 360;
          this._isModel = true;
          this._position = {};
          this._title = "Facility Viewer";
          this._facilityModified = false;
          this._facilityPreviousSelected = facilityTypeList ? true : false;
          this._decomissionFacilityOn = false;
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
          this._generatorStateList = ["new", "building", "paused", "available", "unavailable", "decommissioning", "decommissioned"];
          this._bidPolicyOptions = ["Company Wide", "MC", "LCOE", "Fixed"];
          this._maintPolicyOptions = ["Company Wide", "Routine", "Proactive", "Reactive"];

          this._updatedFacility = {};
          this._updatedGenerator = {};
          this._updatedGenerators = [];

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

        /* *********************************************************************************** */
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

        /* *********************************************************************************** */
        _initWindow() {
          // Register Handlebars helper that formats floats into currency
          Handlebars.registerHelper('formatCurrency', function (value) {
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          });

          // Register Handlebars helper that allows mimics if-block
          // https://stackoverflow.com/questions/15088215/handlebars-js-if-block-helper
          Handlebars.registerHelper('if_eq', function (arg1, arg2, options) {
            return ("" + arg1 == "" + arg2) ? options.fn(this) : options.inverse(this);
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

        /* *********************************************************************************** */
        _createTitle() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityViewHeader);
          let templateParms = {
            owned: this._ownedFacility,
            fid: this._facility.id,
            facilityName: this._facility.name,
            simpleType: this._facilityType.simpletype
          }

          this._title = $(compiledTemplate(templateParms))[0]
          // console.log("this._title = ", this._title);
        }

        /* *********************************************************************************** */
        _createFacilityPowerPic() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityFacilityPicture);
          let templateParms = {
            maintype: this._facilityType.maintype,
            simpleType: this._facilityType.simpletype
          }

          this._facilityViewPowerPicHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdFacilityPic, this._facilityViewWindowHtml);
        }

        /* *********************************************************************************** */
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

        /* *********************************************************************************** */
        _createGeneratorListHeader() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.generatorListHeader);
          let templateParms = {
            owned: this._ownedFacility,
            oldFacility: !this._newFacility
          }
          this._facilityViewGenListHeaderHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdGeneratorListHeader, this._facilityViewWindowHtml);
        }


        /* *********************************************************************************** */
        _createGeneratorList() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.generatorViewList);
          let templateParms = {
            generators: this._generators,
            facility: this._facility
          }
          this._facilityViewGeneratorListHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdGeneratorList, this._facilityViewWindowHtml);
        }

        /* *********************************************************************************** */
        _createFooter() {
          let compiledTemplate = Handlebars.compile(FacilityViewTmplt.facilityViewFooter);
          let templateParms = {
            facilityOwned: this._ownedFacility,
            facilitySelected: this._facilityPreviousSelected,
            state: this._facility.state
          }

          this._facilityViewFooterHtml = this._addHtml($(compiledTemplate(templateParms)),
            this._elementIdFacilityFooter, this._facilityViewWindowHtml);
        }


        /////////////////////////////////////////////////////////////////////////////////////////
        // Init event listener functions.

        /* *********************************************************************************** */
        _createEvents() {
          $("#" + this._elementIdAnchor).off();

          // $("#" + this._elementIdAnchor).on("click", ".selectbox", this._showCheckboxes);
          // $("#" + this._elementIdAnchor).on("click", '.vfd-facility-checkbox', this._setup)

          $("#" + this._elementIdAnchor).on("click", "#vfd-add-gen-btn", this, this._addGeneratorClick);
          $("#" + this._elementIdAnchor).on("click", "#vfd-sub-gen-btn", this, this._subGeneratorClick);

          $("#" + this._elementIdAnchor).on("click", "#vfd-footer-apply-btn", this, this._applyUpdates);
          $("#" + this._elementIdAnchor).on("click", "#vfd-footer-close-btn", this, this._closeDialog);
          $("#" + this._elementIdAnchor).on("click", "#vfd-footer-back-btn", this, this._backToSelect);
          $("#" + this._elementIdAnchor).on("click", "#vfd-footer-remove-btn", this, this._removeFacility);

          $("#vfd-facility-name-input").change(this, this._editFacilityName);

          this._createTableEvents();
        }

        /* *********************************************************************************** */
        _deleteEvents() {

        }

        /* *********************************************************************************** */
        _createTableEvents() {
          $(".vfd-generator-name").on("click", this, this._generatorNameAction);
          $(".capacity-selectbox").on("change", this, this._capacityOptionChange);
          $(".bidpolicy-selectbox").on("change", this, this._bidPolicyOptionChange);
          $(".maintpolicy-selectbox").on("change", this, this._maintPolicyOptionChange);
        }

        /* *********************************************************************************** */
        _deleteTableEvents() {

        }


        //////////////////////////////////////////////////////////////////////////
        // Listener event functions.

        /* *********************************************************************************** */
        // Generator Header button (add and decomission) events
        /* *********************************************************************************** */
        _addGeneratorClick(evt) {
          let scope = evt.data;
          scope._addGenerator(scope);
        }

        /* *********************************************************************************** */
        _subGeneratorClick(evt) {
          let scope = evt.data;
          let generatorLinks = $(".generator-name-link[state='available']");

          scope._decomissionFacilityOn = !scope._decomissionFacilityOn;

          if (scope._decomissionFacilityOn) {
            $(evt.target).addClass("down");
            $(".vfd-gen-list-header").toggleClass("list-color decom-color");
            $(".gen-header-detail.list").hide();
            $(".gen-header-detail.decom").show();
          }
          else {
            $(evt.target).removeClass("down");
            $(".vfd-gen-list-header").toggleClass("list-color decom-color");
            $(".gen-header-detail.list").show();
            $(".gen-header-detail.decom").hide();
          }

          console.log("generatorLinks = ", scope._decomissionFacilityOn, generatorLinks);
        }

        /* *********************************************************************************** */
        // Generator list events
        /* *********************************************************************************** */
        _generatorNameAction(evt) {
          let scope = evt.data;
          let link = evt.currentTarget.firstElementChild;
          let action = $(link).attr("action");
          let genId = $(link).attr("gid");

          switch (action) {
            case "details":
              scope._openGeneratorDialog("test", 1, genId, scope)
              break;
            case "remove":
              scope._delGenerator(genId, scope)
              break;
            case "decomission":
              scope._decomissionGenerator(genId, scope)
              break
          }
          console.log("testing", link, genId)

          // let genTable = scope._generatorListTable();

        }

        /* *********************************************************************************** */
        _capacityOptionChange(evt) {
          let scope = evt.data
          let genId = $("select", this).first().attr("genid");
          let genTypeId = $("option:selected", this).first().attr("gtid");
          let genIndex = scope._updatedGenerators.findIndex(gen => gen.id == genId)

          if (genIndex > -1)
            scope._updatedGenerators[genIndex]['id_type'] = genTypeId;
          else
            scope._updatedGenerators.push({ 'id': genId, 'id_type': genTypeId });

          console.log("_capacityOptionChange(): ", genId, genTypeId, scope._updatedGenerators);
          scope._turnOnApply(scope);
        }

        /* *********************************************************************************** */
        _bidPolicyOptionChange(evt) {
          let scope = evt.data
          let genId = $("select", this).first().attr("genid");
          let value = $("option:selected", this).first().val();
          let genIndex = scope._updatedGenerators.findIndex(gen => gen.id == genId)

          if (genIndex > -1)
            scope._updatedGenerators[genIndex]['local_bid_policy'] = value;
          else
            scope._updatedGenerators.push({ 'id': genId, 'local_bid_policy': value });

          console.log("_bidPolicyOptionChange(): ", genId, value, scope._updatedGenerators);
          scope._turnOnApply(scope);
        }

        /* *********************************************************************************** */
        _maintPolicyOptionChange(evt) {
          let scope = evt.data
          let genId = $("select", this).first().attr("genid");
          let value = $("option:selected", this).first().val();
          let genIndex = scope._updatedGenerators.findIndex(gen => gen.id == genId)

          if (genIndex > -1)
            scope._updatedGenerators[genIndex]['local_maintenance_policy'] = value;
          else
            scope._updatedGenerators.push({ 'id': genId, 'local_maintnenace_policy': value });

          console.log("_maintPolicyOptionChange(): ", genId, value, scope._updatedGenerators);
          scope._turnOnApply(scope);
        }

        /* *********************************************************************************** */
        _applyUpdates(evt) {
          let scope = evt.data;
          console.log("_updatedFacility", scope._updatedFacility);

          if (scope._updatedFacility !== {}) {
            scope._modelData.updateFacility(scope._facilityId, scope._updatedFacility).then((facility) => {
              console.log("_applyUpdates() Facility was updated", facility);
              scope._updatedFacility = {};
            })
          }

          if (scope._updatedGenerators !== []) {
            scope._modelData.updateGenerators(scope._facilityId, scope._updatedGenerators).then((generators) => {
              console.log("_applyUpdates() Generators were updated", generators);
              scope._updatedGenerators = [];
            })
          }

          scope._turnOffApply(scope)
        }

        /* *********************************************************************************** */
        // Footer button events...
        /* *********************************************************************************** */
        _closeDialog(evt) {
          let scope = evt.data
          let msgType = scope._facilityModified ? "mod" : "none";

          scope._openVerifyDialog(msgType, scope)
        }

        /* *********************************************************************************** */
        _backToSelect(evt) {
          let scope = evt.data;
          let msgType = scope._facilityPreviousSelected ? "mod" : "none";

          scope._openVerifyDialog(msgType, scope, (scope) => {
            evtEmitter.emit("changefacility", {
              facilityId: scope._facilityId,
              facilityTypeList: scope._facilityTypeList
            });
          });
        }

        /* *********************************************************************************** */
        _removeFacility(evt) {
          let scope = evt.data;

          scope._openVerifyDialog("del", scope, (scope) => {
            console.log("delete facility. id = ", scope._facilityId);
            evtEmitter.emit("deletefacility", {
              facilityId: scope._facilityId
            });
          });
        }

        /* *********************************************************************************** */
        // _showCheckboxes() {
        //   let checkboxes = $("#vfd-facility-checkboxes");

        //   if ($(checkboxes).attr("expanded") == "false") {
        //     $(checkboxes).css("display", "block");
        //     $(checkboxes).attr("expanded", "true");
        //   }
        //   else {
        //     $(checkboxes).css("display", "none");
        //     $(checkboxes).attr("expanded", "false");
        //   }
        // }



        /* *********************************************************************************** */
        _editFacilityName(evt) {
          let scope = evt.data;
          let facilityName = evt.currentTarget.value.trim();
          let fid = $(evt.currentTarget).attr("fid");

          if (facilityName == "") {
            evt.currentTarget.value = scope._updatedFacility['name'];
            console.log("_editFacilityName bad facility name change", scope._updatedFacility);
          }
          else {
            scope._updatedFacility['id'] = fid;
            scope._updatedFacility['name'] = facilityName;
            evt.currentTarget.value = scope._updatedFacility['name']
            scope._turnOnApply(scope);
            console.log("_editFacilityName: good facility name change", scope._updatedFacility);
          }
          $(':focus').blur();
        }

        /* *********************************************************************************** */

        // _updateFacilityObject(source, target) {
        //   let properties = Object.getOwnPropertyNames(source);
        //   properties.forEach((property) => {
        //     if (!target[property])
        //       Object.assign(target, 
        //   });

        // }


        //////////////////////////////////////////////////////////////////////////
        // Opening and Closing the dialog 

        /* *********************************************************************************** */
        openDialog() {
          $("#" + this._elementIdAnchor).empty();
          $("#" + this._elementIdAnchor).append(this._facilityViewWindowHtml);

          this._dialog = $("#" + this._elementIdAnchor).dialog({
            scope: this,
            owned: this._ownedFacility,
            autoOpen: false,
            closeOnEscape: false,

            // Stuff to do after dialog is opened...
            open: (evt, ui) => {
              // Hide 'X' button
              $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();

              // add <input type=text> to title bar. We have to do it after dialog is created
              // or user wont be able to left click text box for focus.
              $('.ui-dialog-titlebar').after(this._title);

              // Show the generator list if the facility is owned or has been created by the player.
              if (this._ownedFacility) {
                this._generatorListTable = this._generatorListTable();
              }

              // Setup Listener events
              this._createEvents();
            },
            width: this._width,
            height: this._ownedFacility ? this._height : this._unOwnedHeight,

            position: this._position,
            resizable: false,
            modal: this._isModel,

            // Before the dialog closes we need to remove the input textbox we added in the 
            // open listener.
            beforeClose: (evt) => {
              $('.vfd-title').remove();
            },

            // After the dialog box closes remove all elements within. Call the close handler function 
            // if one was provided.
            close: (evt, ui) => {
              $("#" + this._elementIdAnchor).empty();
              if (this._closeHandler) {
                this._closeHandler(evt);
              }
            }
          });

          $(this._dialog).dialog("open");
        }

        /* *********************************************************************************** */
        _openVerifyDialog(msgType, scope, closeFunction = null) {
          let htmlWarning = ""

          if (msgType == "del")
            htmlWarning = Handlebars.compile(FacilityViewTmplt.verifyNewDialog)();
          else if (msgType == "mod")
            htmlWarning = Handlebars.compile(FacilityViewTmplt.verifyChangeDialog)();
          else {
            $(scope._dialog).dialog("close");
            return
          }

          $("#vfd-verify-dialog").empty()
          $("#vfd-verify-dialog").append(htmlWarning);
          let verifyDialog = $("#vfd-verify-dialog").dialog({
            scope: scope,
            dialogClass: ".no-close",
            autoOpen: false,
            open: (evt, ui) => {
              $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
              $('.vfd-title').hide();
            },
            close: (evt, ui) => {
              $('.vfd-title').show();
            },
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
                  $(this).dialog("close")
                  if (closeFunction)
                    closeFunction(scope)
                  $(scope._dialog).dialog("close");
                }
              },
              {
                text: "No",
                click: function (evt) {
                  $(this).dialog("close");
                }
              }
            ]
          });

          $(verifyDialog).dialog("open");
        }

        /* *********************************************************************************** */
        _openGeneratorDialog(facilityName, genNumber, genId, scope, closeFunction = null) {
          this._modelData.getGeneratorDetailHtml(genId).then((html) => {
            $("#vfd-generator-dialog").empty()
            $("#vfd-generator-dialog").append(html)

            let generatorDialog = $("#vfd-generator-dialog").dialog({
              scope: scope,
              title: "Generator #" + genNumber + " for facility: " + facilityName,
              width: 500,
              height: 500,
              position: {},
              modal: true,
              open: (evt, ui) => {
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                $('.vfd-title').hide();
              },
              close: (evt, ui) => {
                $('.vfd-title').show();
              },
              buttons: [
                {
                  text: "Close",
                  click: function (evt) {
                    $(this).dialog("close")
                    if (closeFunction)
                      closeFunction(scope)
                  }
                }
              ]
            })
          });
        }

        /* *********************************************************************************** */
        _openMessageDialog(scope, msg, closeFunction = null) {
          let html = Handlebars.compile(FacilityViewTmplt.infoMessageDialog)({
            msg: msg
          });

          $("#vfd-info-message-dialog").empty()
          $("#vfd-info-message-dialog").append(html)

          let infoMessageDialog = $("#vfd-info-message-dialog").dialog({
            scope: scope,
            title: "Warning",
            width: 300,
            position: {},
            modal: true,
            open: (evt, ui) => {
              $('.vfd-title').hide();
            },
            close: (evt, ui) => {
              $('.vfd-title').show();
            },
            buttons: [
              {
                text: "OK",
                click: function (evt) {
                  $(this).dialog("close")
                  if (closeFunction)
                    closeFunction(scope)
                }
              }
            ]
          })
        }



        //////////////////////////////////////////////////////////////////////////
        // Misc methods

        /* *********************************************************************************** */
        // Add leading zeroes
        _padZeroes(num, size) {
          return (("000000000" + num).substr((-size)));
        }

        /* *********************************************************************************** */
        _addHtml(html, htmlId, windowHtml) {
          return $(windowHtml).find("#" + htmlId).append(html);
        }

        /* *********************************************************************************** */
        _setBack(enable = true) {
          let btn = $(this._dialog).find("#vfd-footer-back-btn");
          if (enable)
            $(btn).removeAttr("disabled");
          else
            $(btn).attr("disabled", "true");
        }

        /* *********************************************************************************** */
        _turnOnApply(scope) {
          $("#vfd-footer-apply-btn").prop("disabled", false);
          scope._facilityModified = true;
        }

        _turnOnDecomish(scope) {
          scope._decomissionFacilityOn = true;
        }

        /* *********************************************************************************** */
        _turnOffApply(scope) {
          $("#vfd-footer-apply-btn").prop("disabled", true);
          scope._facilityModified = false;
        }

        _turnOffDecomish(scope) {
          scope._decomissionFacilityOn = false;
        }

        //////////////////////////////////////////////////////////////////////////
        //
        // Generator list table functions 
        //
        //////////////////////////////////////////////////////////////////////////


        //////////////////////////////////////////////////////////////////////////
        // Create the generator list table
        /* *********************************************************************************** */
        _generatorListTable() {
          const generator_table_data = [];
          console.log("_generatorListTable() this._generators = ", this._generators);
          this._generators.forEach((gen, index) => {
            let profit = "rgb(255, 0, 0)" //getProfit(gen);
            let condition = "rgb(250, 218, 94)" //getCondition(gen);
            let age = this._getAge(gen).color;

            let profitColor = profit.color;
            let conditionColor = condition.color;
            let ageColor = age.color;

            generator_table_data.push({
              fid: gen.id_facility,
              id: gen.id,
              name: "generator " + this._padZeroes((index + 1), 2),
              cap: gen.gentype_details.nameplate_capacity,
              prof: profit,
              age: age,
              cond: condition,
              bidp: gen.local_bid_policy,
              maintp: gen.local_maint_policy,
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
                title: "Name", field: "name", width: 110, align: "center",
                formatter: this._name_cell,
                // onRendered: () => { console.log("capacity rendered") },
                formatterParams: {
                  scope: this
                },
              },
              {
                title: "Capacity", field: "cap", align: "center",
                formatter: this._capacity_cell,
                // onRendered: () => { console.log("capacity rendered") },
                formatterParams: {
                  gen_types: this._generatorTypes
                }
              },
              {
                title: "Profit", field: "prof", width: 80,
                formatter: this._profit_cell,
                formatterParams: {
                  scope: this
                }
              },
              {
                title: "Age", field: "age", width: 80,
                formatter: this._age_cell,
                formatterParams: {
                  scope: this
                }
              },
              {
                title: "Condition", field: "cond", width: 100,
                formatter: this._condition_cell,
                formatterParams: {
                  scope: this
                }
              },
              {
                title: "Bid Policy", field: "bidp", align: "center",
                formatter: this._bidPolicy_cell,
                // onRendered: () => { console.log("bid policy rendered") },
                formatterParams: {
                  bidPolicyOptions: this._bidPolicyOptions
                }
              },
              {
                title: "Maint Policy", field: "maintp", align: "center",
                formatter: this._maintPolicy_cell,
                formatterParams: {
                  maintPolicyOptions: this._maintPolicyOptions
                }
              },
              { title: "State", field: "state", visible: false }
            ]
          }

          return new Tabulator("#" + this._elementIdGenListTable, generatorTableDef);
        }

        //////////////////////////////////////////////////////////////////////////
        // Custom Generator Column Formatters

        /* *********************************************************************************** */
        _name_cell(cell, formatterParams) {
          let scope = formatterParams.scope;
          let templateParms = {
            state: cell.getData().state,
            name: cell.getValue(),
            fid: cell.getData().fid,
            gid: cell.getData().id,
            decom_on: scope._decomissionFacilityOn,
            action: scope._checkAction(cell.getData().state, scope)
          }
          let html = Handlebars.compile(FacilityViewTmplt.generatorNameLink)(templateParms);

          return html;
        }
        _capacity_cell(cell, formatterParams) {
          let html = ""

          if (cell.getData().state == "new") {
            let templateParms = {
              genId: cell.getData().id,
              genTypes: formatterParams.gen_types,
              capacity: cell.getData().cap
            }
            html = Handlebars.compile(FacilityViewTmplt.selectCapacity)(templateParms);
          }
          else {
            html = `<label> ${cell.getValue()} MW </label>`;
          }

          return html;
        }

        /* *********************************************************************************** */
        _bidPolicy_cell(cell, formatterParams) {
          let html = ""

          if (cell.getData().state != "decommissioned" && cell.getData().state != "decommissioning") {
            let templateParms = {
              genId: cell.getData().id,
              bidp_opts: formatterParams.bidPolicyOptions,
              bidp: cell.getData().bidp
            }
            html = Handlebars.compile(FacilityViewTmplt.selectBidPolicy)(templateParms);
          }
          else {
            html = `<label> ${cell.getValue()} </label>`
          }

          return html;
        }

        /* *********************************************************************************** */
        _maintPolicy_cell(cell, formatterParams) {
          let html = ""

          if (cell.getData().state != "decommissioned" && cell.getData().state != "decommissioning") {
            let templateParms = {
              genId: cell.getData().id,
              maintp_opts: formatterParams.maintPolicyOptions,
              maintp: cell.getData().maintp
            }
            html = Handlebars.compile(FacilityViewTmplt.selectMaintPolicy)(templateParms);
          }
          else {
            html = `<label> ${cell.getValue()} </label>`
          }

          return html;
        }


        _profit_cell(cell, formatterParams) {
          let templateParms = {
            state: cell.getData().state,
            color: cell.getValue()
          }
          let html = Handlebars.compile(FacilityViewTmplt.colorBox)(templateParms);

          return html;
        }

        _age_cell(cell, formatterParams) {
          let templateParms = {
            state: cell.getData().state,
            color: cell.getValue()
          }
          let html = Handlebars.compile(FacilityViewTmplt.colorBox)(templateParms);

          return html;
        }

        _condition_cell(cell, formatterParams) {
          let templateParms = {
            state: cell.getData().state,
            color: cell.getValue()
          }
          let html = Handlebars.compile(FacilityViewTmplt.colorBox)(templateParms);

          return html;
        }



        /* *********************************************************************************** */
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

        /* *********************************************************************************** */
        _color_cell() {

        }


        //////////////////////////////////////////////////////////////////////////
        // Generator List Table methods

        /* *********************************************************************************** */
        _addGenerator(scope) {
          console.log("_addGenerator()...", scope);
          // scope._turnOnApply(scope);

          // fid: gen.id_facility,
          //   id: gen.id,
          //     name: "generator " + this._padZeroes((index + 1), 2),
          //       cap: gen.gentype_details.nameplate_capacity,
          //         prof: profit,
          //           age: age,
          //             cond: condition,
          //               bidp: gen.local_bid_policy,
          //                 maintp: gen.local_maint_policy,
          //                   state: gen.state

          let newGen = {
            "id": 0,
            "state": "new",
            "name": "generator " + scope._padZeroes((scope._generators.length + 1), 2),
            "cap": 0,
            "profit": 0,
            "age": 0,
            "value": 0,
            "bidp": "N/A",
            "maintp": "N/A",
            "modified": true,
            "id_type": scope._generatorTypes[0],
            "fid": scope._facilityId,
            "state_note": "under construction"
          }
          let genRow = scope._generatorListTable.rowManager.rows.find(row => row.getData().state == "available");

          if (genRow)
            genRow.getGroup().hide();

          scope._modelData.addGenerators(scope._facility.id, scope._facilityType.id).then((results) => {
            console.log("addGenerators results = ", results)
            newGen.id = results.generators[0].id;
            scope._generatorListTable.addRow(newGen).then((row) => row.scrollTo());
            // console.log("this._generatorListTable = ", scope._generatorListTable);
            scope._generators.push(newGen);
            scope._createTableEvents()
            // $(".vfd-generator-name").on("click", scope, scope._generatorNameAction);
          });
        }

        /* *********************************************************************************** */
        _delGenerator(genId, scope) {
          console.log("delGenerator genId = ", genId);
          let newGeneratorRows = scope._generatorListTable.rowManager.rows.reduce((total, row) => {
            return (row.getData().state == "new" ? total + 1 : total)
          }, 0);
          // console.log("newGeneratorRows = ", newGeneratorRows);
          if ((scope._newFacility) && (newGeneratorRows <= 1)) {
            scope._openMessageDialog(scope, "You must have at least one generator ready for construction.")
          }
          else {
            let row = scope._generatorListTable.rowManager.rows.find(row => row.getData().id == genId);
            console.log("row = ", row);
            scope._modelData.delGenerator(genId).then((results) => {
              row.delete();
            });
          }
        }

        /* *********************************************************************************** */
        _decomissionGenerator(genId, scope) {

        }

        /* *********************************************************************************** */
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

        /* *********************************************************************************** */
        _getAge(generator) {
          // console.log("generator = ", generator);
          let currentQtrs = ((this._currentDate.current_year - 1) * this._qtrsPerYear) + this._currentDate.current_quarter
          // startQtrs = (parseInt(generator.start_prod_dategenerator.substr(2, 4)) - 1) * this._qtrsPerYear) + 0))

          return {
            color: "rgb(0, 255, 0)",
            age: 20
          }
        }

        _checkAction(state, scope) {
          let action = "";
          switch (state) {

            case "new":
              action = "remove"
              break;

            case "available" || "building":
              if (scope._decomissionFacilityOn)
                action = "decomission"
              else
                action = "details"
              break;

            case "decomissioning" || "decomissioned" || "unavailable":
              action = "details"
              break;
          }

          return action
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

