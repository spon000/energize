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
        <div class="row">
          <div class="col-lg-4"></div>
          <div class="vfd-footer-buttons col-lg-4">
            {{#if applyOn}}
              <button id="vfd-footer-apply-btn"> Apply </button>
            {{else}}
              <button id="vfd-footer-apply-btn" disabled="true"> Apply </button>
            {{/if}}
            <div class="vfd-btn-divider"></div>
            <button id="vfd-footer-close-btn"> Close </button>
          </div>
          <div class="col-lg-4"></div>
        </div>
      </div>
    `,

    verifyDialog: `
      <div class='verify-close'>
        <p> You have made modifications to this facility. If you close now before applying them
          you will lose all of those changes. </p>
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


             // <label for="one">
                //   <input type="checkbox" id="one" />Mod 1</label>
                // <label for="two">
                //   <input type="checkbox" id="two" />Mod 2</label>
                // <label for="three">
                //   <input type="checkbox" id="three" />Mod 3</label>


// <div class="row">
// <h6 class="col-lg-6"> Time to Build: </h6>
// <label class="col-lg-6"> {{ facilityType.build_time }} Quarters</label>
// </div>
// <div class="row">
// <h6 class="col-lg-6"> Number Generators: </h6>
// <label class="col-lg-6"> {{ numGenerators }} </label>
// </div>          
// </div>

// <div class="col-xl-6">
// <div class="row">
// <h6 class="col-lg-7"> Owner: </h6>
// <label class="col-lg-5"> {{ facility.company_name }} </label>
// </div>
// <div class="row">
// <h6 class="col-lg-7"> Start Build Date: </h6>
// <label class="col-lg-5"> {{ facility.start_build_date }} </label>
// </div>
// <div class="row">
// <h6 class="col-lg-7"> End Build Date: </h6>
// <label class="col-lg-5"> {{ facility.start_prod_date }} </label>
// </div>
// <div class="row">
// <h6 class="col-lg-7"> Activity Status: </h6>
// <label class="col-lg-5"> {{ facility.state }} </label>
// </div>

// {/* <div class="row">
// <h6 class="col-lg-6"> Operating Cost: </h6>
// <label class="col-lg-6"> $ {{ formatCurrency facilityType.fixed_cost_operate }} </label>
// </div> */}




// {/* <table class='generator-list-table'>
// <thead>
//   <tr>
//     <th> Action </th>
//     <th class="generator-add-button"> <button type='button'> (+) </button></th>
//     <th> Gen Type </th>
//     <th> NP Capacity (MWh)</th>
//     <th> State </th>
//     <th> Age </th>
//     <th> Bid Policy </th>
//     <th> Bid Value </th>
//   </tr>
// </thead>
// <tbody>
//   {{#each generators}}
//     <tr>
//       <td class="generator-minus-button"> 
//         {{#if new_generator}}
//           <button type='button'> Remove </button>
//         {{else}}
//           <button type='button'> Decom </button>
//         {{/if}}
//       </td>
//       <td> #{{@index}} </td>
//       <td>{{ gentype_details.pt.name }}</td>
//       <td>{{ gentype_details.nameplate_capacity }}</td>
//       <td>{{ state }}</td>
//       <td> ?? Years </td>
//       <td> {{ local_bid_policy }}</td>
//       <td> $ {{formatCurrency bid_policy_value }}</td>
//     </tr>
//   {{/each}}
// </tbody>
// <tfoot>
// </tfoot>
// </table> */}