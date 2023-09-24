import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import LoadingView from '../view/loading-view.js';
import NoPointView from '../view/no-point-view.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { sort } from '../utils/sort.js';
import { SortType, UpdateType, UserAction, filter, FilterType, Mode, UiTimeLimit } from '../utils/utiles.js';

export default class TripEventsPresenter {
  #uiBlocker = new UiBlocker({
    lowerLimit: UiTimeLimit.LOWER_LIMIT,
    upperLimit: UiTimeLimit.UPPER_LIMIT
  });

  #tripEventsContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #formStateModel = null;

  #tripSortComponent = null;
  #tripListComponent = new ListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;

  #newPointPresenter = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #isLoading = true;

  constructor ({tripEventsContainer, pointsModel, filterModel, formStateModel}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#formStateModel = formStateModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripListComponent.element,
      allOffers: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointDestroy,
    });
    console.log(this.#pointsModel);

    this.#formStateModel.addObserver(this.#handleFormStateChanged);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;

    const points = this.#pointsModel.enrichedPoints;
    const filteredPoints = filter[this.#filterType](points);

    return sort[this.#currentSortType](filteredPoints);
  }

  init() {

    this.#renderTripEvents();
  }

  #handleViewAction = async(actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    console.log('updateType', updateType);
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTripEvents();
        break;
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripEvents();
        this.#renderTripEvents();
        break;
      case UpdateType.MAJOR:
        this.#clearTripEvents({resetSortType: true});
        this.#renderTripEvents();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleFormStateChanged = (state) => {
    if (state === Mode.CREATING) {
      this.#handleNewPointFormOpen();
    }
  };

  #handleNewPointFormOpen() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#newPointPresenter.init();
  }


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPointList();
    this.#renderTripEvents();
  };

  #handleNewPointDestroy = () => {
    this.#formStateModel.formState = Mode.DEFAULT;


    if(!this.points.length && this.#formStateModel.formState !== Mode.CREATING){
      remove(this.#tripSortComponent);
      this.#tripSortComponent = null;
      this.#renderNoPoints();
    }

  };


  #clearPointList() {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearTripEvents({resetSortType = false} = {}){
    this.#clearPointList();

    remove(this.#tripSortComponent);
    remove(this.#loadingComponent);

    if(this.#noPointComponent){
      remove(this.#noPointComponent);
    }

    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({pointListContainer: this.#tripListComponent.element,
      allOffers: this.#pointsModel.offers, allDestinations: this.#pointsModel.destinations,
      onDataChange: this.#handleViewAction, onModeChange: this.#handleModeChange});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderSort() {

    const prevSortComponent = this.#tripSortComponent;

    this.#tripSortComponent = new SortView({
      currentSortType: this.#currentSortType,
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
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoints(points) {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPointsList() {
    render(this.#tripListComponent, this.#tripEventsContainer);
  }

  #renderTripEvents() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (!this.points.length && this.#formStateModel.formState !== Mode.CREATING) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints(this.points);
  }

}
