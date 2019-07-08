define([], function () {
  return ({
    facilityView: `
      <div id="view-facility-dialog" prefix="vfd">
        <div id="facility-header-window" class="vfd-header"></div>
        <div id="facility-powerplant-pic"></div>
        <div id="facility-info-window"></div>
        <div id="generator-list-header"></div>
        <div id="generator-list-window"></div>
        <div id="facility-footer-window" class="vfd-footer"></div>
      </div>
    `,
    facilityViewHeader: `
      <div class="vfd-title">
        <h5 class="vfd-facility-name" style="display:none"> {{facilityName}} </h5>
        <input id="" class="vfd-facility-name-input" type="text" value="{{facilityName}}" z-index="100"> 
        <button class="vfd-facility-image-btn" btn-image="{{simpleType}}" disabled="true"></button> 
      </div>
    `,
    facilityFacilityPicture: `
      <div class="vfd-powerplant-panel">
        <img class="vfd-powerplant-img" src="/static/img/background/{{simpleType}}-powerplant-pic-sm.jpg" alt="picture of {{maintype}} power plant"></img>
      </div>
    `,
    facilityViewInfo: `
      <div class="vfd-facility-summary-panel">
        <div class="vfd-facility-summary">
          <div id="vfd-verify-dialog">
            <div id="vfd-verify-dialog-content"></div>
          </div>
          <div class="container">
            <div class="row">
              <h6 class="col-lg-4" style="font-weight: bold;"> Owner: </h6>
              <label class="col-lg-4"> {{ facility.company_name }} </h6>
            </div>

            <div class="row">
              <h6 class="col-lg-4" style="font-weight: bold;"> OM Costs: </h6>
              <label class="col-lg-4"> $ </label>
            </div>

            <div class="row">
              <h6 class="col-lg-4" style="font-weight: bold;"> Revenue: </h6>
              <label class="col-lg-4"> $ </label>
            </div>

            <div class="row">
              <h6 class="col-lg-4" style="font-weight: bold;"> Profit: </h6>
              <!-- <label class="col-lg-4"> $ {{ formatCurrency facilityType.fixed_cost_build }} </label> -->
              <label class="col-lg-4"> $ </label>
            </div>

            <div class="row">
              <h6 class="col-lg-4" style="font-weight: bold;"> Capacity: </h6>
              <label class="col-lg-4"> {{ facility.total_capacity }} MWh </label>
            </div>

            <div class="row">
              <h6 class="col-lg-4" style="font-weight: bold;"> Num. Generators: </h6>
              <label class="col-lg-4"> {{ numGenerators }}  </label>
            </div>
          </div>
        </div>

        <div class="container">
          {{#if owned}}
          <div class="row">
            <div class="vfd-multiselect col-xl-12">
              <div class="selectbox">
                <select>
                    <option> Facility-wide modifications </option>
                </select>
                <div class="overselect"></div>
              </div>
              <div id="vfd-facility-checkboxes" expanded="false">
              {{#each modTypes}}
                <label for="vfd-chkbox-{{ @index }}" class="vfd-facility-checkbox">
                  <input type="checkbox" id="vfd-ckkbox-{{ @index }}" modid="{{ id }}" /> {{ name }} </label>
              {{/each}}
              </div>
            </div>                
          </div>
          {{/if}}
        </div>
      </div>
    `,
    generatorListHeader: `
      <div class='vfd-gen-list-header'>
      {{#if owned}}
        <label class="gen-header-detail"> Generator List (Click on a generator name for more details) </label>
        <label class="gen-header-btn"> <button id="vfd-sub-gen-btn"> &#x2796 </button> </label>
        <label class="gen-header-btn"> <button id="vfd-add-gen-btn"> &#x2795 </button> </label>
      {{/if}}        
      </div>
    `,
    generatorViewList: `
      <div id="vfd-gen-list">
        <div id="vfd-gen-list-table"></div>
      </div>
      <p/>
    `,
    facilityViewFooter: `
      <div class="container">
        <div class="row"></div>
        <div class="row justify-content-center">
          <div class="col-lg-3"></div>
          <div class="vfd-footer-buttons col-lg-7">
            <div class="vfd-btn-divider"></div>
            {{#if applyOn}}
              <button id="vfd-footer-apply-btn"> Apply </button>
            {{else}}
              <button id="vfd-footer-apply-btn" disabled="true"> Apply </button>
            {{/if}}
            <div class="vfd-btn-divider"></div>
            <button id="vfd-footer-close-btn"> Close </button>
            <div class="vfd-btn-divider"></div>
            <button id="vfd-footer-back-btn"> << Back </button>
          </div>
          <div class="col-lg-2"></div>
        </div>
      </div>
    `,
    verifyChangeDialog: `
      <div class='verify-close'>
        <p> You have made modifications to this facility. If you close now before applying them
          you will lose all of those changes. </p>
        <p class='highlight'> Are you sure you want to close this dialog? </p>
      </div>
    `,
    verifyNewDialog: `
      <div class='verify-close'>
        <p> This facility isn't finalized yet. If you close the window without applying
          this facility will be removed from the map. </p>
        <p class='highlight'> Are you sure you want to close this dialog? </p>
      </div>
    `,
    selectCapacity: `
      <div class="capacity-selectbox">
        <select>
        {{#each genTypes}}
          <option value="{{nameplate_capacity}}"> {{nameplate_capacity}} MW</option>
        {{/each}}
        </select>
      </div>
    `
  });
});