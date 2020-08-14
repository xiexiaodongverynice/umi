import _ from "lodash";

function FormEvent() {
  // this.handlers = [];
  this.handlerMap = {};
}

FormEvent.prototype = {
  subscribe(type, fn) {
    if (!_.has(this.handlerMap, type)) {
      _.set(this.handlerMap, type, []);
    }
    this.handlerMap[type].push(fn);
  },

  unsubscribe(type, fn) {
    _.set(
      this.handlerMap,
      type,
      (this.handlerMap[type] || []).filter(item => {
        if (item !== fn) {
          return item;
        }
        return false;
      })
    );
  },

  fire(o, thisObj) {
    const scope = thisObj || window;
    const { type } = o;
    if (type) {
      (this.handlerMap[type] || []).forEach(item => {
        item.call(scope, o);
      });
    } else {
      // consoleUtil.error('type is not given when firing an event');
    }
  },
  unsubscribeAll() {
    this.handlerMap = {};
  },
  unsubscribeByType(type) {
    _.set(this.handlerMap, type, []);
  }
};

export default new FormEvent();
