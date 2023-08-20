import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { replace, render } from '../framework/render.js';

export default class PointPresenter {
  #tripEventsComponent = null;
  #point = null;
  #offers = null;
  #destinations = null;

  constructor(tripEventsComponent, point, offers, destinations) {
    this.#tripEventsComponent = tripEventsComponent;
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init() {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointView = new PointView({
      tripPoint: this.#point,
      onEditClick: () => {
        replaceEditToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditView = new EditPointView({
      tripPoint: this.#point,
      allOffers: this.#offers,
      allDestinations: this.#destinations,
      onCloseEditFormButton: () =>{
        replacePointToEdit();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormSubmit: () => {
        replacePointToEdit();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceEditToPoint() {
      replace(pointEditView, pointView);
    }

    function replacePointToEdit() {
      replace(pointView, pointEditView);
    }

    render(pointView, this.#tripEventsComponent.element);
  }
}
