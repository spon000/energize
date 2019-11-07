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
          this._elementIdQuarterlyEventsMain = "quarterly-events-list-main";
          this._elementIdQuarterlyEventsSidebar = "quarterly-events-list-sidebar";
          this._elementIdQuarterlyEventsTable = "quarterly-events-list-table";
          this._quarterlyDialogHtml = null
          this._quarterlyDialog = null;
          this._eventSelected = false;
          this._sideBarOpen = false;
          this._trashEventsOn = false;
          this._events = null;


          this._getDialogData().then((data) => {
            this._events = data[0].prompts;
            this._eventTypes = data[0].prompt_types;
            this._quarterlyDialogHtml = data[1];
            // console.log("_getDialogData()  data = ", data);
            this._openQuarterlyDialog(this)
            this._createEvents();
            this._createEventListTable();
          });
        }



        /* *********************************************************************************** */
        // Initialize functions
        /* *********************************************************************************** */
        _getDialogData() {
          return Promise.all([
            this._modelData.getCompanyEvents(),
            this._modelData.getQuarterlyHtml()
          ]).then((data) => data)
            .then((data) => data);
        }


        /* *********************************************************************************** */

        /* *********************************************************************************** */

        /* *********************************************************************************** */

        /* *********************************************************************************** */
        _createEvents() {
          $("#" + this._elementIdQuarterlyEventsMain).find(".sidebar-btn").on("click", this, this._sidebar);
          $("#" + this._elementIdQuarterlyEventsMain).find(".sidebar-btn-trash").on("click", this, this._trashEvents);
        }

        /* *********************************************************************************** */
        // Event functions
        /* *********************************************************************************** */
        _sidebar(evt) {
          console.log("sidebar testing...", evt);
          let button = evt.currentTarget;
          let scope = evt.data;

          // if (!scope._eventSelected)
          //   return;

          if ($(button).hasClass("open-b")) {
            // scope._sidebarStatus(true);
            $(button).html("&#9654;");
          }
          else {
            // scope._sidebarStatus(false);
            $(button).html("&#9664;");
          }

          $(button).toggleClass("open-b");
          $(button).toggleClass("close-b");
          $("#" + scope._elementIdQuarterlyEventsSidebar).toggleClass("open-sb");
          $("#" + scope._elementIdQuarterlyEventsTable).toggleClass("open-t");
        }

        /* *********************************************************************************** */
        _trashEvents(evt) {
          console.log("_trashEvents()... ", evt);
        }

        /* *********************************************************************************** */
        _sidebarStatus(open) {
          console.log("sidebarStatus...", open)
          this._sideBarOpen = open;

          if (open) {
            let eventDetailsHtml = $("#" + this._elementIdQuarterlyEventsSidebar).find("#event-details")

            if ($(eventDetailsHtml))
              $(eventDetailsHtml).removeClass("event-details-hide");
            else
              $(eventDetailsHtml).addClass("event-details-hide");
          }
        }

        _addEventToSidebar(html) {

          if (this._sideBarOpen)
            $(html).removeClass("event-details-hide");
          else
            $(html).addClass("event-details-hide");

          $("#" + this._elementIdQuarterlyEventsSidebar).empty();
          $("#" + this._elementIdQuarterlyEventsSidebar).append(html);
        }


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
            height: 680,
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


        /* *********************************************************************************** */
        _numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }


        /* *********************************************************************************** */
        // Create Events list table
        /* *********************************************************************************** */
        _createEventListTable() {
          const event_table_data = [];

          // console.log("_createFacilityListTable() this._facilities = ", this._facilities);
          this._events.forEach((event, index) => {
            let event_type = this._eventTypes['' + event.prompt_type + ''];
            // console.log("event = ", event);
            // console.log("event_type = ", event_type);
            // console.log("event_types = ", this._eventTypes);

            event_table_data.push({
              id: event.id,
              priority: event_type.priority,
              type: event_type.category,
              date: event.date_string,
              subject: event.short_description,
              scope: this,
            });
          });

          const eventTableDef = {
            height: 238,
            layout: "fitDataFill",
            data: event_table_data,
            columns: [
              {
                title: "!", field: "priority", width: 20, align: "center",
                formatter: this._priority_cell,
              },

              {
                title: "Subject", field: "subject", width: 300,
              },

              {
                title: "Type", field: "type", width: 200, align: "center",
                formatter: this._type_cell,
              },

              {
                title: "Date", field: "date", width: 155,
              },
            ],

            selectable: 1,
            rowSelected: this._table_row_selected,

          }

          return new Tabulator("#" + this._elementIdQuarterlyEventsTable, eventTableDef);
        }

        /* *********************************************************************************** */
        _priority_cell(cell, formatterParams = null) {
          switch (cell.getValue()) {
            case "information":
              return "!"
            case "warning":
              return "!"
            case "danger":
              return "!"
            default:
              return "!"
          }
        }

        /* *********************************************************************************** */
        _type_cell(cell, formatterParams = null) {
          return ("[" + cell.getValue() + "]")
        }

        /* *********************************************************************************** */
        _table_row_selected(row) {
          let data = row.getData();
          let scope = data.scope;
          console.log("_table_row_selected")

          scope._modelData.getEventDetailsHtml(data.id).then((html) => {
            // console.log("eventDetails html = ", html);
            scope._addEventToSidebar(html);
          });
          // console.log("row selected ", data);
        }

      });
  });