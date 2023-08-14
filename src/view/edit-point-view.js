import {createElement} from '../render.js';
import { formatDate, FormatsDate } from '../utiles.js';

function createEditPointTemplate(point) {

  const {destination, basePrice, dateFrom, dateTo, offers, type} = point[0];


  const getOfferCheckboxes = () => offers.map((offer) => {
    const checked = offers.includes(offer.id) ? 'checked' : '';
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');

  const uniqueEventType = new Set();

  const uniqueDestinationNames = new Set();

  for (let i = 0; i < point.length; i++) {
    const obj = point[i];
    if (obj.type) {
      uniqueEventType.add(`<div class="event__type-item">
        <input id="event-type-${obj.type}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${obj.type}">
        <label class="event__type-label event__type-label--${obj.type}" for="event-type-${obj.type}">${obj.type}</label>
      </div>`);
    }
    if (obj.destination && obj.destination.name) { // && destination.name !== obj.destination.name
      uniqueDestinationNames.add(`<option value="${obj.destination.name}"></option>`);
    }
  }
  const eventTypeArray = Array.from(uniqueEventType).join('');

  const destinationNameArray = Array.from(uniqueDestinationNames).join('');

  const imagesDestination = destination.pictures.map((src) => `<img class="event__photo" src="${src}" alt="Event photo">`);

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
              ${eventTypeArray}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationNameArray}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, FormatsDate.DMYHM)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, FormatsDate.DMYHM)}">
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
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
           ${getOfferCheckboxes()}
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${imagesDestination}
            </div>
          </div>

        </section>
      </section>
    </form>
  </li>`
  );
}

export default class EditPointView {
  constructor({tripEventsPoints}) {
    this.tripEventsPoints = tripEventsPoints;
  }

  getTemplate() {
    return createEditPointTemplate(this.tripEventsPoints);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
