define([
  // Libs
  "jquery",
  "jqueryui",
  "Handlebars",
  "evtEmitter",
  "ModelData"
], function (
  $,
  JQUI,
  Handlebars,
  evtEmitter,
  ModelData,

  ) {
    return (
      class PortfolioViewDialog {
        constructor() {
          this._modelData = new ModelData();
          this._openPortfolioDialog(this);
        }

        _openPortfolioDialog(scope, closeFunction = null) {
          this._modelData.getPortfolioHtml().then((html) => {
            $("#portfolio-dialog").empty()
            $("#portfolio-dialog").append(html)

            let generatorDialog = $("#portfolio-dialog").dialog({
              title: "Company Portfolio",
              scope: scope,
              width: 750,
              height: 650,
              position: {},
              modal: true,
              open: (evt, ui) => {
                // $('.ui-dialog-titlebar').after("<h4> Company Portfolio </h4>");
              },
              close: (evt, ui) => {
              },
              buttons: [
                {
                  text: "Close",
                  click: function (evt) {
                    $(this).dialog("close")
                    if (closeFunction)
                      closeFunction(scope)
                  }
                }
              ]
            })
          });
        }
      });
  });