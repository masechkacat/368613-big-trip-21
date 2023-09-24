import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/utiles.js';
//import { pointsMock, destinationsMock, offersMock } from '../mocks/data-mocks.js';


export default class PointsModel extends Observable {
  #enrichedPoints = null;
  #tripApiService = null;

  #points = [];
  #destinations = [];
  #offers = [];


  constructor({tripApiService}) {
    super();
    this.#tripApiService = tripApiService;
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

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#tripApiService.points,
        this.#tripApiService.destinations,
        this.#tripApiService.offers,
      ]);

      this.#points = points.map(this.#adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  get enrichedPoints() {
    if (!this.#enrichedPoints) {
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

  async addPoint(updateType, update) {
    try {
      const response = await this.#tripApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#tripApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#tripApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
