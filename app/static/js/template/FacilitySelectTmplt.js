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
              <td class="td-label">Capitol Cost:
                <p>This reflects the change in cost associated with capacity and market fluctuations.</p>
              </td>
              <td class="td-value">{{fixedCost}} /MW</td>
            </tr>

            <tr>
              <td class="td-label">LCOE:
                <p>(Levelized Cost of Electricity) The LCOE represents the break-even cost over the facility lifetime. This includes all of the build, operation, maintenance, and decommissioning costs over the lifetime of the facility.</p>
              </td>
              <td class="td-value">{{fixedOperateCost}} /MWh</td>
            </tr>

            <tr>
              <td class="td-label">Fixed Operating Cost:
                <p>This is the cost of owning a facility whether or not your facility is generating electricity. This includes labor and maintenance, among other things, but does not include fuel costs.</p>
              </td>
              <td class="td-value">{{fixedOperateCost}} /MW</td>
            </tr>

            <tr>
              <td class="td-label">Capacity Factor:
                <p> The capacity factor reflects the electricity produced with respect to the maximum electricity produced if operating at full capacity 100% of the time. That is, capacity factor compares actual (or expected) generation to theoretical maximum generation.</p>              
              </td>
              <td class="td-value">%</td>
            </tr>
            
            <tr>
              <td class="td-label">Nameplate Capacity:
                <p> The nameplate capacity is the theoretical maximum power generation.</p>
              </td>
              <td class="td-value"> MW</td>
            </tr>

            <tr>
              <td class="td-label">Build Time:
                <p> The amount of (predicted) time it will take to build the facility and generators expressed in quarters, where one quarter is one game turn.</p>
              </td>
              <td class="td-value">{{buildTime}} quarters</td>
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






