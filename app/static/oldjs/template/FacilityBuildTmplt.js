define([
], function () {
  return ({
    facilityBuildDialogWindow: `
      <div id="build-facility-dialog" prefix="bfd">
        <div id="bfd-facility-window" class=""></div>
        <div id="bfd-error-dialog-box" class="">
        </div>
      </div>
    `,
    facilityHeader: `
      <div class="bfd-facility-header-info">
        <div class="bfd-facility-header-type">
          <label class=""><b>{{facilityDef.facilityType}}</b></label>
          <label class="">({{totalCapacityAvailable}} MW)</label>
          <span class="tooltip-text">Available capacity</span>
        </div>
        <span class="row bfd-facility-header-gentype">
          <span class="col-sm-1"></span>
          <label class="col-sm-2"> Generator Type: </label>
          <select class="col-sm-5 bfd-select-generator-type">
            {{#each facilityDef.generatorTypes}}
              {{#ifEquals @index ../selectedIndex}}
                <option index="{{@index}}" value="{{name}}" selected="true">{{name}} ({{maxCapacity}} MW)</option>
              {{else}}
                <option index="{{@index}}" value="{{name}}">{{name}} ({{maxCapacity}} MW)</option>
              {{/ifEquals}}
            {{/each}}
          </select>
          <span class="col-sm-1"></span>
          <button class="col-sm-1" id="bfd-add-generator-button"> + G </button>
          <span class="tooltip-text">Add Generator</span>
        </span>
        <hr/>
      </div>
    `,
    facilityGeneratorList: `
      <div class="bfd-facility-generator-list">
        {{#each generatorList}}
          <div class="bfd-facility-generator-list-button">
            <button idx="{{@index}}" class="bfd-remove-generator-button"> - G </button>
            <span class="tooltip-text"></span>
            <select class="bfd-select-generator-capacity">
              {{#each ../generatorDetails.generatorCapacities}}
                {{#ifEquals @index ../this.generatorDetailsIndex}}
                  <option genindex="{{@../index}}" index="{{@index}}" capacity="{{capacity}}" selected="true"> {{capacity}} MW</option>  
                {{else}}
                  <option genindex="{{@../index}}" index="{{@index}}" capacity="{{capacity}}"> {{capacity}} MW</option>
                {{/ifEquals}}
              {{/each}}
            </select>              
            <span class="tooltip-text">Add Generator</span>
            <span class="bfd-generator-cost">
              <label class="">cost: </label>
              {{#with (lookup ../generatorDetails.generatorCapacities generatorDetailsIndex)}} 
                <label class=""> {{cost}} </label>
              {{/with}}
            </span>
            </div>
        {{/each}}
      </div>
      <hr/>
    `,
    facilitySummary: `
      <div class="bfd-facility-summary-info">

        <span class="row">
          <label class="bfd-data-row-label col-sm-3"><b>Total Capacity:</b></label>
          <label class="bfd-data-row-value col-sm-2"> {{totalCapcity}} MW</label>
        </span>

        <span class="row">
          <label class="bfd-data-row-label col-sm-3"><b>total Cost:</b></label>
          <label class="bfd-data-row-value col-sm-2"> {{totalCost}}</label>
        </span>     

        <span class="row">
          <label class="bfd-data-row-label col-sm-3"><b>Total Build Time:</b></label>
          <label class="bfd-data-row-value col-sm-2"> {{totalBuildTime}}</label>          
        </span>

        <span class="row">
          <label class="bfd-data-row-label col-sm-3"><b>Life Expectancy:</b></label>
          <label class="bfd-data-row-value col-sm-2"> {{lifeExpectancy}}</label>
        </span>
       </div>
      <hr/>
    `,
    facilityConfirmButtons: `
    <div class="bfd-facility-buttons">
      <div class="row">
        <span class="col-sm-3"></span>
        <button id="bfd-back-button" class="col-sm-2"><< Back</button>
        <button id="bfd-build-button" class="col-sm-2">Build</button>
        <button id="bfd-cancel-button" class="col-sm-2">Cancel</button>
        <span class="col-sm-3"></span>
      </div>
    </div>    
    `
  });
});



