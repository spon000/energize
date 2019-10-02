define([
  "jquery",
  "evtEmitter",
  "msgBox",
  "ModelData",
  "PortfolioViewDialog",
  "QuarterlyReportViewDialog",
  "webSocketCalls"
], function (
  $,
  evtEmitter,
  msgBox,
  ModelData,
  PortfolioViewDialog,
  QuarterlyReportViewDialog,
  webSocketCalls
) {
    return class TopMenu {
      constructor() {
        this._buildFacilityButtonId = "build-facility-btn";
        this._nextTurnButtonId = "next-turn-button";
        this._portfolioButtonId = "portfolio-btn";
        this._quarterlyRptButtonId = "quarterly-report-btn";

        this._modelData = new ModelData();

        this._initializeEmitEvents();
        this._setClickEvents();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      //

      /* ************************************************************************************** */
      //
      /* ************************************************************************************** */
      _initializeEmitEvents() {
        evtEmitter.on("build_facility_btn", () =>
          $("#" + this._buildFacilityButtonId).click()
        );
        evtEmitter.on("next_turn_btn", () =>
          $("#" + this._nextTurnButtonId).click()
        );
        evtEmitter.on("portfolio_btn", () =>
          $("#" + this._portfolioButtonId).click()
        );
        evtEmitter.on("quarterly_report_btn", () =>
          $("#" + this._quarterlyRptButtonId).click()
        );
        evtEmitter.on("set_build_btn_status", data =>
          this._setBuildBtnStatus(data.socketio_data.state)
        );
        evtEmitter.on("set_turn_btn_status", data =>
          this._setNextTurnBtnStatus(data.socketio_data.state)
        );
      }

      /* ************************************************************************************** */
      //
      /* ************************************************************************************** */
      _setClickEvents() {
        $("#" + this._buildFacilityButtonId).click(this, evt => {
          this._buttonBuildFacility(evt);
        });
        $("#" + this._nextTurnButtonId).click(this, evt => {
          this._buttonNextTurn(evt);
        });
        $("#" + this._portfolioButtonId).click(this, evt => {
          this._buttonViewPortfolio(evt);
        });
        $("#" + this._quarterlyRptButtonId).click(this, evt => {
          this._buttonViewQuarterlyRpt(evt);
        });
      }

      /* ************************************************************************************** */
      //
      /* ************************************************************************************** */
      _checkPlayerNumber() { }

      /* ************************************************************************************** */
      //
      /* ************************************************************************************** */
      _buttonBuildFacility() {
        webSocketCalls.sendMessageEmit("player_build_facility_button", {
          gameId: globalGameId
        });
      }

      /* ************************************************************************************** */
      //
      /* ************************************************************************************** */
      _buttonNextTurn() {
        webSocketCalls.sendMessageEmit("player_next_turn_button", {
          gameId: globalGameId
        });
      }

      /* ************************************************************************************** */
      //
      /* ************************************************************************************** */
      _buttonViewPortfolio() {
        let pvd = new PortfolioViewDialog();
      }

      /* ************************************************************************************** */
      //
      /* ************************************************************************************** */
      _buttonViewQuarterlyRpt() {
        let qrvd = new QuarterlyReportViewDialog();
      }

      /* ************************************************************************************** */
      //
      /* ************************************************************************************** */
      _setBuildBtnStatus(state) {
        console.log("setBuildBtnStatus() state = ", state);
        if (state === "view") {
          $("#" + this._buildFacilityButtonId).removeClass([
            "building",
            "no-hover"
          ]);
          let msg = `You are in "Viewing" mode.`;
          msgBox.postMessage({ msg: msg });
        }
        else if (state === "build") {
          $("#" + this._buildFacilityButtonId).addClass(["building", "no-hover"]);
          let msg = `You are in "Building" mode.`;
          msgBox.postMessage({ msg: msg });
        }
        else if (state === "waiting") {
          let msg = `You are in "Waiting" mode.`;
          msgBox.postMessage({ msg: msg });
          $("#" + this._buildFacilityButtonId).addClass(["no-hover"]);
          $("#" + this._buildFacilityButtonId).removeClass(["building"]);
        }
      }

      _setNextTurnBtnStatus(state) {
        console.log("setTurnBtnStatus() state = ", state);
        this._modelData.getTurnButtonHtml().then((data) => {
          $("#" + this._nextTurnButtonId).replaceWith(data);
          console.log("setTurnBtnStatus() websocket callback data = ", data);

          // Set click event on Next Turn Button
          $("#" + this._nextTurnButtonId).off()
          $("#" + this._nextTurnButtonId).click(this, evt => {
            this._buttonNextTurn(evt);
          });
        });
      }
    };
  });