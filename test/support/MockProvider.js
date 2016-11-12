
export default class MockProvider {
    constructor() {
        this._data = {};
    }
    getItem(key) {
        return this._data[key];
    }
    setItem(key, value) {
        this._data[key] = value;
    }
    removeItem(key) {
        delete this._data[key];
    }
    get length() {
        return Object.keys(this._data).length;
    }
    key(index){
        return Object.keys(this._data)[index];
    }
}
