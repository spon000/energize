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
        {{#if owned}}
          <input id="vfd-facility-name-input" class="" type="text" value="{{facilityName}}" style="position:absolute;top:6px;left:5px;"> 
        {{else}}
          <h5 class="vfd-facility-name" style="position:absolute;top:6px;left:5px;"> {{facilityName}} </h5>
        {{/if}}
        <button class="vfd-facility-image-btn" btn-image="{{simpleType}}" disabled="true" style="position:absolute;top:6px;left:220px;"></button> 
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

          <div id="vfd-generator-dialog"></div>
          
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
      <div class='vfd-gen-list-header list-color'>
        <div class='vfd-gen-list-header-content'>
        {{#if owned}}
          <label class="gen-header-detail list"> Generator List (Click on an available generator name for more details) </label>
          <label class="gen-header-detail decom" style="display:none;"> Generator Decom (Click on an available generator name to decomission it) </label>
          {{#if oldFacility}}
            <div class="gen-header-btn"> 
              <a id="vfd-sub-gen-btn"> &#x2796 </a> 
              <span class="tooltip-text"> Decommission </br> Generator</span>
            </div>
          {{/if}}
            <div class="gen-header-btn"> 
              <a id="vfd-add-gen-btn"> &#x2795 </a> 
              <span class="tooltip-text"> Add New </br> Generator</span>
            </div>
        {{/if}}
        </div>
      </div>

      <style>
        .gen-header-btn {
          border-radius: 4px;
          background: #ccc;
          cursor: pointer;
          border-top: solid 2px #eaeaea;
          border-left: solid 2px #eaeaea;
          border-bottom: solid 2px #777;
          border-right: solid 2px #777;
          padding: 3px 6px;
        }

        .gen-header-btn .down {
          border-radius: 4px;
          background: #bbb;
          border-top: solid 2px #777;
          border-left: solid 2px #777;
          border-bottom: solid 2px #eaeaea;
          border-right: solid 2px #eaeaea;
          padding: 3px 6px;
        }

        .gen-header-btn .tooltip-text {
          display: none;
          background-color: black;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px 3px;
        
          /* Position the tooltip */
          position: fixed;
          z-index: 1000;
        }
        
        .gen-header-btn:hover .tooltip-text {
          display: inline;
        }
        
      </style>
    `,
    generatorViewList: `
      <div id="vfd-gen-list">
        <div id="vfd-gen-list-table"></div>
      </div>
      <p/>
    `,
    facilityViewFooter: `
      <style>
        .center-block {
          text-align:center;
        }
      </style>

      <div class="container">
        <div class="row"></div>
        <div class="row justify-content-md-center">
          <div class="col col-lg-2"></div>
          <div class="vfd-footer-buttons col col-lg-8 md-auto">

            <div class="center-block">
            {{#if facilityOwned}}
              {{#if applyOn}}
                <button id="vfd-footer-apply-btn"> Apply </button>
              {{else}}
                <button id="vfd-footer-apply-btn" disabled="true"> Apply </button>
              {{/if}}
            {{/if}}

            {{#if_eq state "new"}}
              <div class="vfd-btn-divider"></div>
              <button id="vfd-footer-remove-btn"> Remove </button>
            {{else}}
              <div class="vfd-btn-divider"></div>
              <button id="vfd-footer-close-btn"> Close </button>
            {{/if_eq}}

            {{#if facilitySelected}}
              <div class="vfd-btn-divider"></div>
              <button id="vfd-footer-back-btn"> << Back </button>
            {{/if}}

            </div>
          </div>
          <div class="col col-lg-2"></div>
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
        <p class='highlight'> Are you sure you want to remove this facility? </p>
      </div>
    `,
    generatorNameLink: `
      <div class="vfd-generator-name">
        <a class="generator-name-link" href="#{{name}}" state="{{state}}" gid="{{gid}}" fid="{{fid}}" action="{{action}}"> {{name}} </a>

        {{#if_eq state "new"}}
          <span class="tooltip-text"> Remove </br> Generator</span>
        {{/if_eq}}

        {{#if_eq state "available"}}
          {{#if decom_on}}
            <span class="tooltip-text"> Decomission </br> Generator </span>
          {{else}}
            <span class="tooltip-text"> List </br> Details </span>
          {{/if}}
        {{/if_eq}}

        {{#if_eq state "building"}}  
          <span class="tooltip-text"> List </br> Details </span>
        {{/if_eq}}

        {{#if_eq state "decommissioned"}}  
          <span class="tooltip-text"> List </br> Details </span>
        {{/if_eq}}

        {{#if_eq state "decomissioning"}}
          {{#if_eq decom_turn 0}}
            <span class="tooltip-text"> Cancel </br> Decomission </span>
          {{else}}
            <span class="tooltip-text"> Details </span>
          {{/if_eq}}
        {{/if_eq}}
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
    `,
    selectBidPolicy: `
      <div class="bidpolicy-selectbox">
        <select>
        {{#each bidp_opts}}
          <option value="{{this}}"> {{this}} </option>
        {{/each}}
        </select>
      </div>
    `,
    colorBox: `
      {{#if_eq state "available"}}
        <label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px;background:{{color}};"></label>
      {{else}}
        <!-- how to do stripes - https://css-tricks.com/stripes-css/ - -->
        <label style="height:100%;width:100%;padding:5px;margin:0;border-style:solid;border-width:2px; background:repeating-linear-gradient(45deg, #010101, #010101 10px, #f5cb42 10px, #f5cb42 20px);"></label>
      {{/if_eq}}
    `
  });
});