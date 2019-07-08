define([
  "jquery",
  "Component",
  "gameStore"
], function ($, Component, gameStore) {
  return (
    class TopMenuBuild extends Component {
      constructor() {
        super({
          gameStore,
          element: document.getElementById("build-facility-btn")
        });
      }

      render() {
        let self = this;

        self.element.innerHTML = `<a class="build-btn" href="#">Build Facility</a>`

        switch (gameStore.state.companyState) {
          case "view":
            $(self.element).removeClass(["building", "no-hover"])
            break;

          case "build":
            $(self.element).removeClass(["building", "no-hover"]);
            break;

          case "turn":
            $(self.element).addClass(["no-hover"]);
            $(self.element).removeClass(["building"]);
            break;

          default:
            break;
        }

        self.element.innerHTML = `<a class="build-btn push-up" href="#">Build Facility</a>`

        self.element.querySelector('.build-btn').addEventListener('click', () => {
          gameStore.dispatch('setCompanyState', {})
        });
      }

    });
});