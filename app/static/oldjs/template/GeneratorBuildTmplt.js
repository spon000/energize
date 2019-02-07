define([], function () {
  return ({
    header: `
      <div class='generator-build'>
        <div id='generator-build-header'>
          <div class='row'>
            <div class='col-sm-5'>
              <h6>Generator:</h6>
            </div>
            <div class='col-sm-3'>
              <label id='label-generator-type'>{{generatorType}}</label>
            </div>
            <div class='col-sm-2'></div>
            <div class='col-sm-2'>
              <button id='add-generator-btn' class='btn'>+</button>
            </div>
          </div>
          <div class='row'>
            <div class='col-sm-5'>
              <h6>Available Capacity:</h6>
            </div>
            <div class='col-sm-3'>
              <label id='label-generator-available-capacity'>{{availableCapacity}} MW</label>
            </div>
            <div class='col-sm-5'></div>            
          </div>
        </div>
        <div id='build-generator-table' class='generator-table'></div>
      </div>
    `,
    content: `
      <div id='generator-row-{{ generatorId }}' class='generator-row' gennumer='{{ generatorId }}' >
        <div class='row'>
          <div class='col-sm-1'>
            <h6> #{{ generatorId }} </h6>
          </div>
          <div class='col-sm-2'>
            <label class='slider-label'>
              {{ minCapacity }} MW
            </label>
          </div>
          <div class='col-sm-4'>
            <input type='range' class='slider-generator-capacity' id='slider-generator-capacity-{{ generatorId }}' min='5' max='{{ maxCapacity }}' value='5'
              step='5'>
          </div>
          <div class='col-sm-3'>          
            <label class='slider-label'>
              {{ maxCapacity }} 
            </label>          
          </div>
           <div class='col-sm-1'>
            <button class='minus-generator-btn btn' id='minus-generator-btn-{{ generatorId }}'>-</button>
          </div>
          <div class='col-sm-1'></div>
        </div>
        <div class='row'>
          <div class='col-sm-4'></div>
          <div class='col-sm-3'>
            <label class='slider-label' id='generator-capacity-label-{{ generatorId}}'>
              {{ minCapacity }} MW
            </label>
          </div>            
          <div class='col-sm-4'></div>
        </div>
      </div>
    `,
    footer: ``
  });
});