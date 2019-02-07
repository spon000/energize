define([
  // Libs
  "jquery"
], function ($) {
  return (
    class Player {
      constructor(playerParms) {
        this._name = playerParms.name || "Jon";
        this._companyName = playerParms.companyName || "ACME Electric";
        this._score = 0;

        // Status enumerations.
        this._STATUS = {
          STARTING: 0,
          VIEWING: 1,
          BUILDING: 2,
          NEXT: 3,

        };

        // Current status of player. 
        this._status = playerParmn || this._STATUS.STARTING;
        // 
      }

      get status() {
        return this._status;
      }

      get STATUS() {
        return this._STATUS;
      }

      set status(status) {
        this._status = status;
      }

    });
});
