import ApiService from './framework/api-service.js';
import {ApiServiceMethod} from './utils/const.js';

export default class TripApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: ApiServiceMethod.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: ApiServiceMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: ApiServiceMethod.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {...point,
      'date_from': point.dateFrom?.toISOString?.() ?? null,
      'date_to': point.dateTo?.toISOString?.() ?? null,
      'base_price': parseInt(point.basePrice, 10),
      'is_favorite': point.isFavorite,
    };

    if('checkedOffersForPoint' in adaptedPoint) {
      delete adaptedPoint.checkedOffersForPoint;
    }
    if('destinationForPoint' in adaptedPoint) {
      delete adaptedPoint.destinationForPoint;
    }
    if('currentTypeOffers' in adaptedPoint) {
      delete adaptedPoint.currentTypeOffers;
    }
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
