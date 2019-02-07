define(["jquery", "Keys", "easeljs", "CityLayer", "OverlayLayer"], function (
  $,
  Keys,
  Easeljs,
  CityLayer,
  OverlayLayer
) {
  let mouseX = 0;
  let oldMouseX = 0;
  let mouseY = 0;
  let oldMouseY = 0;
  let mouseDownTimer = null;
  let dragging = false;
  let leftMouseDown = false;
  let clicked = 0;
  let singleClickTimer = null;
  let buildFacility = false;
  let prevMousePointer = "auto";
  let selection = false;
  let selectCity = true;
  let selectFacility = false;
  let _canvasMapStage = null;
  let _facilityController = null;

  return {
    // passed in: cms -> canvasMapStage, fc -> facilityController, pc -> playerCompany
    init: (cms, fc, pc) => {

      switch (pc.state) {
        case "build":
          $("#facility-btn").addClass(["building", "no-hover"]);
          break;
        default:
          break;
      }

      buildFacilityBtn(pc, fc);
      console.log("Interface.init()...");

      _setParms(cms, fc);
      let canvasMapStage = _getCanvasMapStage();

      $(canvasMapStage.stage.canvas).mousedown(evt => {
        leftMouseDown = true;
        mouseDownTimer = setTimeout(() => {
          if (leftMouseDown) {
            dragging = true;
            $(canvasMapStage.stage.canvas).css("cursor", "move");
            //console.log("dragging started...");
          }
        }, 350);
        //console.log("mouse down check for dragging...");
      });

      $(canvasMapStage.stage.canvas).mouseup(evt => {
        leftMouseDown = false;
        if (dragging) {
          clicked = -1;
          dragging = false;
          $(canvasMapStage.stage.canvas).css("cursor", "auto");
          //console.log("dragging ended...");
        }
      });

      $(canvasMapStage.stage.canvas).mousemove(evt => {
        if (dragging) {
          //console.log("evt = ", evt);
          _drag(evt);
        }

        let tiles = null;
        if (selection) {
          _checkForSselection(evt.offsetX, evt.offsetY);
        }
      });

      $(canvasMapStage.stage.canvas).mouseleave(evt => {
        leftMouseDown = false;
        dragging = false;
        $(canvasMapStage.stage.canvas).css("cursor", "auto");
        mouseX = oldMouseX = 0;
        mouseY = oldMouseY = 0;
      });

      $(canvasMapStage.stage.canvas).click(evt => {
        clicked++;
        //console.log("clicked");
        let offsetX = evt.offsetX;
        let offsetY = evt.offsetY;
        if (clicked == 1) {
          singleClickTimer = setTimeout(evt => {
            clicked = 0;
            // _singleClick(clickEvent);
            _singleClick(evt, offsetX, offsetY);
          }, 400);
        } else if (clicked == 2) {
          clearTimeout(singleClickTimer);
          leftMouseDown = false;
          clicked = 0;
          _doubleClick(evt, canvasMapStage);
        }
      });

      // $("#facilities-build-btn").click(evt => {
      //   let fc = _getFacilityController();
      //   if (!$("#facilities-build-btn").hasClass("toggle-on")) {
      //     $("#facilities-build-btn").addClass("toggle-on no-hover");
      //     fc.status = fc.STATUS.BUILDING;
      //   } else {
      //     $("#facilities-build-btn").removeClass("toggle-on no-hover");
      //     fc.status = fc.STATUS.NONE;
      //   }
      // });

      window.addEventListener("keydown", function (evt) {
        _keyDown(evt, canvasMapStage);
      });

      window.addEventListener("keyup", function (e) {
        //console.log("keyup = " + e.keyCode);
      });
    }
  };

  //////////////////////////////////////////////////////
  // Global functions
  //
  //

  function _setParms(cms, fc) {
    _canvasMapStage = cms;
    _facilityController = fc;
  }

  function _getCanvasMapStage() {
    return _canvasMapStage;
  }

  function _getFacilityController() {
    return _facilityController;
  }

  function _checkForSselection(evt) {
    canvasMapStage.checkTileMaps(evt.offsetX, evt.offsetY);
    let canvasMapStage = _getCanvasMapStage();
    // if (selectCity) {
    // _moveIndicator(evt, ["water"]);

    // else if (selectFacility) {
    // _moveIndicator(evt, ["river", "water", "city"]);
    // }
    if (createCity) {
    } else if (createFacility) {
    }
  }

  function _singleClick(evt, x, y) {
    //console.log("singleClick = ", evt);
    console.log("x : y = ", x + " : " + y);

    let canvasMapStage = _getCanvasMapStage();
    let fc = _getFacilityController();
    if (fc.status == fc.STATUS.BUILD) {
      if (canvasMapStage.zoomLevel > 0) {
        fc.createFacility(x, y);
        //fc.showMessage(false);
      } else {
        fc.showMessageDialog(
          "Warning: ",
          "Must be zoomed in at least one level."
        );
      }
    }
  }

  function _doubleClick(evt) {
    //console.log("doubleClick");
    //console.log("interface - x : y = ", evt.offsetX + " : " + evt.offsetY);

    let canvasMapStage = _getCanvasMapStage();
    oldMouseX = evt.offsetX;
    oldMouseY = evt.offsetY;
    if (!evt.shiftKey) canvasMapStage.zoom(evt.offsetX, evt.offsetY, true);
    else canvasMapStage.zoom(evt.offsetX, evt.offsetY, false);
  }

  function _moveIndicator(evt, badTilesArray) {
    let canvasMapStage = _getCanvasMapStage();
    //OverlayLayer.showIndicator();
    // if (canvasMapStage.zoomLevel > 0) {
    //   OverlayLayer.showIndicator("badSpot", true);
    //   OverlayLayer.moveIndicator(
    //     evt.offsetX,
    //     evt.offsetY,
    //     canvasMapStage,
    //     false
    //   );
    // }
  }

  function _drag(evt) {
    let canvasMapStage = _getCanvasMapStage();
    mouseX = evt.originalEvent.movementX;
    mouseY = evt.originalEvent.movementY;
    canvasMapStage.moveTileMaps(mouseX, mouseY);
  }

  function _keyDown(evt) {
    //console.log("evt.code = " + evt.code);
    let canvasMapStage = _getCanvasMapStage();
    if (oldMouseX) mouseX = oldMouseX;
    if (oldMouseY) mouseY = oldMouseY;
    switch (evt.code) {
      // - or _ key
      case "Minus":
        canvasMapStage.zoom(mouseX, mouseY, false);
        break;
      // + or = key
      case "Equal":
        canvasMapStage.zoom(mouseX, mouseY);
        break;
      // B key
      case "KeyB":
        $('#facility-btn').click();
        // let fc = _getFacilityController();
        // if (fc.status == fc.STATUS.BUILDING) {
        //   fc.status = fc.STATUS.NONE;
        //   fc.showMessage("user-message");
        // } else {
        //   fc.status = fc.STATUS.BUILDING;
        //   fc.showMessage("user-message", "Place facilities building on map.");
        // }
        break;
      // down arrow key
      case "ArrowDown":
        mouseY += -mouseY - 100;
        canvasMapStage.moveTileMaps(0, mouseY);
        break;
      // right arrow key
      case "ArrowRight":
        mouseX += -mouseX - 100;
        canvasMapStage.moveTileMaps(mouseX, 0);
        break;
      // up arrow key
      case "ArrowUp":
        mouseY -= mouseY - 100;
        canvasMapStage.moveTileMaps(0, mouseY);
        break;
      // left arrow key
      case "ArrowLeft":
        mouseX -= mouseX - 100;
        canvasMapStage.moveTileMaps(mouseX, 0);
        break;
    }
  }

  function buildFacilityBtn(playerCompany, facilityController) {
    $('#facility-btn').click((evt) => {
      if ($(evt.target).hasClass("building")) {
        $(evt.target).removeClass(["building", "no-hover"]);
        playerCompany.state = "view";
        facilityController.status = facilityController.STATUS.VIEW;
      }
      else {
        $(evt.target).addClass(["building", "no-hover"]);
        playerCompany.state = "build";
        facilityController.status = facilityController.STATUS.BUILD;
      }
      $.post("/company?pcstate=" + playerCompany.state, () => { console.log("successful POST") });
    });
  }
});
