import AbstractView from '../framework/view/abstract-view.js';

function createTripEventsTemplate() {
  return '<section class="trip-events"></section>';
}

export default class TripEventsView extends AbstractView {
  get template() {
    return createTripEventsTemplate();
  }
}
