define	([
	// Libs
	"jquery",
  "jqueryui",
  "TopMenuDefs",
  "DialogBoxInfo"

], function($, JQUI, TopMenuDefs, DialogBoxInfo) {
	
	return(

  class TopMenu {

    constructor() {
      
      this._menu = {};

      for(let menuItem in TopMenuDefs) {
        this._menu[menuItem] = TopMenuDefs[menuItem];
        this._menu[menuItem].dialogBox = new DialogBoxInfo(TopMenuDefs[menuItem].title, 400, 500);
        this._menu[menuItem].dialogBox.closeButton = true;
        this._menu[menuItem].dialogBox.position = {"at": "center", "my": "center", "of": window};
        let item = this._menu[menuItem];
 
        $("#" + item.buttonElementId).click(item, (evt) => {
          evt.data.dialogBox.openBox();
        });

      }
    }
    
  });
});


