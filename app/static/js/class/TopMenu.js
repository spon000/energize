define([
  "jquery",
  "Component",
  "gameStore",
  "TopMenuBuild",
  "ResourceLoader",
  "networkCallMap",
  "PortfolioViewDialog"
], function ($, Component, gameStore, TopMenuBuild, ResourceLoader, networkCallMap, PortfolioViewDialog) {
  return (
    class TopMenu extends Component {
      constructor() {
        super({
          gameStore,
        });

        // const tmb = new TopMenuBuild();

        // tmb.render();

        this._facilityButtonId = "build-facility-btn";
        this._nextTurnButtonId = "next-btn";
        this._portfolioButtonId = "portfolio-btn";
        this._buildStatus = "build";

        this._getCompanyData().then((company) => {
          this._setBuildBtnStatus(company.state);
          this._setBuildBtnEvent();
        });

        this._setNextBtnEvent();
        this._initPortfolioBtn();
      }

      // Getters...
      buildStatus() {
        return this._buildStatus;
      }

      clickBuildButton() {
        $('#' + this._facilityButtonId).click();
      }

      _setNextBtnEvent() {
        $('#' + this._nextTurnButtonId).click(this, (evt) => {
          $.post(networkCallMap.companyTable.path + "pcstate=turn", (data) => { console.log("successful POST", data) });
        });
      }

      _initPortfolioBtn() {
        $('#' + this._portfolioButtonId).click(this, (evt) => {
          let pvd = new PortfolioViewDialog();
          // console.log("pvd = ", pvd);
        });
      }

      _getCompanyData() {
        return new Promise(resolve => {
          const loaded = ResourceLoader.loadResources([
            { name: networkCallMap.companyTable.name, type: "ajax", path: networkCallMap.companyTable.path }
          ]);
          loaded.then((results) => {
            let resultsObj = ResourceLoader.resourcesToObject(results);
            resolve(resultsObj.companyTable.data.player_company);
          });
        });
      }

      _setBuildBtnStatus(state = "view") {
        if (state === "view") {
          $('#' + this._facilityButtonId).removeClass(["building", "no-hover"]);
          $.post(networkCallMap.companyTable.path + "pcstate=" + state, (data) => { console.log("successful POST", data) });
          this._buildStatus = "view";
        }
        else if (state === "build") {
          $('#' + this._facilityButtonId).addClass(["building", "no-hover"]);
          $.post(networkCallMap.companyTable.path + "pcstate=" + state, (data) => { console.log("successful POST", data) });
          this._buildStatus = "build";
        }
        else if (state === "turn") {
          $('#' + this._facilityButtonId).addClass(["no-hover"]);
          $('#' + this._facilityButtonId).removeClass(["building"]);
          this._buildStatus = "turn";
        }
      }

      _setBuildBtnEvent() {
        $('#' + this._facilityButtonId).click(this, (evt) => {
          // console.log("evt = ", evt)
          const scope = evt.data;
          const loaded = ResourceLoader.loadResources([
            { name: networkCallMap.companyTable.name, type: "ajax", path: networkCallMap.companyTable.path }
          ]);
          loaded.then((results) => {
            let resultsObj = ResourceLoader.resourcesToObject(results);
            //console.log("resultsObj = ", resultsObj)
            const state = resultsObj.companyTable.data.player_company.state;
            if (state === "view")
              scope._setBuildBtnStatus("build")
            else if (state === "build")
              scope._setBuildBtnStatus("view")
            else if (state === "turn")
              scope._setBuildBtnStatus("turn")
            else
              return;
          });
        });
      }

      // _setBuildStatus() {
      //   $('#' + this._facilityButtonId).addClass(["building", "no-hover"]);
      //   $.post(networkCallMap.companyTable.path + "pcstate=build", (data) => { console.log("successful POST", data) });
      //   this._buildStatus = "build";
      // }

      // _setViewStatus() {
      //   $('#' + this._facilityButtonId).removeClass(["building", "no-hover"]);
      //   $.post(networkCallMap.companyTable.path + "pcstate=view", (data) => { console.log("successful POST", data) });
      //   this._buildStatus = "view";
      // }

      // _setTurnStatus() {
      //   $('#' + this._facilityButtonId).addClass(["no-hover"]);
      //   $('#' + this._facilityButtonId).removeClass(["building"]);
      //   this._buildStatus = "turn";
      // }
    });
});
