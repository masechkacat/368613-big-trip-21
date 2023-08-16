import {createElement} from '../render.js';
import { formatDate, FormatsDate } from '../utiles.js';

const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: {
    description: '',
    name: '',
    pictures: []
  },
  isFavorite: false,
  offers: [],
  type: 'flight'
};

function createEditPointTemplate(tripPoint, allOffers, allDestinations) {

  const {destination, basePrice, dateFrom, dateTo, offers, type} = tripPoint;

  const formattedDateFrom = typeof dateFrom === 'string' ? '' : formatDate(dateFrom, FormatsDate.DMYHM);
  const formattedDateTo = typeof dateTo === 'string' ? '' : formatDate(dateTo, FormatsDate.DMYHM);

  const currentTypeOffers = allOffers.find((offerOfType) => offerOfType.type === type)?.offers ?? DEFAULT_POINT.offers;

  const getOfferCheckboxes = () => currentTypeOffers.map((offer) => {
    const checked = offers.includes(offer) ? 'checked' : '';
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');

  // Проверки наличия предложений и отмеченных предложений
  const hasOffersForType = currentTypeOffers.length > 0;
  const hasCheckedOffer = currentTypeOffers.some((offer) => offers.includes(offer));
  const hideOffersSection = !hasOffersForType || !hasCheckedOffer;

  const hideDesinationSection = !destination.id;

  const hideEventDetailsSection = hideOffersSection && hideDesinationSection;

  const imagesDestination = destination.id
    ? destination.pictures.map((pictures) => `<img class="event__photo" src="${pictures.src}" alt="Event photo">`).join('')
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
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
          <h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
          <p class="event__destination-description">${destination.description}</p>

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

export default class EditPointView {
  constructor({tripPoint, allOffers, allDestinations}) {
    this.tripPoint = tripPoint;
    this.allOffers = allOffers;
    this.allDestinations = allDestinations;
  }

  getTemplate() {
    return createEditPointTemplate(this.tripPoint ?? DEFAULT_POINT, this.allOffers, this.allDestinations);
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
