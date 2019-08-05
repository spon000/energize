define([
], function () {

  const cssHtml = `
    #
  `
  return (
    class MessageBox {
      constructor(elementId) {
        this._messageBox = $("#" + elementId).empty();
        this._messageListId = "mb-msgs";

        $(this._messageBox).append(`<ul id='${this._messageListId}'></ul>`)
      }

      // msgParms = {title, msg, color}
      postMessage(msgParms) {
        title = msgParms.title ? msgParms.title + ":" : "";
        color = msgParms.color || rgb(0, 0, 0)
        $(this._messageBox).find("#" + $this._messageListId()).append(`
          <li style='color: ${color}'> ${title} ${msg}</li>
        `)
      }

      clearMessageBox() {
        $(this._messageBox).empty();
        $(this._messageBox).append(`<ul id='${this._messageListId}'></ul>`)
      }
    });
});