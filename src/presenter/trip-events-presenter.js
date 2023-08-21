import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import NoPointView from '../view/no-point-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { generateFilter } from '../mocks/filters-generator.js';
import HeaderMainPresenter from './header-main-presenter.js';

export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;

  #tripSortComponent = new SortView();
  #tripEventsComponent = new ListView();

  #tripEventsPoints = [];

  constructor ({tripEventsContainer, pointsModel, tripInfoContainer, tripFilterContainer}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;

    const filters = generateFilter(this.#pointsModel.enrichedPoints);

    this.headerMainPresenter = new HeaderMainPresenter({
      tripInfoContainer: tripInfoContainer,
      tripFilterContainer: tripFilterContainer,
      filters: filters
    });
  }

  init() {
    this.#tripEventsPoints = this.#pointsModel.enrichedPoints;

    this.headerMainPresenter.init();
    this.#renderTripEvents();
  }

  #renderTripEvents() {
    if (!this.#tripEventsPoints.length) {
      render(new NoPointView(), this.#tripEventsContainer, RenderPosition.BEFOREBEGIN);
      return;
    }

    render(this.#tripSortComponent, this.#tripEventsContainer);

    render(this.#tripEventsComponent, this.#tripEventsContainer);

    this.#renderPoints(this.#tripEventsPoints);
  }

  #renderPoints() {
    const tripPoints = this.#pointsModel.enrichedPoints;
    tripPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }


  #renderPoint(point) {
    const pointPresenter = new PointPresenter({tripEventsContainer: this.#tripEventsComponent.element});
    pointPresenter.init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
  }
}
