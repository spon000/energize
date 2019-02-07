define([
  // Libs
  "jquery",
  "jqueryui",
  "Vector2",
  "easeljs"
], function ($, JQUI, Vector2, easeljs) {
  return (
    // Class that represents a dalog box with information.
    class DialogBoxInfo {
      constructor(title, height, width, elementId = "dialog-box") {
        this._elementId = elementId;
        this._title = title;
        this._height = height;
        this._width = width;
        this._tabContainer = null;
        this._numberOfTabs = 0;
        this._tabContent = {};
        this._closeButton = false;
        this._closeCSS = "no-close-button";
        this._isBoxOpen = false;
        this._isModel = true;
        this._events = [];
        // this._confirmButtonsClass = "confirm-buttons";
        // this._confirmButtonsHtml = "";
        // this._confirmButtonsResponse = null;
        // this._confirmButtonsData = null;
        this._position = {};
      }

      get elementId() {
        return this._elementId;
      }

      get title() {
        return this._title;
      }

      get fields() {
        return this._fields;
      }

      get closeButton() {
        return this._closeButton;
      }

      get position() { }

      get isBoxOpen() {
        return this._boxOpen;
      }

      set elementId(elementId) {
        this._elementId = elementId;
      }
      set title(title) {
        this._title = title;
      }

      set fields(fields) {
        this._fields = fields;
      }

      set closeButton(cb) {
        this._closeButton = cb;
        if (cb) this._closeCSS = "";
        else this._closeCSS = "no-close-button";
      }

      set position(position) {
        for (let pos in position) this._position[pos] = position[pos];
      }

      _selectTab(evt) {
        console.log("evt.target = ", evt.target);
        if ($(evt.target).hasClass("active"))
          return;
        else {
          $(evt.data.tabContainer).find("[tabid]").removeClass("active");
          $(evt.target).addClass("active");

          let tabId = $(evt.target).attr("tabid");
          $("#" + evt.data.id).find("[id^='infobox-tab-content-']").addClass("not-visible");
          $("#" + evt.data.id).find("[id^='infobox-tab-content-" + tabId + "']").removeClass("not-visible");
          //console.log("elements = ", elements);
          //$(evt.data.tabContent).find("[tabid='" + tabId + "']").removeClass("not-visible");
        }
      }


      addEvent(selector, eventType, handler, data) {
        this._events.push({
          selector: selector,
          type: eventType,
          handler: handler,
          data: data
        });
      }

      createTab(tabId, title = "", visible = false) {
        if (!this._tabContainer) {
          this._tabContainer = $("<div/>", {
            class: "infobox-tab-btns"
          });
        }

        if (++this._numberOfTabs > 1)
          $(this._tabContainer).removeClass("not-visible");
        else
          $(this._tabContainer).addClass("not-visible");

        $(this._tabContainer).append(
          "<button class='infobox-tablink' tabid='" +
          tabId +
          "'>" +
          title +
          "</button>"
        );

        $(this._tabContainer).find("[tabid='" + tabId + "']").on("click", null, {
          tabContainer: this._tabContainer,
          id: this._elementId
        }, this._selectTab);

        this._tabContent["" + tabId] = {
          html: null
        };
      }

      setContent(html, tabId, title = "", visible = false) {
        if (!this._tabContainer || !this._tabContent["" + tabId]) {
          this.createTab(tabId, title);
        }

        this._tabContent["" + tabId].html = $("<div/>", {
          id: "infobox-tab-content-" + tabId,
          class: "infobox-tab-content"
        });

        $(this._tabContent["" + tabId].html).append(html);

        if (!visible) {
          $(this._tabContent["" + tabId].html).addClass("not-visible");
        }
      }

      addContent(html, tabId, elementId = null) {
        let tabContent = $("#infobox-tab-content-" + tabId);
        // console.log("tabContent = ", tabContent);
        if (elementId)
          $(tabContent).find("#" + elementId).append(html);
        else
          $(tabContent).append(html);
      }

      removeContent(tabId, elementId) {
        let tabContent = $("#infobox-tab-content-" + tabId);
        if (elementId)
          $(tabContent).find("#" + elementId).remove();
        else
          $(tabContent).remove();
      }

      setCloseBoxEvent(response, data) {
        $("#" + this._elementId).on("dialogclose", (evt, ui) => {
          response(data);
        });
      }

      closeBox() {
        //console.log("DialogInfoBox - closeBox()...");
        $("#" + this._elementId).empty();
        for (let event of this._events) {
          $("#" + event.id).unbind(event.type);
        }
        // console.log("$('#' + this._elementId).dialog = ", $("#" + this._elementId).dialog("isOpen"));
        if ($("#" + this._elementId).dialog != null)
          $("#" + this._elementId).dialog("destroy");
      }

      setOpenBoxEvent(response, data) {
        $("#" + this._elementId).on("dialogopen", (evt, ui) => {
          response(data);
        });
      }

      openBox(position = {}) {
        //console.log("DialogInfoBox - openBox()... width : height" + this._width + " : " + this._height);
        $("#" + this._elementId).empty();
        $("#" + this._elementId).append(this._tabContainer);
        for (let content in this._tabContent) {
          // console.log("content = ", content);
          $("#" + this._elementId).append(this._tabContent["" + content].html);
        }
        for (let event of this._events) {
          // console.log("#event.id = ", $("#" + event.id));
          //$("#" + event.id).on(event.type, null, event.data, event.handler);
          $(event.selector).on(event.type, null, event.data, event.handler);
        }

        $("#" + this._elementId).dialog({
          dialogClass: this._closeCSS,
          title: this._title,
          width: this._width,
          height: this._height,
          position: this._position,
          modal: this._isModel
        });
      }
    }
  );
});