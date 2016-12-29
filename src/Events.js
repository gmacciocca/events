const noop = () => {};

export default class Events {
    constructor() {
        this._on = {};
    }

    static create(...args) {
        return new Events(...args);
    }

    on(eventName, callback) {
        this._init(eventName);
        this._on[eventName].push({ callback, type: "on" });
        return () => {
            this.off(eventName, callback);
        };
    }

    once(eventName, callback) {
        this._init(eventName);
        this._on[eventName].push({ callback, type: "once" });
        return () => {
            this.off(eventName, callback);
        };
    }

    off(eventName, callbackOff) {
        this._init(eventName);
        const index = this._on[eventName].findIndex(({ callback }) => callback === callbackOff);
        if (index >= 0) {
            this._on[eventName].splice(index, 1);
        }
    }

    fire(eventName, ...args) {
        this._init(eventName);
        const retArray = [];
        this._on[eventName].every(({ callback, type }) => {
            "once" === type ? this.off(eventName, callback) : noop;
            const ret = callback(...args);
            retArray.push(ret);
            return (!ret || (ret instanceof Promise) || (!ret.stopEventPropagation));
        });
        return retArray;
    }

    fireWait(eventName, ...args) {
        return Promise.all(this.fire(eventName, ...args).filter(p => p instanceof Promise));
    }

    _init(eventName) {
        this._on[eventName] = this._on[eventName] || [];
    }
}
