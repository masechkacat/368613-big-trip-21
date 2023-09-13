import { formatDate, FormatsDate } from '../utils/utiles.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';

const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destinationForPoint: {
    description: '',
    name: '',
    pictures: []
  },
  isFavorite: false,
  checkedOffersForPoint: [],
  type: 'flight'
};

function createEditPointTemplate({state, allOffers, allDestinations}) {

  const {basePrice, checkedOffersForPoint, type, destinationForPoint, dateFrom, dateTo} = state;

  const formattedDateFrom = formatDate(dateFrom, FormatsDate.DMYHM);
  const formattedDateTo = formatDate(dateTo, FormatsDate.DMYHM);


  const currentType = (state === DEFAULT_POINT) ? DEFAULT_POINT.type : state.type;
  const currentTypeOffers = allOffers.find((offerOfType) => offerOfType.type === currentType)?.offers ?? DEFAULT_POINT.offers;
  const hasOffersForType = currentTypeOffers.length > 0;
  const hideOffersSection = !hasOffersForType;
  const hideDesinationSection = !state.destinationForPoint.id;
  const hideEventDetailsSection = hideOffersSection && hideDesinationSection;


  const getOfferCheckboxes = () => currentTypeOffers.map((offer) => {
    const checked = checkedOffersForPoint.some((checkedOffer) => checkedOffer.id === offer.id) ? 'checked' : '';
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" data-offer-id="${offer.id}"  id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');

  const imagesDestination = destinationForPoint.id
    ? destinationForPoint.pictures.map((pictures) => `<img class="event__photo" src="${pictures.src}" alt="Event photo">`).join('')
    : '';

  const eventTypesTemplate = allOffers.map((offer) => `<div class="event__type-item">
  <input id="event-type-${offer.type}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${offer.type}">
  <label class="event__type-label event__type-label--${offer.type}" for="event-type-${offer.type}">${offer.type}</label>
</div>`).join('');

  const destinationNamesTemplate = allDestinations.map((avialableDestination) => `<option value="${avialableDestination.name}"></option>`).join('');

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationForPoint.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationNamesTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedDateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedDateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      ${hideEventDetailsSection ? '' : `
      <section class="event__details">
      ${hideOffersSection ? '' : `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
           ${getOfferCheckboxes()}
           </div>

        </section>
        `}
        ${hideDesinationSection ? '' : `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">${destinationForPoint.name}</h3>
          <p class="event__destination-description">${destinationForPoint.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${imagesDestination}
            </div>
          </div>

        </section>
        `}
      </section>
      `}
    </form>
  </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #handleFormSubmit = null;
  #handleCloseEditFormButton = null;
  #handleDeleteEditFormButton = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({tripPoint = DEFAULT_POINT, allOffers, allDestinations, onFormSubmit, onCloseEditFormButton, onDeleteEditFormButton}) {
    super();
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this._setState(EditPointView.parsePointToState(tripPoint));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseEditFormButton = onCloseEditFormButton;
    this.#handleDeleteEditFormButton = onDeleteEditFormButton;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate({state: this._state, allOffers: this.#allOffers, allDestinations: this.#allDestinations});
  }

  reset(tripPoint) {
    this.updateElement(
      EditPointView.parsePointToState(tripPoint),
    );
  }


  _restoreHandlers = () => {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditFormButtonHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelectorAll('.event__type-input').forEach((element) => {
      element.addEventListener('change', this.#typeInputClick);
    });
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputChange);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteEditFormButtonHandler);

    const offerBlock = this.element.querySelector('.event__available-offers');

    if(offerBlock){
      offerBlock.addEventListener('change', this.#offerClickHanlder);
    }
    this.#setDatepickers();
  };

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.dateTo,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      });

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.dateFrom,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  removeElement = () => {
    super.removeElement();

    if(this.#datepickerFrom){
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if(this.#datepickerTo){
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #deleteEditFormButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteEditFormButton(EditPointView.parseStateToPoint(this._state));
  };

  #closeEditFormButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseEditFormButton();
  };


  #typeInputClick = (evt) => {
    evt.preventDefault();
    const newTypeOffers = this.#allOffers.find((offer) => offer.type === evt.target.value)?.offers ?? [];

    this.updateElement({
      type: evt.target.value,
      currentTypeOffers: newTypeOffers,
      offers: []
    });
  };

  #offerClickHanlder = (evt) => {
    evt.preventDefault();

    const newCheckedOffersForPoint = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((offer) => offer.dataset.offerId);

    this._setState({
      offers: newCheckedOffersForPoint,
      checkedOffersForPoint: this.#allOffers
        .find((offer) => offer.type === this._state.type).offers
        .filter((offer) => newCheckedOffersForPoint.includes(offer.id.toString()))
    });
    //console.log(this._state);
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: evt.target.value
    });
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestinationName = evt.target.value;
    const selectedDestination = this.#allDestinations.find((destination) => destination.name === selectedDestinationName);

    if (selectedDestination) {
      const updatedDestinationForPoint = {
        ...selectedDestination,
      };

      this.updateElement({
        destinationForPoint: updatedDestinationForPoint,
        destination: selectedDestination.id
      });

    } else {
      this.updateElement({
        destinationForPoint: DEFAULT_POINT.destinationForPoint,
        destination: null
      });
    }
  };

  static parsePointToState = (tripPoint) => ({
    ...tripPoint,
  });

  static parseStateToPoint = (state) => {
    const tripPoint = {...state};
    return tripPoint;
  };
}
