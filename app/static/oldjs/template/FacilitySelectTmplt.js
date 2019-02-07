define([], function () {
  return ({
    facilitySelectDialogWindow: `
      <div id="select-facility-dialog" prefix="sfd">
        <div id="sfd-facility-buttons" class="sfd-facility-buttons"></div>
        <div id="sfd-facility-details"></div>
        <div id="sfd-facility-message"></div>
      </div>
    `,

    facilityTypeButtons: `
      <div class="row">
        <div class="col-sm-1"></div>
          {{#each facilityTypes}}
            <div class="col-sm-1 sfd-facility-button">
              {{#if enabled}}
                <button id="{{elementIdPrefix}}-facility-btn" name="{{elementIdPrefix}}"></button>
                <span class="tooltip-text">{{facilityType}}</span>
              {{else}}
                <button id="{{elementIdPrefix}}-facility-btn" disabled></button>
                <span class="tooltip-text">{{facilityType}} <br/> (Not Available)</span>
              {{/if}}
            </div>
          {{/each}}
        <div class="col-sm-2"></div>      
      </div>
    `,

    facilityWindows: `
      <div class="sfd-facility-detail-scroll">
        {{#each facilityTypes}}
          <div id="sfd-facility-detail-window-{{elementIdPrefix}}" class="sfd-not-selected sfd-facility-detail-window"></div>
        {{/each}}
      </div>
    `,

    facilityDetailData: `
      <div class="sfd-facility-details-data">
        <div class="row">
          <h4 class="col-sm-12 sfd-facility-details-data-facilitytype">{{facilityType}}</h4>
        </div>
        <div class="row">
          <label class="col-sm-12"><b>Generator Types (max MW): </b></label>
        </div>
        {{#each generatorTypes}}
          <div class="row sfd-generator-type-row">
            <div class="col-sm-1"></div>
            <label class="col-sm-8">{{name}} ({{maxCapacity}})</label>
            <div class="col-sm-3"></div>
          </div>
        {{/each}}
        <br/>
        <br/>
        <span class="row">
          <label class="sfd-data-row-label col-sm-1"><b>Marginal Cost:</b></label>
          <label class="sfd-data-row-label col-sm-5"></label>
          <label class="sfd-data-row-value col-sm-1"> {{marginalCost}}</label>
        </span>

        <span class="row">
          <label class="sfd-data-row-label col-sm-1"><b>Localized Cost:</b></label>
          <label class="sfd-data-row-label col-sm-5"></label>
          <label class="sfd-data-row-value col-sm-1"> {{localizedCost}}</label>
        </span>     

        <span class="row">
          <label class="sfd-data-row-label col-sm-1"><b>Operation Cost:</b></label>
          <label class="sfd-data-row-label col-sm-5"></label>
          <label class="sfd-data-row-value col-sm-1"> {{operationalCost}}</label>          
        </span>

        <span class="row">
          <label class="sfd-data-row-label col-sm-1"><b>Life Expectancy:</b></label>
          <label class="sfd-data-row-label col-sm-5"></label>
          <label class="sfd-data-row-value col-sm-1"> {{lifeExpectancy}}</label>
        </span>
        <span class="row">
          <label class="sfd-data-row-label col-sm-1"><b>Build Time:</b></label>
          <label class="sfd-data-row-label col-sm-5"></label>
          <label class="sfd-data-row-value col-sm-1"> {{buildTime}}</label>
        </span>        
        <span class="row">
          <label class="sfd-data-row-label col-sm-1"><b>Storage Waste:</b></label>
          <label class="sfd-data-row-label col-sm-5"></label>
          <label class="sfd-data-row-value col-sm-1"> {{storageWaste}}</label>
        </span>        
        <div class="row">
          <button id="{{elementIdPrefix}}-select-facility-data-btn" class="sfd-select-facility-data-btn col-sm-12" name="{{facilityType}}">Select</button>
        </div>
      </div>      
    `
  });
});
