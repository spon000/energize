define([
  "jquery",
  "CanvasController",
  "CanvasModel",
  "CanvasView",
  "EventEmitter",
  "TopMenu"
], function ($, CanvasController, CanvasModel, CanvasView, EventEmitter, TopMenu) {
  return (
    class Game extends EventEmitter {
      constructor() {
        super();
        this._canvasModel = new CanvasModel();
        this._canvasView = new CanvasView("gamecanvas", this._canvasModel);
        this._canvasController = new CanvasController(this._canvasModel, this._canvasView);
        this._canvasController.initialize();
        this._topMenu = new TopMenu();

        this._setWindowEvents();
        this._setEventEmitters();
      }

      _setWindowEvents() {
        this._addEventToWindow(null, "keydown", this._onKeyDownEvent, this);
      }

      _addEventToWindow(data, event, listener, scope) {
        $('body').on(event, { data: data, scope: scope }, listener);
      }

      _onKeyDownEvent(evt) {
        let scope = evt.data.scope;
        // console.log("evt.type = ", evt.type);
        switch (evt.type) {
          case "keydown":
            // console.log("keydown...");
            const emitter = scope._getKeyEmitter(evt)
            // console.log("emitter = ", emitter);
            scope.emit(emitter.text, emitter.data);
            break;
        }
      }

      _setEventEmitters() {
        this.on('buildKeyPressed', () => {
          this._topMenu.clickBuildButton();
        });

        this.on('zoomIn', () => {
          this._canvasView.zoomLevel += 1;
        });
        this.on('zoomOut', () => {
          this._canvasView.zoomLevel -= 1;
        });

        this.on('moveMapDown', () => {
          this._canvasView._moveMap(0, -100);
        });
        this.on('moveMapUp', () => {
          this._canvasView._moveMap(0, 100);
        });
        this.on('moveMapLeft', () => {
          this._canvasView._moveMap(100, 0);
        });
        this.on('moveMapRight', () => {
          this._canvasView._moveMap(-100, 0);
        });
      }


      _getKeyEmitter(evt) {
        switch (evt.originalEvent.code) {
          // - or _ key
          case "Minus":
            return ({
              text: "zoomOut",
              data: null
            });

          // + or = key
          case "Equal":
            return ({
              text: "zoomIn",
              data: null
            });

          // B key
          case "KeyB":
            console.log("B key pressed!");
            return ({
              text: "buildKeyPressed",
              data: null
            });

          // down arrow or S key
          case "ArrowDown":
          case "KeyS":
            return ({
              text: "moveMapDown",
              data: null
            });

          // right arrow or D key
          case "ArrowRight":
          case "KeyD":
            return ({
              text: "moveMapRight",
              data: null
            });

          // up arrow  or W key
          case "ArrowUp":
          case "KeyW":
            return ({
              text: "moveMapUp",
              data: null
            });

          // left arrow or A key
          case "ArrowLeft":
          case "KeyA":
            return ({
              text: "moveMapLeft",
              data: null
            });
        }
      }

    });
});
