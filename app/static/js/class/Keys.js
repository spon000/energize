define([
  "jquery",
  "evtEmitter",
], function (
  $,
  evtEmitter,
  ) {
    keyMapEmitters = {
      "Minus": "zoomOut",
      "Equal": "zoomIn",
      "KeyB": "build_facility_btn",
      "KeyT": "next_turn_btn",
      "KeyT+Shift": "force_run_turn",
      "KeyP": "portfolio_btn",
      "KeyQ": "quarterly_report_btn",
      "ArrowDown": "moveMapDown",
      "KeyS": "moveMapDown",
      "ArrowRight": "moveMapRight",
      "KeyD": "moveMapRight",
      "ArrowUp": "moveMapUp",
      "KeyW": "moveMapUp",
      "ArrowLeft": "moveMapLeft",
      "KeyA": "moveMapLeft",
    }

    return (
      class Keys {
        constructor(elementId = null) {
          this._elementId = elementId ? "#" + elementId : "body";
          this._handler = null;
          this._setKeyDownEvent();
        }

        _setKeyDownEvent() {
          this._handler = $(this._elementId).on("keydown", null, this._onKeyDownEvent);
        }

        _onKeyDownEvent(evt) {
          let keyCode = evt.originalEvent.code;
          if (evt.shiftKey)
            keyCode += "+Shift"
          if (evt.altKey)
            keyCode += "+Alt"
          if (evt.ctrlKey)
            keyCode += "+Ctrl"
          evtEmitter.emit(keyMapEmitters[keyCode])
        }
      });
  });