define([
  "jquery",
  "socketio",
  "CanvasController",
  "CanvasModel",
  "CanvasView",
  "EventEmitter",
  "evtEmitter",
  "TopMenu",
  "SocketIOCalls",
  "gameStore"
], function (
  $,
  socketio,
  CanvasController,
  CanvasModel,
  CanvasView,
  EventEmitter,
  evtEmitter,
  TopMenu,
  SocketIOCalls,
  gameStore
) {
    return (
      class Game extends EventEmitter {
        constructor(gameId, playerNum) {
          super();
          this._playerSocket = null;
          this._socketCalls = null;
          this._gameRoomName = 'game' + globalGameId;
          this._canvasModel = null;
          this._canvasView = null;
          this._canvasController = null;
          this._topMenu = new TopMenu();
          this._elementIdCanvas = "gamecanvas"
          this._gameId = gameId;
          this._playerNumber = playerNum;

          this._initialize();
          this._setWindowEvents();
          this._setEventEmitters();
          //console.log("Events in Emmitter = ", this._events);
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

          this.on('portfolioButton', () => {
            this._topMenu.clickPortfolioButton();
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
          this._initCanvas();
          this._initSocketCallsReceived();
        }

        _initSocketCallsReceived() {
          /////////////////////////////////////////////////////////////////////////////////
          // SocketIO connect to Server via websockets

          /* *************************************************************************** */
          // Connecting to server. Session ID is returned
          /* *************************************************************************** */
          this._playerSocket = socketio.connect('http://' + document.domain + ':' + location.port)
          console.log("playerSocket = ", this._playerSocket);

          /////////////////////////////////////////////////////////////////////////////////
          // SocketIO messages: Connection and Disconnection

          /* *************************************************************************** */
          //
          /* *************************************************************************** */
          this._playerSocket.on('connect', () => {
            this._socketCalls = new SocketIOCalls(this._playerSocket);
            this._socketCalls.clientConnect(globalGameId);
            console.log("client connected successfully... _socketCalls = ", this._socketCalls);
          });

          /* *************************************************************************** */
          //
          /* *************************************************************************** */
          this._playerSocket.on('disconnect', () => {
            this._socketCalls.clientDisconnect(globalGameId);
            console.log("client disconnect successfully... _socketCalls = ", this._socketCalls);
          });


          /////////////////////////////////////////////////////////////////////////////////
          // SocketIO messages: Game Turn 

          /* *************************************************************************** */
          // Game turn has finished and a new turn is ready for players.
          // We need to have all clients for that game reload the page
          /* *************************************************************************** */
          this._playerSocket.on('game_turn_complete', (data) => {
            location.reload();
          })

          /* *************************************************************************** */
          //
          /* *************************************************************************** */
          this._playerSocket.on('game_turn_interval', (data) => {
            console.log("game_turn_interval. Data = ", data);
          })


          /////////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////////
          // SocketIO messages: Map Updates

          /* *************************************************************************** */
          // New facility has been added. Update player map.
          /* *************************************************************************** */
          this._playerSocket.on('new_facility', (data) => {
            console.log("websocket: new_facility", data);
            evtEmitter.emit("updateMapAddFacility", { facility: data.facility });
          })

          /* *************************************************************************** */
          // A newly created facility has been deleted. Update player map.
          /* *************************************************************************** */
          this._playerSocket.on('delete_facility', (data) => {
            console.log("websocket: delete_facility", data);
            evtEmitter.emit("updateMapDeleteFacility", { facility: data.facility });
          })

          // /* *************************************************************************** */
          // // A newly created facility has been updated (type). Update player map.
          // /* *************************************************************************** */
          this._playerSocket.on('update_facility', (data) => {
            console.log("websocket: update_facility", data);
            evtEmitter.emit("updateMapUpdateFacility", { facility: data.facility });
          })

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
