define([
  "jquery",
  "CanvasController",
  "CanvasModel",
  "CanvasView",
  "EventEmitter",
  "TopMenu",
  "socketio"
], function ($, CanvasController, CanvasModel, CanvasView, EventEmitter, TopMenu, socketio) {
  return (
    class NewGame extends EventEmitter {
      constructor() {
        super();
        this._playerSocket = null;
        this._gameSocket = null;
        this._gameNamespace = '/game' + globalGameId;
        this._canvasModel = null;
        this._canvasView = null;
        this._canvasController = null;
        this._topMenu = new TopMenu();
        this._elementIdCanvas = "gamecanvas"

        this._initialize();
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
            if (emitter) {
              scope.emit(emitter.text, emitter.data);
            }
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

      _initialize() {
        this._playerSocket = socketio.connect('http://' + document.domain + ':' + location.port);
        // this._gameSocket = this._playerSocket.of(this._gameNamespace);

        console.log("playerSocket = ", this._playerSocket);
        this._initCanvas();
        this._initSocketCallsReceived()
      }

      _initSocketCallsReceived() {

        this._gameSocket.on('new_facility', (data) => {
          console.log("on('new_facility') data = ", data);
        });
      }

      _initCanvas() {
        this._canvasModel = new CanvasModel();
        this._canvasView = new CanvasView(this._elementIdCanvas, this._canvasModel);
        this._canvasController = new CanvasController(this._canvasModel, this._canvasView, this._playerSocket);
        this._canvasController.initialize();
      }

      // this._playerSocket 

      // this._playerSocket.on('connect', () => {
      //   this._playerSocket.send('player_connect')
      //   console.log("Player connected.");
      // });

      // this._playerSocket.on('game_connect', (data) => {
      //   console.log("game_connect: data = ", data)
      //   // this._playerNumber = data.p_num;
      //   // this._gameNumber = data.g_num;
      // });

      // this._playerSocket.on('test_disconnect', () => {
      //   console.log("Player is not disconnected.");
      // });

    });
});
