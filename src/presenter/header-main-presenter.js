import FilterView from '../view/filter-view';
import TripInfoView from '../view/trip-info-view';
import NewPointButtonView from '../view/new-point-button-view';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import {SortType, FilterType, UpdateType, filter, Mode} from '../utils/utiles.js';
import { sort } from '../utils/sort.js';


export default class HeaderMainPresenter {
  #tripInfoContainer = null;
  #tripFilterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #formStateModel = null;

  #newPointButtonComponent = null;
  #tripFilterComponent = null;
  #tripInfoComponent = null;

  #points = null;

  constructor ({tripInfoContainer, tripFilterContainer, filterModel, pointsModel, formStateModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripFilterContainer = tripFilterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#formStateModel = formStateModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#formStateModel.addObserver(this.#handleModelEvent);

  }

  get filters() {
    const points = this.#pointsModel.enrichedPoints;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }

  init() {
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderNewButton();
  }

  #renderNewButton() {
    if (!this.#newPointButtonComponent) {
      this.#newPointButtonComponent = new NewPointButtonView({
        onClick: this.#handleNewPointButtonClick
      });
    }

    const isCreating = this.#formStateModel.formState === Mode.CREATING;
    this.#newPointButtonComponent.disable(isCreating);

    render(this.#newPointButtonComponent, this.#tripInfoContainer, RenderPosition.BEFOREEND);
  }

  #handleNewPointButtonClick = () => {
    this.#formStateModel.formState = Mode.CREATING;
  };


  #renderTripInfo () {
    const prevTripInfoComponent = this.#tripInfoComponent;
    this.#points = sort[SortType.DAY](this.#pointsModel.enrichedPoints);

    this.#tripInfoComponent = new TripInfoView({
      totalSumm: this.getTotalSumm(),
      namesDestinations: this.getNamesDestinations(),
      datesTrip: this.getDatesTrip()
    });

    if(prevTripInfoComponent === null){
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);

  }


  getTotalSumm() {
    return this.#points.reduce((total, point) => {
      const basePrice = point.basePrice || 0;
      const offersPrice = point.checkedOffersForPoint.reduce((offerTotal, offer) => offerTotal + offer.price, 0);
      return total + parseInt(basePrice, 10) + offersPrice;
    }, 0);
  }


  getNamesDestinations() {
    const uniqueCityNames = new Set();

    this.#points.forEach((point) => {
      const destination = point.destinationForPoint;
      if (destination && destination.name) {
        uniqueCityNames.add(destination.name);
      }
    });

    return Array.from(uniqueCityNames);
  }

  getDatesTrip(){
    const tripDateFrom = this.#points.at(0)?.dateFrom;
    const tripDateTo = this.#points.at(-1)?.dateTo;

    return {
      tripDateFrom,
      tripDateTo
    };
  }


  #renderFilters() {
    const filters = this.filters;
    const prevFilterComponent = this.#tripFilterComponent;

    this.#tripFilterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#tripFilterComponent, this.#tripFilterContainer);
      return;
    }

    replace(this.#tripFilterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);

  };
}

