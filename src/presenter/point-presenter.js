import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { replace, render } from '../framework/render.js';

export default class PointPresenter {
  #tripEventsContainer = null;
  #point = null;
  #allOffers = null;
  #allDestinations = null;

  #tripComponent = null;
  #tripEditComponent = null;

  constructor({tripEventsContainer}) {
    this.#tripEventsContainer = tripEventsContainer;
  }

  init(tripPoint, allOffers, allDestinations) {
    this.#point = tripPoint;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;

    this.#tripComponent = new PointView({
      tripPoint: this.#point,
      onEditClick: this.#handleEditClick,
    });
    this.#tripEditComponent = new EditPointView({
      tripPoint: this.#point,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onCloseEditFormButton: this.#handleCloseEditFormButton,
    });

    render(this.#tripComponent, this.#tripEventsContainer);
  }

  #replaceCardToForm() {
    replace(this.#tripEditComponent, this.#tripComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#tripComponent, this.#tripEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };

  #handleCloseEditFormButton = () => {
    this.#replaceFormToCard();
  };
}

/*const escKeyDownHandler = (evt) => {
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
}*/
