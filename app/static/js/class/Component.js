// Created from https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/
define([
  "Store"
], function (Store) {
  return (
    class Component {
      constructor(props = {}) {
        let self = this;

        this.render = this.render || function () { };

        if (props.store instanceof Store) {
          props.store.events.subscribe('stateChange', () => self.render());
        }

        if (props.hasOwnProperty('element')) {
          this.element = props.element;
        }
      }
    });
});