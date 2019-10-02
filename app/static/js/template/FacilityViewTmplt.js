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
          <input id="vfd-facility-name-input" class="" type="text" fid="{{fid}}" value="{{facilityName}}" style="position:absolute;top:6px;left:5px;"> 
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

          <div id="vfd-info-message-dialog"></div>
          
          <div class="container">
            <div class="row">
              <h6 class="col-lg-5" style="font-weight: bold;"> Owner: </h6>
              <label class="col-lg-4"> {{ facility.company_name }} </h6>
            </div>

            <div class="row">
              <h6 class="col-lg-5" style="font-weight: bold;"> OM Costs: </h6>
              <label class="col-lg-4"> $ </label>
            </div>

            <div class="row">
              <h6 class="col-lg-5" style="font-weight: bold;"> Revenue: </h6>
              <label class="col-lg-4"> $ </label>
            </div>

            <div class="row">
              <h6 class="col-lg-5" style="font-weight: bold;"> Profit: </h6>
              <!-- <label class="col-lg-4"> $ {{ formatCurrency facilityType.fixed_cost_build }} </label> -->
              <label class="col-lg-4"> $ </label>
            </div>

            <div class="row">
              <h6 class="col-lg-5" style="font-weight: bold;"> Capacity: </h6>
              <label class="col-lg-4"> {{ facility.total_capacity }} MW </label>
            </div>

            <div class="row">
              <h6 class="col-lg-5" style="font-weight: bold;"> Num. Generators: </h6>
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

    generatorListTabs: `
      <style>
        #generator-list-tab-menu {
          width: 100%;
          margin-top:10px;
        }

        .generator-list-tabs {
          margin-bottom: 0;
          padding-left: 20px;
        }

        .generator-list-tabs li {
          list-style:none;
          display:inline;
          padding:
        }

        .generator-list-tabs label {
          padding:5px 10px;
          margin-bottom: 0;
          display:inline-block;
          border-radius: 10px 10px 0 0;
          background:#666;
          color:#fff;
        }

        .generator-list-tabs label.active {
          background:#BCDBEA;
          font-weight: bold;
          color:#000;
        }    
        
        .vfd-list-table {
          margin-top: 0;
          margin-bottom: 0;
        }

        .table-display-none {
          display: none;
        }

        .element-hidden {
          visibility: hidden;
        }

        .element-hidden button {
          visibility: hidden;
        }
      </style>

      
      <br/>
      {{#if owned}}
        <div id="generator-list-tab-menu">
      {{else}}
        <div id="generator-list-tab-menu" class="element-hidden">
      {{/if}}
          <ul class="generator-list-tabs">
            <li class="generator-list-tab" type="list"><label id="vfd-gen-list-tab" class="active">Add/Change</label></li>
            <li class="generator-list-tab" type="mods"><label id="vfd-modify-list-tab">Modifications</label></li>
          <!--  <li class="generator-list-tab" type="decom"><label id="vfd-decom-list-tab">Decomissioned</label></li>  -->
          </ul>
        </div>
    `,

    generatorViewList: `
      <style>
        .gen-list-bottom-btn {
          margin-top: 2px;
          justify-content: left;
        }

        #vfd-add-gen-btn {
          background:repeating-linear-gradient(45deg, rgba(1, 1, 1, .3), rgba(1, 1, 1, .3) 10px, rgba(245, 203, 66, .3) 10px, rgba(245, 203, 66, .3) 20px);
        }

        #modify-list-table {
          float:left;
          width: 50%;
        }

        #generator-mod-list-table {
          height: 250px;
          margin-left: 10px;
          border-style: solid;
          border-width: 2px;
        }

        .modded-generator-checkbox-list {
          margin-top: 30px;
          margin-left: 30px;
        }
      </style>

      <div class="vfd-list-table">
        <div id="vfd-gen-list-table" class="list-table"></div>
      <!--  <div id="vfd-decom-list-table" class="list-table table-display-none"></div> -->
        <div id="vfd-modify-list-table" class="list-table table-display-none">
          <div id="modify-list-table" class=""></div>
          <div id="generator-mod-list-table" class=""></div>
        </div>
      </div>

      {{#if owned}}
      <div class="gen-list-bottom-btn"> 
      {{else}}
      <div class="gen-list-bottom-btn element-hidden"> 
      {{/if}}
      <button id="vfd-add-gen-btn">Build Generator</button> 
      </div>      
    `,

    listOfModdedGenerators: `
    <ul class="modded-generator-checkbox-list">
      <li> <input type="checkbox" class="modification-generator" modid=""/>Generator ??? </li>
      <li> <input type="checkbox" class="modification-generator" modid=""/>Generator ??? </li>
      <li> <input type="checkbox" class="modification-generator" modid=""/>Generator ??? </li>
    </ul>
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
              <button id="vfd-footer-apply-btn" disabled="true"> Apply </button>
            {{/if}}

            <div class="vfd-btn-divider"></div>
            <button id="vfd-footer-close-btn"> Close </button>             

            {{#if_eq state "new"}}
              {{#if facilityOwned}}
                <div class="vfd-btn-divider"></div>
                <button id="vfd-footer-remove-btn"> Remove </button>
              {{/if}}
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
    infoMessageDialog: `
    <div class='info-msg-dialog'>
      <p> {{msg}} </p>
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
    verifyDecomDialog: `
      <div class='verify-close'>
        <p>  Checking this box will start the decomissioning process for this generator on the next turn. 
              It will no longer be available to your facility. </p>
        <p class='highlight'> Do you want to continue? </p>
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
        <select genid="{{genId}}" MW">
        {{#each genTypes}}
          {{#if_eq ../capacity nameplate_capacity}}
            <option gtid="{{id}}" value="{{nameplate_capacity}}" selected="selected"> {{nameplate_capacity}} MW</option>
          {{else}}
            <option gtid="{{id}}" value="{{nameplate_capacity}}"> {{nameplate_capacity}} MW</option>
          {{/if_eq}}
        {{/each}}
        </select>
      </div>
    `,
    selectBidPolicy: `
      <div class="bidpolicy-selectbox">
        <select genid="{{genId}}">
        {{#each bidp_opts}}
          {{#if_eq ../bidp this}}
            <option value="{{this}}" selected="selected"> {{this}} </option>
          {{else}}
            <option value="{{this}}"> {{this}} </option>
          {{/if_eq}}
        {{/each}}
        </select>
      </div>
    `,
    selectMaintPolicy: `
      <div class="maintpolicy-selectbox">
        <select genid="{{genId}}">
        {{#each maintp_opts}}
          {{#if_eq ../maintp this}}
            <option value="{{this}}" selected="selected"> {{this}} </option>
          {{else}}
            <option value="{{this}}"> {{this}} </option>
          {{/if_eq}}
        {{/each}}
        </select>
      </div>
    `,
    checkboxDecom: `
      <div class="">
      {{#if decom_start}}
        <input type="checkbox" class="decom-checkbox" genid="{{genId}}" name="decom_start{{genid}}" checked>
      {{else}}
        <input type="checkbox" class="decom-checkbox" genid="{{genId}}" name="decom_start{{genid}}">
      {{/if}}
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
