define([], function () {
  return ({
    facilityView: `
      <div id="view-facility-dialog" prefix="vfd">
        <div id="facility-header-window" class="vfd-header"></div>
        <div id="facility-info-window"></div>
        <div id="generator-list-window"></div>
        <div id="facility-footer-window" class="vfd-footer"></div>
      </div>
    `,

    facilityViewHeader: `
      <header>
        <button class="vfd-facility-image-btn floatleft" btn-image="{{simpleType}}" disabled="true"></button> 
        <button class="vfd-facility-image-btn floatright" btn-image="{{simpleType}}" disabled="true"></button> 
        <h4 class="vfd-facility-name"> {{facilityName}} </h4>
        <input id="" class="" type="text" value="{{facilityName}}" style="display:none"> 
      </header>
      <hr/>
    `,

    facilityViewInfo: `
      <div class="container">
        <div class="row">
          <div class="col-xl-6">
            <div class="row">
              <h6 class="col-lg-6"> Faclity Type: </h6>
              <label class="col-lg-6"> {{ facilityType.name }} </label>
            </div>
            <div class="row">
              <h6 class="col-lg-6"> Build Cost: </h6>
              <label class="col-lg-6"> $ {{ formatCurrency facilityType.fixed_cost_build }} </label>
            </div>
            <div class="row">
              <h6 class="col-lg-6"> Operating Cost: </h6>
              <label class="col-lg-6"> $ {{ formatCurrency facilityType.fixed_cost_operate }} </label>
            </div>
            <div class="row">
              <h6 class="col-lg-6"> Time to Build: </h6>
              <label class="col-lg-6"> {{ facilityType.build_time }} Quarters</label>
            </div>
            <div class="row">
              <h6 class="col-lg-6"> Number Generators: </h6>
              <label class="col-lg-6"> {{ numGenerators }} </label>
            </div>          
          </div>

          <div class="col-xl-6">
            <div class="row">
              <h6 class="col-lg-7"> Owner: </h6>
              <label class="col-lg-5"> {{ facility.company_name }} </label>
            </div>
            <div class="row">
              <h6 class="col-lg-7"> Start Build Date: </h6>
              <label class="col-lg-5"> {{ facility.start_build_date }} </label>
            </div>
            <div class="row">
              <h6 class="col-lg-7"> End Build Date: </h6>
              <label class="col-lg-5"> {{ facility.start_prod_date }} </label>
            </div>
            <div class="row">
              <h6 class="col-lg-7"> Activity Status: </h6>
              <label class="col-lg-5"> {{ facility.state }} </label>
            </div>
            <div class="row">
              <h6 class="col-lg-7"> Nameplate Capacity: </h6>
              <label class="col-lg-5"> {{ facility.total_capacity }} MWh </label>
            </div>
          </div>
        </div>
      </div>
      <hr/>
    `,
    generatorViewList: `
      <div class='generator-list'>
        <table class='generator-list-table'>
          <thead>
            <tr>
              <th> Action </th>
              <th class="generator-add-button"> <button type='button'> (+) </button></th>
              <th> Gen Type </th>
              <th> NP Capacity (MWh)</th>
              <th> State </th>
              <th> Age </th>
              <th> Bid Policy </th>
              <th> Bid Value </th>
            </tr>
          </thead>
          <tbody>
            {{#each generators}}
              <tr>
                <td class="generator-minus-button"> 
                  {{#if new_generator}}
                    <button type='button'> Remove </button>
                  {{else}}
                    <button type='button'> Decom </button>
                  {{/if}}
                </td>
                <td> #{{@index}} </td>
                <td>{{ gentype_details.pt.name }}</td>
                <td>{{ gentype_details.nameplate_capacity }}</td>
                <td>{{ state }}</td>
                <td> ?? Years </td>
                <td> {{ local_bid_policy }}</td>
                <td> $ {{formatCurrency bid_policy_value }}</td>
              </tr>
            {{/each}}
          </tbody>
          <tfoot>
          </tfoot>
        </table>
      </div>
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
              <button id="vfd-footer-apply-btn" disable="true"> Apply </button>
            {{/if}}
            <button id="vfd-footer-close-btn"> Close </button>
          </div>
          <div class="col-lg-4"></div>
        </div>
      </div>
    `,
  });
});