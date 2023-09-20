import Observable from '../framework/observable.js';
export default class ClickModel extends Observable {
  #currentState = {
    isCreating: false
  };

  get clickState() {
    return this.#currentState;
  }

  setClickState(updateType, state) {
    this.#currentState = {
      ...this.#currentState,
      isCreating: state === 'creating'
    };
    this._notify('clickStateChanged', updateType, this.#currentState);
  }
}
