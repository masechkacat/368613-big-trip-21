import AbstractView from '../framework/view/abstract-view.js';

function createNoPointTemplate() {
  return (
    `<p class="trip-events__msg">
      Click New Event to create your first point

      <!--
      Значение отображаемого текста зависит от выбранного фильтра:
        * Everthing – 'Click New Event to create your first point'
        * Past — 'There are no past events now';
        * Present — 'There are no present events now';
        * Future — 'There are no future events now'.
    -->

    </p>`
  );
}

export default class NoPointView extends AbstractView {
  get template() {
    return createNoPointTemplate();
  }
}
