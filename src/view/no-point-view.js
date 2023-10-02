import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsTextType } from '../utils/const.js';

function createNoPointTemplate(filterType, isError) {
  if (isError) {
    return ('<p class="trip-events__msg">Failed to load latest route information</p>');
  } else {
    return (
      `<p class="trip-events__msg">${NoPointsTextType[filterType]}</p>`
    );
  }
}
export default class NoPointView extends AbstractView {
  #filterType = null;
  #isError = false;

  constructor({filterType,isError}) {
    super();
    this.#filterType = filterType;
    this.#isError = isError;
  }

  get template() {
    return createNoPointTemplate(this.#filterType, this.#isError);
  }
}
