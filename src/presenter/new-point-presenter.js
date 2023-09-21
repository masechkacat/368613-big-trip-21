import EditPointView from '../view/edit-point-view.js';
import { render,remove, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction, Mode, generateID } from '../utils/utiles.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #allOffers = null;
  #allDestinations = null;
  #clickModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({pointListContainer, allOffers, allDestinations, clickModel, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#clickModel = clickModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditPointView({
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      clickModel: this.#clickModel,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteEditFormButton: this.#handleDeleteEditFormButton,
      type: Mode.CREATING
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy(){
    if(this.#pointEditComponent === null){
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    //this.#clickModel.setClickState(UpdateType.MINOR, Mode.DEFAULT);

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    console.log('form submited', point);
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {id: generateID(), ...point}
    );

    this.destroy();
  };

  #handleDeleteEditFormButton = () => {
    console.log('Before closing form. Click state:', this.#clickModel.clickState);
    this.destroy();
    console.log('After closing form. Click state:', this.#clickModel.clickState);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
