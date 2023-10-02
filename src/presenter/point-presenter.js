import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { replace, render,remove } from '../framework/render.js';
import { UpdateType, UserAction, Mode} from '../utils/utiles.js';
export default class PointPresenter {
  #pointListContainer = null;
  #point = null;
  #allOffers = null;
  #allDestinations = null;
  #mode = Mode.DEFAULT;

  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor({pointListContainer, allOffers, allDestinations, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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
      onDeleteEditFormButton: this.#handleDeleteEditFormButton
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }


  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    this.#pointEditComponent.reset(this.#point);
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = (point) => {
    /*const isMinorUpdate = isSameDates(this.#point.dateFrom, update.dateFrom)
    || isSameDates(this.#point.dateTo, update.dateTo)
    || isSamePrices(this.#point.basePrice, update.basePrice);*/

    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      /*isMinorUpdate ? UpdateType.MINOR :*/UpdateType.MINOR,
      point
    );
  };

  #handleDeleteEditFormButton = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleCloseEditFormButton = () => {
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () =>{
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
