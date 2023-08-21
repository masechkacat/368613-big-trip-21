import { pointsMock, destinationsMock, offersMock } from '../mocks/data-mocks.js';

const POINT_COUNT = 3;

export default class PointsModel {
  #points = null;
  #offers = null;
  #destinations = null;
  #enrichedPoints = null;

  constructor() {
    this.#points = pointsMock.slice(0, POINT_COUNT);//Array.from({length: POINT_COUNT}, generatePoint);
    this.#offers = offersMock;
    this.#destinations = destinationsMock;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  get enrichedPoints() {
    if (!this.#enrichedPoints) { // Ленивое кеширование
      this.#enrichedPoints = this.#points.map((point) => ({
        ...point,
        checkedOffersForPoint: this.getCheckedOffersForPoint(point),
        destinationForPoint: this.getDestinationForPoint(point)
      }));
    }
    return this.#enrichedPoints;
  }

  getCheckedOffersForPoint(point) {
    const pointTypeOffers = this.#offers.find((offer) => offer.type === point.type);
    return pointTypeOffers ? pointTypeOffers.offers
      .filter((offer) => point.offers.includes(offer.id)) : [];
  }

  getDestinationForPoint(point) {
    return this.#destinations.find((destination) => destination.id === point.destination);
  }

}
