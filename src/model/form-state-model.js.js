import Observable from '../framework/observable.js';
import { Mode } from '../utils/const.js';

export default class FormStateModel extends Observable {
  #currentState = Mode.DEFAULT;

  get formState() {
    return this.#currentState;
  }

  set formState(state) {
    if (state === Mode.CREATING) {
      this.#currentState = Mode.CREATING;
    } else {
      this.#currentState = Mode.DEFAULT;
    }
    this._notify(this.#currentState);
  }
}
