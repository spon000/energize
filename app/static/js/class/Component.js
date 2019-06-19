define([
  "Store"
], function (Store) {
  return (
    class Component {
      constructor(props = {}) {
        let self = this;

        this.render = this.render || function () { };
        this.element = props.element || null;

        if (props.store instanceof Store) {
          props.store.events.subscribe('stateChange', () => self.render());
        }
      }
    });
});