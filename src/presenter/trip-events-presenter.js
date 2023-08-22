import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import NoPointView from '../view/no-point-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { generateFilter } from '../mocks/filters-generator.js';
import HeaderMainPresenter from './header-main-presenter.js';
import { updateItem } from '../utils/utiles.js';

export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;

  #tripSortComponent = new SortView();
  #tripListComponent = new ListView();

  #tripEventsPoints = [];
  #pointPresenters = new Map();

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

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripEventsPoints = updateItem(this.#tripEventsPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderTripEvents() {
    if (!this.#tripEventsPoints.length) {
      render(new NoPointView(), this.#tripEventsContainer, RenderPosition.BEFOREBEGIN);
      return;
    }

    render(this.#tripSortComponent, this.#tripEventsContainer);

    render(this.#tripListComponent, this.#tripEventsContainer);

    this.#renderPoints(this.#tripEventsPoints);
  }

  #renderPoints() {
    const tripPoints = this.#pointsModel.enrichedPoints;
    tripPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }


  #renderPoint(point) {
    const pointPresenter = new PointPresenter({pointListContainer: this.#tripListComponent.element,
      allOffers: this.#pointsModel.offers, allDestinations: this.#pointsModel.destinations,
      onDataChange: this.#handlePointChange, onModeChange: this.#handleModeChange});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

}
