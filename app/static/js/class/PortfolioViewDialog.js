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
          this._chart = null;


          this._getDialogData().then((data) => {
            this._facilities = data[0].facilities;
            this._facilityCapacities = data[0].facility_capacities;
            this._facilityData = data[0].facility_data;
            this._facilityConstructCapacities = data[0].facility_build_capacities;
            this._facilityTypes = data[1].facility_types;
            this._portfolioDialogHtml = data[2];
            this._playerGenerators = data[3].player_generators;
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
            this._modelData.getPortfolioHtml(),
            this._modelData.getPlayerGenerators()
          ]).then((data) => data)
            .then((data) => data)
            .then((data) => data)
            .then((data) => data);
        }


        /* *********************************************************************************** */
        _createFacilityChartsData() {
          let typesCount = this._facilityTypes.reduce((typesCount, facilityType) => {
            let typeCount = this._facilities.reduce((typeCount, facility) => {
              if (facility.facility_type == facilityType.id) {
                let idString = String(facilityType.id);

                typeCount.hasOwnProperty(idString) ? (
                  typeCount[idString].num += 1,
                  typeCount[idString].cap += parseInt(this._getTotalFacilityCapacity(facility))
                ) : typeCount[idString] = { num: 1, cap: parseInt(this._getTotalFacilityCapacity(facility)) }
              }

              return typeCount;
            }, {});

            // console.log("typeCount = ", typeCount);

            if (Object.entries(typeCount).length !== 0) {
              typesCount.numData.push(typeCount[String(facilityType.id)].num);
              typesCount.capData.push(typeCount[String(facilityType.id)].cap);
              typesCount.labels.push(facilityType.name)
              typesCount.bgColors.push(typeChartColors[String(facilityType.id)])
              typesCount.borderColors.push(typeChartColors[String(facilityType.id)].split(",").slice(0, 3).concat([" 1)"]).join());
              typesCount.type.push(typeCount);
            }
            return typesCount;
          }, { type: [], labels: [], numData: [], capData: [], bgColors: [], borderColors: [] });

          // console.log("typesCount = ", typesCount);
          return typesCount
        }

        /* *********************************************************************************** */
        _createGraphAndTable(scope) {
          let ownedTypes = scope._createFacilityChartsData();
          // console.log("types = ", ownedTypes);
          // scope._createChartOfOwnedFacilityTypes(ownedTypes, "Owned Facility Capacities", "capData");
          scope._createChartOfOwnedFacilityTypes(ownedTypes, "Facility Types Owned", "numData");
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
        _createChartOfOwnedFacilityTypes(ownedTypes, label, dataTypePropertyName) {
          // let chartContext = document.getElementById(this._elementIdPortfolioChart).getContext();
          if (this._chart)
            this._chart.destroy();
          let ctx = document.getElementById(this._elementIdPortfolioChart).getContext("2d");
          this._chart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ownedTypes.labels,
              datasets: [{
                label: label,
                data: ownedTypes[dataTypePropertyName],
                backgroundColor: ownedTypes.bgColors,
                borderColor: ownedTypes.borderColors,
                borderWidth: 1
              }]
            },
            options: {
              legend: {
                position: 'left',
                align: 'start'

              },
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

          // console.log("ownedTypes = ", ownedTypes)

          // $(this._portfolioDialog).find(this._elementIdPortfolioChart).html(chart);
        }

        /* *********************************************************************************** */
        _createEvents() {
          $(".portfolio-facility-name-link").on("click", this, this._viewFacility);
          $(".option-bid-policy").on("change", this, this._changeBidPolicy);
          $(".option-mnt-policy").on("change", this, this._changeMaintPolicy);
          $(".portfolio-graph-tab").on("click", this, this._changeChartData);
        }

        /* *********************************************************************************** */
        // Event functions
        /* *********************************************************************************** */
        _changeBidPolicy(evt) {
          let scope = evt.data;
          scope._modelData.updateGlobalBidPolicy(evt.currentTarget.value)
        }

        /* *********************************************************************************** */
        _changeMaintPolicy(evt) {
          let scope = evt.data;
          scope._modelData.updateGlobalMaintPolicy(evt.currentTarget.value)
        }

        _changeChartData(evt) {
          let scope = evt.data;
          let tab = evt.currentTarget;
          let dataName = $(tab).attr("value");
          let title = $(tab).attr("title");
          let chartTypes = scope._createFacilityChartsData();

          scope._createChartOfOwnedFacilityTypes(chartTypes, title, dataName);
          $("#portfolio-chart-title").html(title);

          let graphTabs = $(".portfolio-graph-tab").removeClass("active");
          $(tab).addClass("active");

          // console.log(`dataName = ${dataName}, title = ${title}`);
        }

        /* *********************************************************************************** */
        _viewFacility(evt) {
          // console.log("_viewFacility() evt = ", evt);
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

        _getFacilityAge(facilityId) {
          // console.log("this._facilityData = ", this._facilityData);
          let facilityData = this._facilityData.find(fd => facilityId == fd.facility_id)
          // console.log("facilityData = ", facilityData);
          let age = parseInt(facilityData.facility_age);
          let lifespan = parseInt(facilityData.facility_lifespan);

          let ratio = (lifespan - age) / lifespan;

          // console.log("ratio = ", ratio)

          switch (true) {
            case (ratio > .75):
              return ({
                color: this._getCellColor("good"),
                age: age
              });
            case (ratio > .30):
              return ({
                color: this._getCellColor("medium"),
                age: age
              });
            case (ratio >= 0):
              return ({
                color: this._getCellColor("bad"),
                age: age
              });
            default:
              return ({
                color: this._getCellColor("bad"),
                age: age
              });
          }
        }

        _getCellColor(type) {
          switch (type) {
            case "good": return "rgba(0, 255, 0, .8)"
            case "medium": return "rgba(250, 218, 94, .8)"
            case "bad": return "rgba(255, 0, 0, .8)"
          }
        }

        _numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        _getAgeStatus(facility) {
          // console.log("_getAgeStatus-facility = ", facility);
          // console.log("_getAgeStatus-playerGenerators = ", this._playerGenerators);
          let ageCounts = [0, 0, 0];
          this._playerGenerators[facility.id].forEach((generator) => {
          });

          return ({
            'color': this._getCellColor("medium"),
            'tooltipMsg': "This facility is aged"
          });
        }

        _getProfitStatus(facility) {
          // console.log("_getProfitStatus-facility = ", facility);
          // console.log("_getProfitStatus-playerGenerators = ", this._playerGenerators[facility.id]);

          let profitMarginCounts = [0, 0, 0];
          this._playerGenerators[facility.id].forEach((generator) => {
            if (generator.state === "available") {
              let margin = generator.fixed_cost_build * generator.nameplate_capacity / generator.build_time;
              let qProfit = generator.quarterly_profit;
              let profit_margin = qProfit / margin * 100;

              if (profit_margin > 10)
                profitMarginCounts[0] += 1;
              else if (profit_margin > 2)
                profitMarginCounts[1] += 1;
              else
                profitMarginCounts[2] += 1;
            }
          });

          switch (true) {
            case (profitMarginCounts[2] > 0):
              return ({
                color: this._getCellColor("bad"),
                tooltipMsg: "" + profitMarginCounts[2] + (profitMarginCounts[2] > 1 ? " generators " : " generator ") + "had a quarterly profit of less than 2 percent."
              });
            case (profitMarginCounts[1] > 0):
              return ({
                color: this._getCellColor("medium"),
                tooltipMsg: "" + profitMarginCounts[1] + (profitMarginCounts[1] > 1 ? " generators " : " generator ") + "had a quarterly profit of less than 10 percent."
              });
            default:
              return ({
                color: this._getCellColor("good"),
                tooltipMsg: "All your generators had a quarterly profit of more than 10 percent."
              });
          }
        }

        _getConditionStatus(facility) {
          // console.log("_getConditionStatus-facility = ", facility);
          // console.log("_getConditionStatus-playerGenerators = ", this._playerGenerators);
          let profitConditionCounts = [0, 0, 0];
          this._playerGenerators[facility.id].forEach((generator) => {
            if (generator.condition >= .67)
              profitConditionCounts[0] += 1
            else if (generator.condition >= .25)
              profitConditionCounts[1] += 1
            else
              profitConditionCounts[2] += 1
          });

          switch (true) {
            case (profitConditionCounts[2] > 0):
              return ({
                color: this._getCellColor("bad"),
                tooltipMsg: "" + profitConditionCounts[2] + (profitConditionCounts[2] > 1 ? " generators " : " generator ") + "have a condition rating of 'poor'."
              });
            case (profitConditionCounts[1] > 0):
              return ({
                color: this._getCellColor("medium"),
                tooltipMsg: "" + profitConditionCounts[1] + (profitConditionCounts[1] > 1 ? " generators " : " generator ") + "have a condition rating of 'worn'."
              });
            default:
              return ({
                color: this._getCellColor("good"),
                tooltipMsg: "all generators have a condition rating of 'good'."
              });
          }
        }

        _checkToolTipState(state) {

          if (state == "abandoned")
            return `Facility has been decomissioned`;

          if (state == "inactive")
            return 'Facility in inactive this quarter';

          if (state == "building" || state == "new" || state == "paused")
            return `Facility is under construction`;

          return null;

        }




        /* *********************************************************************************** */
        // Create Facility list table
        /* *********************************************************************************** */
        _createFacilityListTable() {
          const facility_table_data = [];

          // console.log("_createFacilityListTable() this._facilities = ", this._facilities);
          this._facilities.forEach((facility, index) => {
            let profit = this._getProfitStatus(facility)        //"rgba(255, 0, 0, .8)" //getProfit(gen);
            let condition = this._getConditionStatus(facility)  //"rgba(250, 218, 94, .8)" //getCondition(gen);
            let age = this._getAgeStatus(facility);             //
            // console.log("condition = ", condition);

            // let profitColor = profit.color;
            // let conditionColor = condition.color;
            // let ageColor = age.color;

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
            tooltopGenerationMode: "hover",
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
                tooltipGenerationMode: "hover",
                tooltip: (cell) => {
                  let toolTip = this._checkToolTipState(cell.getData().state)
                  if (toolTip)
                    return toolTip;

                  // console.log("cell.getValue() = ", cell.getValue());
                  return (cell.getValue().tooltipMsg);
                },
                formatter: this._profit_color_cell,
                formatterParams: {}
              },

              {
                title: "Age", field: "age", width: 80,
                formatter: this._age_color_cell,
                formatterParams: {}
              },

              {
                title: "Condition", field: "cond", width: 80,
                tooltipGenerationMode: "hover",
                tooltip: (cell) => {
                  let toolTip = this._checkToolTipState(cell.getData().state)
                  if (toolTip)
                    return toolTip;

                  // console.log("cell.getValue() = ", cell.getValue());
                  return (cell.getValue().tooltipMsg);
                },
                formatter: this._cond_color_cell,
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

        _profit_color_cell(cell, formatterParams) {
          return (cell.getData().facility.state == "active" ?
            `<label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px;background:${cell.getValue().color};"></label>`
            :
            ` <label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px; background:repeating-linear-gradient(45deg, #010101, #010101 10px, #f5cb42 10px, #f5cb42 20px);"></label>`
          )
        }

        _age_color_cell(cell, formatterParams) {
          // console.log("color = ", color);
          return (cell.getData().facility.state == "active" ?
            `<label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px;background:${cell.getValue().color};"></label>`
            :
            ` <label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px; background:repeating-linear-gradient(45deg, #010101, #010101 10px, #f5cb42 10px, #f5cb42 20px);"></label>`
          )

        }

        _cond_color_cell(cell, formatterParams) {
          return (cell.getData().facility.state == "active" ?
            `<label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px;background:${cell.getValue().color};"></label>`
            :
            ` <label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px; background:repeating-linear-gradient(45deg, #010101, #010101 10px, #f5cb42 10px, #f5cb42 20px);"></label>`
          )
        }




      });
  });