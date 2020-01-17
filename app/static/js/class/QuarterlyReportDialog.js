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
          this._elementIdQuarterlyEventsTable = "quarterly-events-list-table";
          this._elementIdQuarterlyEventsSidebar = "quarterly-events-list-sidebar";

          this._elementIdSidebarContentEvent = "sidebar-content-event";
          this._elementIdSidebarContentDefault = "sidebar-content-default";



          this._quarterlyDialogHtml = null
          this._quarterlyDialog = null;
          this._eventSelected = false;
          this._trashEventsOn = false;
          this._events = null;
          this._sideBarHtml = null;

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
          $("#" + this._elementIdQuarterlyEventsMain).find(".sidebar-open-close-btn").on("click", this, this._sidebarOpenBtn);
          $("#" + this._elementIdQuarterlyEventsMain).find(".sidebar-btn-trash").on("click", this, this._sidebarTrashBtn);
          $("#" + this._elementIdQuarterlyEventsMain).find(".sidebar-btn-popout").on("click", this, this._sidebarPopoutBtn);
        }

        /* *********************************************************************************** */
        // Event functions
        /* *********************************************************************************** */
        _sidebarOpenBtn(evt) {
          console.log("sidebar testing...", evt);
          let button = evt.currentTarget;
          let scope = evt.data;

          if ($(button).hasClass("closed-b"))
            scope._sidebarActionOpen()
          else
            scope._sidebarActionClose()

        }

        /* *********************************************************************************** */
        _sidebarTrashBtn(evt) {
          console.log("_sidebarTrashBtn... ", evt);
        }

        _sidebarPopoutBtn(evt) {
          console.log("_sidebarPopoutBtn... ", evt);
        }


        _sidebarActionOpen() {
          console.log("_sidebarActionOpen... ");
          $(".sidebar-open-close-btn").html("&#9654;");
          $(".sidebar-open-close-btn").removeClass("closed-b");
          $(".sidebar-open-close-btn").addClass("opened-b");
          $("#" + this._elementIdQuarterlyEventsSidebar).removeClass("closed-sb");
          $("#" + this._elementIdQuarterlyEventsSidebar).addClass("opened-sb");

          if (this._eventSelected) {
            $("#" + this._elementIdSidebarContentEvent).removeClass("no-show");
            $("#" + this._elementIdSidebarContentDefault).addClass("no-show");
          }
          else {
            $("#" + this._elementIdSidebarContentEvent).addClass("no-show");
            $("#" + this._elementIdSidebarContentDefault).removeClass("no-show");
          }
        }

        _sidebarActionClose() {
          $(".sidebar-open-close-btn").html("&#9664;");
          $(".sidebar-open-close-btn").addClass("closed-b");
          $(".sidebar-open-close-btn").removeClass("opened-b");
          $("#" + this._elementIdQuarterlyEventsSidebar).removeClass("opened-sb");
          $("#" + this._elementIdQuarterlyEventsSidebar).addClass("closed-sb");

          $("#" + this._elementIdSidebarContentEvent).addClass("no-show");
          $("#" + this._elementIdSidebarContentDefault).addClass("no-show");
        }

        _addEventToSidebar(html = null) {

          $("#" + this._elementIdSidebarContentEvent).empty();

          if (html) {
            $("#" + this._elementIdSidebarContentEvent).append(html);
            this._sidebarActionOpen();
          }
          else
            this._sidebarActionClose();
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
            resizable: false,
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
                title: "", field: "priority", width: 20, align: "center",
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
            rowDeselected: this._table_row_deselected,
          }

          return new Tabulator("#" + this._elementIdQuarterlyEventsTable, eventTableDef);
        }

        /* *********************************************************************************** */
        _priority_cell(cell, formatterParams = null) {
          switch (cell.getValue()) {
            case "information":
              return `<div class="event-indicator-circle event-info">!</div>`
            case "warning":
              return `<div class="event-indicator-circle event-warn">!</div>`
            case "danger":
              return `<div class="event-indicator-circle event-problem">!</div>`
            default:
              return `<div class="event-indicator-circle event-information">!</div>`
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

          scope._modelData.getEventDetailsHtml(data.id).then((html) => {
            scope._eventSelected = true;
            scope._addEventToSidebar(html);
          });
        }

        /* *********************************************************************************** */
        _table_row_deselected(row) {
          let data = row.getData();
          let scope = data.scope;

          scope._eventSelected = false;
          scope._addEventToSidebar();
        }

      });
  });