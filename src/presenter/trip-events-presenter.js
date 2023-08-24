import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import NoPointView from '../view/no-point-view.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { generateFilter } from '../mocks/filters-generator.js';
import HeaderMainPresenter from './header-main-presenter.js';
import { updateItem } from '../utils/utiles.js';
import TripEventsView from '../view/trip-events-view.js';
import { sort } from '../utils/sort.js';
import { SortType } from '../utils/utiles.js';

export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;

  #tripEventsComponent = new TripEventsView();
  #tripSortComponent = null;
  #tripListComponent = new ListView();
  #noPointComponent = new NoPointView();

  #tripEventsPoints = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor ({tripEventsContainer, pointsModel, tripInfoContainer, tripFilterContainer}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;

    const filters = generateFilter(this.#pointsModel.enrichedPoints);

    this.headerMainPresenter = new HeaderMainPresenter({
      tripInfoContainer: tripInfoContainer,
      tripFilterContainer: tripFilterContainer,
      filters: filters
    });
    this.#tripEventsPoints = sort[SortType.DAY]([...this.#pointsModel.enrichedPoints]);
  }

  init() {

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

  #handleSortTypeChange = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderSort(this.#tripEventsContainer);
    this.#renderPointsList();
  };

  #sortPoints(sortType){
    this.#currentSortType = sortType;
    this.#tripEventsPoints = sort[this.#currentSortType]([...this.#tripEventsPoints]);
  }


  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }


  #renderSort() {

    const prevSortComponent = this.#tripSortComponent;

    this.#tripSortComponent = new SortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if(prevSortComponent){
      replace(this.#tripSortComponent, prevSortComponent);
      remove(prevSortComponent);
    }else{
      render(this.#tripSortComponent, this.#tripEventsContainer);
    }
    render(this.#tripSortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#tripEventsComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({pointListContainer: this.#tripListComponent.element,
      allOffers: this.#pointsModel.offers, allDestinations: this.#pointsModel.destinations,
      onDataChange: this.#handlePointChange, onModeChange: this.#handleModeChange});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }


  #renderPoints() {
    const tripPoints = this.#pointsModel.enrichedPoints;
    tripPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPointsList() {
    render(this.#tripListComponent, this.#tripEventsContainer);

    this.#renderPoints();

  }

  #renderTripEvents() {
    render(this.#tripEventsComponent, this.#tripEventsContainer);

    if (!this.#tripEventsPoints.length) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointsList();

  }

}
