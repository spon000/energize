define([
  "jquery",
  "evtEmitter",
  "ModelData",
  "msgBox",
  "webSocketCalls"
], function (
  $,
  evtEmitter,
  ModelData,
  msgBox,
  webSocketCalls
) {
    return (
      class Turn {
        constructor() {
          this._elementIdReadyTurnDialog = "ready-for-turn-dialog";
          this._elementIdRunningTurnDialog = "running-turn-dialog";
          this._readyDialog = null;
          this._runningDialog = null;
          this._timerInterval = null;
          this._readyTurnDialogHtml = null;
          this._runningTurnDialogHtml = null;
          this._numIntervals = 2;
          this._modelData = new ModelData();

          this._listenForEvents();
        }


        /* *********************************************************************************** */
        _listenForEvents() {


          evtEmitter.on('force_run_turn', (data) => {

          });

          evtEmitter.on('set_turn_status', (data) => {
            this._checkTurnStatus(this, data);
          });

          evtEmitter.on('ready_to_run_turn', (data) => {
            this._openReadyForTurnDialog(this, this._countDownTimer(this._numIntervals));
          });

          evtEmitter.on('running_game_turn', (data) => {
            this._openRunningTurnDialog(this);
          });

          evtEmitter.on('cancel_ready_turn_dialog', (data) => {
            if (this._readyDialog)
              $(this._readyDialog).dialog("close");
          });

          evtEmitter.on('game_turn_interval', (data) => {
            this._updateRunningTurnDialog(this, data);
          })
        }

        /* *********************************************************************************** */
        _checkTurnStatus(scope, data) {
          let state = data.socketio_data.state
          console.log("_checkTurnStatus()... ", data);
          if (state == "runturn" && !this._runningDialog) {
            this._openRunningTurnDialog(this);

          }
        }

        /* *********************************************************************************** */
        _openReadyForTurnDialog(scope, openFunction = null, closeFunction = null) {
          webSocketCalls.sendMessageReturn('get_ready_turn_dialog', { gameId: globalGameId }, (data) => {
            this._readyTurnDialogHtml = data;

            $("#" + this._elementIdReadyTurnDialog).empty()
            $("#" + this._elementIdReadyTurnDialog).append(this._readyTurnDialogHtml);

            this._readyDialog = $("#" + this._elementIdReadyTurnDialog).dialog({
              title: "Ready To Run Turn",
              dialogClass: "no-close",
              scope: scope,
              width: 350,
              height: 220,
              position: {},
              modal: true,
              closeOnEscape: false,
              resizable: false,
              open: (evt, ui) => {
                if (openFunction)
                  openFunction(scope);
              },
              close: (evt, ui) => {
                if (closeFunction)
                  closeFunction(scope);
              },
              buttons: [
                {
                  text: "Cancel",
                  click: function (evt, scope) {
                    $(this).dialog("close");
                    // console.log("evt =", scope)
                    clearInterval(this._timerInterval);
                    webSocketCalls.sendMessageEmit('cancel_run_turn', { gameId: globalGameId });
                  }
                }
              ]
            });
          });
        }

        /* *********************************************************************************** */
        _openRunningTurnDialog(scope, openFunction = null, closeFunction = null) {
          this._modelData.getTurnRunningDialogHtml().then((data) => {
            this._runningTurnDialogHtml = data;

            $("#" + this._elementIdRunningTurnDialog).empty()
            $("#" + this._elementIdRunningTurnDialog).append(this._runningTurnDialogHtml);

            this._runningDialog = $("#" + this._elementIdRunningTurnDialog).dialog({
              title: "Turn Is Running...",
              dialogClass: "no-close",
              scope: scope,
              width: 500,
              height: 350,
              position: {},
              modal: true,
              closeOnEscape: false,
              resizable: false,
              open: (evt, ui) => {
                if (openFunction)
                  openFunction(scope);
              },
              close: (evt, ui) => {
                if (closeFunction)
                  closeFunction(scope);
              },
            });
          });
        }

        /* *********************************************************************************** */
        _updateRunningTurnDialog(scope, data) {
          let status = data.socketio_data.status;
          let width = Math.floor(((status.interval / status.total) * 100))
          // console.log("_updateRunningTurnDialog() = ");


          $("#" + this._elementIdRunningTurnDialog).find(".progress-bar").css("width", width + "%")
        }

        /* *********************************************************************************** */
        _setProgressBar(interval, total) {
          let widthPercent = Math.floor((interval / total) * 100);
          let marginPercent = Math.floor((100 - widthPercent) / 2);
          let backgroundColor = "rgb(134, 224, 30)";

          if (widthPercent > 60)
            backgroundColor = "rgb(134, 224, 30)"
          else if (widthPercent > 30)
            backgroundColor = "rgb(228, 214, 23)";
          else
            backgroundColor = "rgb(224, 30, 30)";

          $(this._readyDialog).find(".countdown-bar").css({ "background-color": backgroundColor, "width": widthPercent + "%", "margin-left": marginPercent + "%" });
        }

        /* *********************************************************************************** */
        _countDownTimer(seconds) {
          let startDate = new Date().getTime();
          let endDate = startDate + (seconds * 1000);
          let totalTime = Math.floor((endDate - startDate) / 1000);
          let timeRemaining = totalTime;

          this._timerInterval = setInterval(() => {
            timeRemaining -= 1
            this._setProgressBar(timeRemaining, totalTime);

            if (timeRemaining < 0) {
              webSocketCalls.sendMessageEmit('player_is_ready', { gameId: globalGameId });
              clearInterval(this._timerInterval)
              $(this._readyDialog).dialog("close");
            }
          }, 1000);

        }

      });
  });