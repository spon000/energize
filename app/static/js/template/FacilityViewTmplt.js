define([], function () {
  return ({
    facilityViewDialogWindow: `
      <div id="view-facility-dialog" prefix="vfd">
        <div id="facility-header-window" class="header"></div>
        <div id="facility-windows-row" class="row">
          <div id="facility-info-window"></div>
          <div id="generator-list-window"></div>
          <div id="generator-info-window"></div>
        </div>
        <div id="facility-footer-window" class="footer"></div>
      </div>
    `,

    facilityViewHeaderWindow: `
      <div class="header">
        <button class="vfd-facility-btn" btn-image="{{simpletype}}" disabled="true"></button> 
        <h3> {{facilityName}} </h3>
        <input id="" class="" type="text" value="{{facilityName}}" style="display:none">
      </div>
    `,

    facilityViewInfoWindow: `
    `,
    generatorViewListWindow: `
    `,
    generatorVInfoWindow: `
    `,
    facilityViewFooterWindow: `
    `,
  });
});