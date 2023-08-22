import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { replace, render,remove } from '../framework/render.js';

export default class PointPresenter {
  #pointListContainer = null;
  #point = null;
  #allOffers = null;
  #allDestinations = null;
  #handleDataChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor({pointListContainer, allOffers, allDestinations, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      tripPoint: this.#point,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new EditPointView({
      tripPoint: this.#point,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onCloseEditFormButton: this.#handleCloseEditFormButton,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
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

  #handleFavoriteClick = () =>{
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
