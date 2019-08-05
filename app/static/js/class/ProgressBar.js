define([
  "jquery",
  "jqueryui"
], function ($, jqui) {


  const barHtml = `
    <div id="bar-progress">
      <label id="bar-label">Working...</label>
      <div id="bar"></div>
    </div>
  `

  const barCss = `
    <style>
      .ui-dialog-titlebar {
        display: none;
      }

      .no-close .ui-dialog-titlebar-close {
        display: none;
      }    

      /*
      #bar-progress {
        width: 100%;
        background-color: #ddd;
      }

      #bar {
        width: 1%;
        height: 30px;
        background-color: #1a53ff;
        text-align: center;
        line-height: 30px;
        color: white;        
      }
      */

      #bar-label {
        width: 100%;
        margin: 0;
        background-color: #fff;
        text-align: center;
      }
    </style>
  `

  return (
    class ProgressBar {
      constructor(elementId = null) {
        this._dialog = null;
        this._elementId = elementId || "progress-bar-dialog";
        this._dialogWidth = 300;
        this._dialogHeight = 100;

        this._pb = null;

      }

      get barWidth() {
        return this._barWidth;
      }

      set barWidth(barWidth) {
        this._barWidth = barWidth;
        this._barUpdate()
      }

      barStart() {
        this._createBarDialog();
        let elem = $(this._dialog).find("#bar")[0];
        this._pb = $(elem).progressbar({
          value: 0
        });
      }

      _barUpdate() {
        // console.log("barUpdate()");
        $(this._pb).progressBar("value", this._barWidth)
        // let elem = $(this._dialog).find("#bar")[0];
        // elem.style.width = this.barWidth + '%';
        // elem.innerHTML = this.barWidth * 1 + '%';
      }

      changeStatus(newText) {

      }

      barEnd() {

      }

      _createBarDialog() {
        $("#" + this._elementId).empty();
        $("#" + this._elementId).append(barHtml);
        $("#" + this._elementId).append(barCss);

        this._dialog = $("#" + this._elementId).dialog({
          dialogClass: "no-close",
          closeOnEscape: false,
          width: this._dialogWidth,
          height: this._dialogHeight,
        });
      }

    });



});