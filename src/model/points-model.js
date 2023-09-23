import Observable from '../framework/observable.js';
import { pointsMock, destinationsMock, offersMock } from '../mocks/data-mocks.js';


export default class PointsModel extends Observable {
  #points = null;
  #offers = null;
  #destinations = null;
  #enrichedPoints = null;

  constructor() {
    super();
    this.#points = pointsMock;
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

  updatePoint(updateType, update){
    const index = this.#enrichedPoints.findIndex((point) => point.id === update.id);

    this.#enrichedPoints = [
      ...this.#enrichedPoints.slice(0, index),
      update,
      ...this.#enrichedPoints.slice(index + 1)
    ];
    this._notify(updateType, update);
  }

  addPoint(updateType, update){
    this.#enrichedPoints = [
      update,
      ...this.#enrichedPoints
    ];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update){
    const index = this.#enrichedPoints.findIndex((event) => event.id === update.id);

    this.#enrichedPoints = [
      ...this.#enrichedPoints.slice(0, index),
      ...this.#enrichedPoints.slice(index + 1)
    ];
    this._notify(updateType, update);
  }
}
