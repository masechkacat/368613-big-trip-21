import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../utils/utiles.js';

const enabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFER]: false
};

function createSortItemTemplate(sortItem){
  return `
    <div class="trip-sort__item  trip-sort__item--${sortItem.type}">
      <input
        id="sort-${sortItem.type}"
        class="trip-sort__input visually-hidden"
        data-sort-type="${sortItem.type}"
        type="radio"
        name="trip-sort"
        value="sort-${sortItem.type}"
        ${(sortItem.isChecked) ? 'checked' : ''}
        ${(sortItem.isDisabled) ? 'disabled' : ''}
      >
      <label class="trip-sort__btn" for="sort-${sortItem.type}">${sortItem.type}</label>
    </div>
  `;
}

function createSortTemplate({sortMap}){
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
${sortMap.map((sortItem) => createSortItemTemplate(sortItem)).join('')}
</form>`
  );
}

export default class SortView extends AbstractView {
  #sortMap = null;
  #handleSortTypeChange = null;

  constructor({currentSortType, onSortTypeChange}){
    super();

    this.#sortMap = Object.values(SortType)
      .map((type) => ({
        type,
        isChecked: (type === currentSortType),
        isDisabled: !enabledSortType[type]
      }));

    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHanlder);
  }

  get template(){
    return createSortTemplate({
      sortMap: this.#sortMap
    });
  }

  #sortTypeChangeHanlder = (evt) => {
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
