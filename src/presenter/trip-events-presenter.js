import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import ListView from '../view/list-view.js';
import { render,replace } from '../framework/render.js';

export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;

  #tripSortComponent = new SortView();
  #tripEventsComponent = new ListView();

  #tripEventsPoints = [];

  constructor ({tripEventsContainer, pointsModel}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripEventsPoints = this.#pointsModel.enrichedPoints;

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
    const pointView = new PointView({
      tripPoint: point,
      onEditClick: () => {
        replaceEditToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditView = new EditPointView({
      tripPoint: point,
      allOffers: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations,
      onCloseEditFormButton: () =>{
        replacePointToEdit();
      },
      onFormSubmit: () => {
        replacePointToEdit();

        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function escKeyDownHandler (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replacePointToEdit();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    }

    function replaceEditToPoint() {
      replace(pointEditView, pointView);
    }

    function replacePointToEdit() {
      replace(pointView, pointEditView);
    }

    render(pointView, this.#tripEventsComponent.element);
  }
}
