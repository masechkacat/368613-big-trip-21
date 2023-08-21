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
      onFavoriteClick: this.#favoriteClickHandler,
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

  #favoriteClickHandler = () =>{
    this.#point.isFavorite = !this.#point.isFavorite;
    this.#tripComponent.updateFavoriteStatus(this.#point.isFavorite);
  };
}
