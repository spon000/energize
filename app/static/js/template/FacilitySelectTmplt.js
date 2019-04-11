define([], function () {
  return ({
    facilitySelectDialogWindow: `
      <div id="select-facility-dialog" prefix="sfd">
        <div id="sfd-facility-buttons" class="sfd-flex-button-container"></div>
        <div id="sfd-facility-details"></div>
        <div id="sfd-facility-message"></div>
      </div>
    `,

    facilityTypeButtons: `
      <div class="sfd-button-spacer"></div>
      <div class="sfd-button-spacer"></div>
      {{#each facilityButtons}}
        <div class="sfd-facility-div">
          {{#if enabled}}
            <button id="{{id}}-{{simpletype}}-facility-btn" class="sfd-facility-btn" btn-image="{{simpletype}}" name="{{maintype}}"></button>
            <span class="tooltip-text">{{maintype}}</span>
          {{else}}
            <button id="{{id}}-{{simpletype}}-facility-btn" class="sfd-facility-btn" btn-image="{{simpletype}}-disabled" name="{{maintype}}" disabled></button>
            <span class="tooltip-text">{{maintype}} <br/> (Not Available)</span>
          {{/if}}
        </div>
      {{/each}}
      <div class="sfd-button-spacer"></div>
      <div class="sfd-button-spacer"></div>
    `,

    facilityWindows: `
      <div class="sfd-facility-detail-scroll">
        {{#each facilityTypes}}
          <div id="sfd-facility-detail-window-{{id}}" class="sfd-not-selected sfd-facility-detail-window" facility-id="{{id}}" name="{{maintype}}"></div>
        {{/each}}
      </div>
    `,

    facilityDetailData: `
      <div class="sfd-facility-details-data">
        <div class="row">
          <h4 class="col-sm-12 sfd-facility-details-data-facilitytype simpletype-{{simpletype}}">{{facilityTypeName}}</h4>
        </div>
        <br/>
        <table class="data-details-table">
          <tbody>
            <tr>
              <td class="td-tip">
                <div class="help-tip">
                  <p>This is the fixed build cost for the facility only (does not include generators). This cost will be equally divided between turns until the facility is completed.</p>
                </div>
              </td>
              <td class="td-label">Build Cost:</td>
              <td class="td-value">{{fixedCost}}</td>
            </tr>

            <tr>
              <td class="td-tip">
                <div class="help-tip">
                  <p>This is the fixed operating cost for the facility. Each turn this cost is applied to your total quarterly expenditures for facility operation.</p>
                </div>
              </td> 
              <td class="td-label">Operating Cost:</td>
              <td class="td-value">{{fixedOperateCost}}</td>
            </tr>

            <tr>
              <td class="td-tip">
                <div class="help-tip">
                  <p> Minimum Area is the minimal amount of land area that is required for the facility. The unit of measure is square meters.</p>
                </div>
              </td>
              <td class="td-label">Minimum Area:</td>
              <td class="td-value">{{minimumArea}}</td>
            </tr>

            <tr>
              <td class="td-tip">
                <div class="help-tip">
                  <p> The number of turns that are required to complete this facility so that it will be available for use.</p>
                </div>
              </td>
              <td class="td-label">Build Time:</td>
              <td class="td-value">{{buildTime}}</td>
            </tr>          
          </tbody>
        </table>
        <br/>
        <div class="row">
          <button class="sfd-select-facility-data-btn simpletype-{{simpletype}} col-sm-12" facility-id="{{facilityId}}" name="{{facilityTypeName}}">Select</button>
        </div>
      </div>      
    `
  });
});






