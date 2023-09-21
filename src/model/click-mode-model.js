import Observable from '../framework/observable.js';
import { Mode } from '../utils/utiles.js';

export default class ClickModel extends Observable {
  #currentState = Mode.DEFAULT;

  get clickState() {
    return this.#currentState;
  }

  setClickState(updateType, state) {
    if (state === Mode.CREATING) {
      this.#currentState = Mode.CREATING;
    } else {
      this.#currentState = Mode.DEFAULT;
    }
    this._notify('clickStateChanged', updateType, this.#currentState);
  }
}
