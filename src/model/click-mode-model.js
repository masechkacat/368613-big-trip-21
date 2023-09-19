import Observable from '../framework/observable.js';

export default class ClickModel extends Observable {
  #currentState = null;

  get clickState() {
    return this.#currentState;
  }

  setclickState(updateType, state) {
    this.#currentState = state;
    this._notify('clickStateChanged', updateType, state);
  }

}
