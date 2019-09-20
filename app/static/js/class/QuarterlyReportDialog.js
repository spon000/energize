define([
  // Libs
  "jquery",
  "jqueryui",
  "evtEmitter",
  "ModelData",
  "Tabulator"

], function (
  $,
  JQUI,
  evtEmitter,
  ModelData,
  Tabulator
) {
    return (
      class QuarterlyViewDialog {
        constructor() {
          this._modelData = new ModelData();
          this._elementIdQuarterlyEventsTable = "quarterly-events-list-table";
          this._quarterlyDialogHtml = null
          this._quarterlyDialog = null;
          this._events = null;

          this._getDialogData().then((data) => {
            this._facilities = data[0];
            this._company = data[1];
            // this._events = data[2];
            this._quarterlyDialogHtml = data[2];

            console.log("_getDialogData()  data = ", data);

            this._openQuarterlyDialog(this)
          });
        }



        /* *********************************************************************************** */
        // Initialize functions
        /* *********************************************************************************** */
        _getDialogData() {
          return Promise.all([
            this._modelData.getPlayerFacilities(),
            this._modelData.getCompany(),
            // this._modelData.getCompanyEvents(),
            this._modelData.getQuarterlyHtml()
          ]).then((data) => data)
            .then((data) => data)
            //.then((data) => data)
            .then((data) => data);
        }


        /* *********************************************************************************** */

        /* *********************************************************************************** */

        /* *********************************************************************************** */

        /* *********************************************************************************** */
        _createEvents() {
        }

        /* *********************************************************************************** */
        // Event functions
        /* *********************************************************************************** */

        /* *********************************************************************************** */
        // Create dialog box
        /* *********************************************************************************** */
        _openQuarterlyDialog(scope, openFunction = null, closeFunction = null) {
          $("#quarterly-report-dialog").empty()
          $("#quarterly-report-dialog").append(this._quarterlyDialogHtml)

          this._portfolioDialog = $("#quarterly-report-dialog").dialog({
            title: "Quarterly Report",
            scope: scope,
            width: 750,
            height: 700,
            position: {},
            modal: true,
            open: (evt, ui) => {
              if (openFunction)
                openFunction(scope);
            },
            close: (evt, ui) => {
              if (closeFunction)
                closeFunction(scope);
            },
            buttons: [
              {
                text: "Close",
                click: function (evt) {
                  $(this).dialog("close")
                }
              }
            ]
          });
        }


        /* *********************************************************************************** */
        // Table helper functions
        /* *********************************************************************************** */
        _getTypeIcon(facility) {
          // return this._facilityTypes.find(fac_type => fac_type.id == facility.facility_type).maintype.split(" ")[0];
          // return facility.maintype.split(" ")[0];
        }


        _numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }


        /* *********************************************************************************** */
        // Create Facility list table
        /* *********************************************************************************** */
        _createEventsListTable() {
        }

      });
  });