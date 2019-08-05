define([
  "Vue",
  "viewFacilityHtml"
], function (Vue, viewFacilityHtml) {
  return (
    new Vue({
      el: "#facility-view-dialog-vue",
      template: viewFacilityHtml,
      data: {
        name: "Patrick"
      }
    })
  )
});