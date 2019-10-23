define([
  // Libs
  "jquery",
  "jqueryui",
  "chart",
  "Handlebars",
  "evtEmitter",
  "ModelData",
  "Tabulator",
  "FacilityViewDialog",
], function (
  $,
  JQUI,
  Chart,
  Handlebars,
  evtEmitter,
  ModelData,
  Tabulator,
  FacilityViewDialog,
  ) {

    let = typeChartColors = {
      '1': "rgba(82, 45, 128, .5)",
      '2': "rgba(82, 45, 128, 1)",
      '3': "rgba(114, 199, 219, .5)",
      '4': "rgba(255, 214, 113, .5)",
      '5': "rgba(246, 103, 51, .5)",
      '6': "rgba(246, 103, 51, 1)",
      '7': "rgba(100, 106, 109, .5)",
      '8': "rgba(14, 144, 150, .5)"
    }


    return (
      class PortfolioViewDialog {
        constructor() {
          this._modelData = new ModelData();
          this._elementIdPortfolioChart = "portfolio-graph-chart";
          this._elementIdPortfolioFacilityTable = "portfolio-facility-list-table";
          this._elementIdTotalCompanyCapacity = "pfs-total-company-capacity";
          this._elementIdTotalConstructCapacity = "pfs-total-construction-capacity";
          this._portfolioDialogHtml = null
          this._portfolioDialog = null;
          this._facilities = null;
          this._facilityTypes = null;
          this._facilityCapacities = null;
          this._facilityConstructCapacities = null;


          this._getDialogData().then((data) => {
            this._facilities = data[0].facilities;
            this._facilityCapacities = data[0].facility_capacities;
            this._facilityConstructCapacities = data[0].facility_build_capacities;
            this._facilityTypes = data[1].facility_types;
            this._portfolioDialogHtml = data[2];
            console.log("ready to open dialog...", data);

            this._openPortfolioDialog(this, this._createGraphAndTable)
          });
        }



        /* *********************************************************************************** */
        // Initialize functions
        /* *********************************************************************************** */
        _getDialogData() {
          return Promise.all([
            this._modelData.getPlayerFacilities(),
            this._modelData.getFacilityTypes(),
            this._modelData.getPortfolioHtml()
          ]).then((data) => data)
            .then((data) => data)
            .then((data) => data);
        }


        /* *********************************************************************************** */
        _createFacilityChartData() {
          let typesCount = this._facilityTypes.reduce((typesCount, facilityType) => {
            let typeCount = this._facilities.reduce((typeCount, facility) => {
              if (facility.facility_type == facilityType.id) {
                let idString = String(facilityType.id);
                typeCount.hasOwnProperty(idString) ? typeCount[idString] += 1 : typeCount[idString] = 1;
              }

              return typeCount;
            }, {});

            if (Object.entries(typeCount).length !== 0) {
              typesCount.data.push(typeCount[String(facilityType.id)]);
              typesCount.labels.push(facilityType.name)
              typesCount.bgColors.push(typeChartColors[String(facilityType.id)])
              typesCount.borderColors.push(typeChartColors[String(facilityType.id)].split(",").slice(0, 3).concat([" 1)"]).join());
              typesCount.type.push(typeCount);
            }
            return typesCount;
          }, { type: [], labels: [], data: [], bgColors: [], borderColors: [] });

          // console.log("typesCount = ", typesCount);
          return typesCount
        }


        /* *********************************************************************************** */
        _createGraphAndTable(scope) {
          let ownedTypes = scope._createFacilityChartData();
          // console.log("types = ", ownedTypes);
          scope._createChartOfOwnedFacilityTypes(ownedTypes);
          scope._createTotalCompanyCapacity();
          scope._createTotalConstructCapacity();
          scope._createFacilityListTable();
          scope._createEvents();
        }


        /* *********************************************************************************** */
        _createOperatingBudget() {
        }

        /* *********************************************************************************** */
        _createCompanyAssets() {
        }

        /* *********************************************************************************** */
        _createTotalCompanyCapacity() {
          let capString = (this._getTotalCompanyCapacity() + " MW");
          $("#" + this._elementIdTotalCompanyCapacity).html(capString);
        }

        /* *********************************************************************************** */
        _createTotalConstructCapacity() {
          let conCapString = this._getTotalCompanyConstructionCapacity() + " MW";
          $("#" + this._elementIdTotalConstructCapacity).html(conCapString);
        }

        /* *********************************************************************************** */
        _createChartOfOwnedFacilityTypes(ownedTypes) {
          // let chartContext = document.getElementById(this._elementIdPortfolioChart).getContext();
          let chart = new Chart(document.getElementById(this._elementIdPortfolioChart), {
            type: 'pie',
            data: {
              labels: ownedTypes.labels,
              datasets: [{
                label: "Owned Facilities",
                data: ownedTypes.data,
                backgroundColor: ownedTypes.bgColors,
                borderColor: ownedTypes.borderColors,
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                // xAxes: [{
                // stacked: true,
                //   ticks: {
                //     beginAtZero: true
                //   }
                // }],
                // yAxes: [{
                //   stacked: true
                // }]
              }
            }
          });
          $(this._portfolioDialog).find(this._elementIdPortfolioChart).append(chart);
        }

        /* *********************************************************************************** */
        _createEvents() {
          $(".portfolio-facility-name-link").on("click", this, this._viewFacility);

        }

        /* *********************************************************************************** */
        // Event functions
        /* *********************************************************************************** */
        _viewFacility(evt) {
          console.log("_viewFacility() evt = ", evt);
          let scope = evt.data;
          let fid = $(evt.currentTarget).attr("fid");
          let facilityViewDialog = new FacilityViewDialog(fid);
        }

        /* *********************************************************************************** */
        // Create dialog box
        /* *********************************************************************************** */
        _openPortfolioDialog(scope, openFunction = null, closeFunction = null) {
          this._modelData.getPortfolioHtml().then((html) => {
            $("#portfolio-dialog").empty()
            $("#portfolio-dialog").append(html)

            this._portfolioDialog = $("#portfolio-dialog").dialog({
              title: "Company Portfolio",
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
            })
          });
        }


        /* *********************************************************************************** */
        // Table helper functions
        /* *********************************************************************************** */
        _getTypeIcon(facility) {
          return this._facilityTypes.find(fac_type => fac_type.id == facility.facility_type).maintype.split(" ")[0];
          // return facility.maintype.split(" ")[0];
        }

        _getStatus(facility) {
          switch (facility.state) {
            case "new": return "Planned";
            case "building": return "Building";
            case "active": return "Active";
            case "inactive": return "Inactive";
            case "abandoned": return "Abandoned";
            default: return "Unknowm";
          }
        }

        _getTotalFacilityCapacity(facility) {
          return this._facilityCapacities.find(fac => fac.facility_id == facility.id).facility_capacity;
        }

        _getTotalFacilityBuildCapacity(facility) {
          return this._facilityCapacities.find(fac => fac.facility_id == facility.id).facility_build_capacity;
        }

        _getTotalCompanyConstructionCapacity() {
          return this._numberWithCommas(this._facilityCapacities.reduce((totalConCap, facConCap) => totalConCap += parseInt(facConCap.facility_build_capacity), 0));
        }

        _getTotalCompanyCapacity() {
          return this._numberWithCommas(this._facilityCapacities.reduce((totalCap, facCap) => totalCap += parseInt(facCap.facility_capacity), 0));
        }

        _numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }


        /* *********************************************************************************** */
        // Create Facility list table
        /* *********************************************************************************** */
        _createFacilityListTable() {
          const facility_table_data = [];

          // console.log("_createFacilityListTable() this._facilities = ", this._facilities);
          this._facilities.forEach((facility, index) => {
            let profit = "rgb(255, 0, 0)" //getProfit(gen);
            let condition = "rgb(250, 218, 94)" //getCondition(gen);
            let age = "rgb(0, 255, 0)"  //this._getAge(facilitygen).color;

            let profitColor = profit.color;
            let conditionColor = condition.color;
            let ageColor = age.color;

            facility_table_data.push({
              facility: facility,
              fid: facility.id,
              name: facility.name,
              typeIcon: this._getTypeIcon(facility),
              status: this._getStatus(facility),
              cap: null,
              prof: profit,
              age: age,
              cond: condition,
              state: facility.state
            });
          });

          const facilityTableDef = {
            height: 238,
            layout: "fitData",
            data: facility_table_data,
            columns: [
              {
                title: "Name", field: "name", align: "center", width: 110,
                formatter: this._name_cell,
                // formatterParams: {
                //   scope: this
                // },
              },

              {
                title: "Type", field: "typeIcon", align: "center", width: 90,

              },

              {
                title: "Status", field: "status", align: "center", width: 90,
              },

              {
                title: "Capacity", field: "cap", align: "left", width: 150,
                formatter: this._capacity_cell,
                formatterParams: {
                  scope: this,
                  formatWithCommas: this._numberWithCommas,
                }
              },

              {
                title: "Profit", field: "prof", width: 80,
                formatter: this._color_cell,
                formatterParams: {}
              },

              {
                title: "Age", field: "age", width: 80,
                formatter: this._color_cell,
                formatterParams: {}
              },

              {
                title: "Condition", field: "cond", width: 80,
                formatter: this._color_cell,
                formatterParams: {}
              },
            ]
          }

          return new Tabulator("#" + this._elementIdPortfolioFacilityTable, facilityTableDef);
        }


        /* *********************************************************************************** */
        // Table formater helpers
        /* *********************************************************************************** */
        _capacity_cell(cell, formatterParams) {
          let facility = cell.getData().facility;
          let scope = formatterParams.scope;
          let avail_cap = parseInt(scope._getTotalFacilityCapacity(facility))
          let build_cap = parseInt(scope._getTotalFacilityBuildCapacity(facility))
          let capacity_string = formatterParams.formatWithCommas(avail_cap) + " MW (" + formatterParams.formatWithCommas(build_cap) + " MW)";

          return capacity_string;
        }

        _name_cell(cell, formatterParams) {
          return `<a href="#" class="portfolio-facility-name-link" fid="${cell.getData().fid}"> ${cell.getValue()} </a>`
        }

        _color_cell(cell, formatterParams) {
          return (cell.getData().facility.state == "active" ?
            `<label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px;background:${cell.getValue()};"></label>`
            :
            ` <label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px; background:repeating-linear-gradient(45deg, #010101, #010101 10px, #f5cb42 10px, #f5cb42 20px);"></label>`
          )

        }




      });
  });