define([
  "ModelData"
], function (ModelData) {
  return ({

    setCompanyState(context, companyState) {
      ModelData.getCompany().then((result) => {
        context.commit('setCompanyState', companyState);
      });

    },
    getCompany(context, payload) {

    }

  });
});
