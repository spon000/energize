define([
  "jquery"
], function ($) {
  const cssHtml = `
    #
  `
  return (
    class MessageBox {
      constructor() {
        this._messageBox = null;
        this._messageListId = "message-box-messages";
        this._messageClass = "message-box-message";
        this._messageCssStyle = `
          <style>
            #${this._messageListId} {
              list-style-type: none;
              list-stype-position: inside;
              padding-left: 15px;
            }

            .${this._messageClass} {
            }

            .fine {
              color: black;
            }

            .warn {

            }

            .bad {

            }

            .current {
              background-color: gray;
              color: #fff;
              border-radius: 5px;
              border-style: solid;
              border-width: 1px;
              padding-left: 15px;
              margin-left: -15px;
            }
          </style>
        `
      }

      initialize(elementId) {
        this._messageBox = $("#" + elementId)[0];
        $(this._messageBox).append(this._messageCssStyle);
        $(this._messageBox).append(`<ul id='${this._messageListId}'></ul>`);
      }

      // msgParms = {title, msg, color}
      postMessage(msgParms = {}) {
        let title = msgParms['title'] ? msgParms['title'] + ":" : "";
        let style = msgParms['style'] || "";
        let type = msgParms['type'] || "fine";
        let msg = msgParms['msg'] || "";
        $("#" + this._messageListId + " > li").removeClass("current");
        $(this._messageBox).find("#" + this._messageListId).prepend(`
          <li class="${this._messageClass} current" style="${style}"> ${title} ${msg}</li>
        `)
      }

      clearMessageBox() {
        $(this._messageBox).empty();
        $(this._messageBox).append(`<ul id='${this._messageListId}'></ul>`)
      }


      _getTypeMessage(type) {
        // switch (type) {
        //   case "fine":
        //     return ".fine"
        //     casse ""

        // }
      }
    });
});