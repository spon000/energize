define([
  "jquery",
  "CanvasController",
  "CanvasModel",
  "CanvasView",
  "evtEmitter",
  "Keys",
  "msgBox",
  "TopMenu",
  "webSocketCalls",
], function (
  $,
  CanvasController,
  CanvasModel,
  CanvasView,
  evtEmitter,
  Keys,
  msgBox,
  TopMenu,
  webSocketCalls,
  ) {
    return (
      class Game {
        constructor(gameId, playerNum) {
          this._gameRoomName = 'game' + globalGameId;
          this._canvasModel = null;
          this._canvasView = null;
          this._canvasController = null;
          this._topMenu = null;
          this._keys = null;
          this._elementIdCanvas = "gamecanvas"
          this._gameId = gameId;
          this._playerNumber = playerNum;

          this._initialize();
        }

        _initialize() {
          msgBox.initialize("game-user-messages");
          this._setEventEmitters();
          this._initCanvas();
          this._initializeWebSocket();
          this._topMenu = new TopMenu();
          this._keys = new Keys();
          this._getInitialStates();
        }

        _initializeWebSocket() {
          /////////////////////////////////////////////////////////////////////////////////
          // SocketIO connect to Server via websockets

          /* *************************************************************************** */
          // Connecting to server. Session ID is returned
          /* *************************************************************************** */
          webSocketCalls.initializeSocket(document.domain, location.port);

          /* *************************************************************************** */
          // Setup all the socket calls for which we'll be listening.
          /* *************************************************************************** */
          webSocketCalls.listenForMessage('connect', 'client_connected_to_server');
          webSocketCalls.listenForMessage('company_joined_game', 'company_joined_game');
          webSocketCalls.listenForMessage('new_facility', 'map_new_facility');
          webSocketCalls.listenForMessage('update_facility', 'map_update_facility');
          webSocketCalls.listenForMessage('delete_facility', 'map_delete_facility');
          webSocketCalls.listenForMessage('player_state_update', ['set_build_status', 'set_turn_status']);
          webSocketCalls.listenForMessage('game_state_update', 'set_turn_status');
          webSocketCalls.listenForMessage('players_message', 'message_player');
        }

        /* *************************************************************************** */
        // 
        /* *************************************************************************** */
        _initCanvas() {
          this._canvasModel = new CanvasModel();
          this._canvasView = new CanvasView(this._elementIdCanvas, this._canvasModel);
          this._canvasController = new CanvasController(this._canvasModel, this._canvasView, this._playerSocket);
          this._canvasController.initialize();
        }

        /* *************************************************************************** */
        // 
        /* *************************************************************************** */
        _getInitialStates() {
          webSocketCalls.sendMessageEmit("get_game_state", { gameId: globalGameId });
          webSocketCalls.sendMessageEmit("get_player_state", { gameId: globalGameId });
        }

        /* *************************************************************************** */
        // 
        /* *************************************************************************** */
        _setEventEmitters() {
          // Websocket events
          evtEmitter.on('client_connected_to_server', () => {
            webSocketCalls.sendMessageEmit('join_gameroom', { gameId: globalGameId });
          });

          evtEmitter.on('company_joined_game', (data) => {
            let msg = `Company, ${data.socketio_data.company.name}, has joined the electrical revolution!`
            msgBox.postMessage({ 'msg': msg, });
          });

          evtEmitter.on('message_player', (data) => {
            let msg = data.socketio_data.msg
            msgBox.postMessage({ 'msg': msg });
          })
        }
      });
  });
