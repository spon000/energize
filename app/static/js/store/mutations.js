define([
  "ModelData"
], function (ModelData) {
  return ({
    setCompanyState(state, payload) {
      state.company.state = ModelData.setCompanyState().then();

      return state
    }

  });
});
