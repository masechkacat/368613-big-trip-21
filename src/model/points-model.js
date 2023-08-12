import { pointsMock, destinationsMock, offersMock } from '../data-mocks.js';

const POINT_COUNT = 3;

export default class PointsModel {
  points = pointsMock.slice(0, POINT_COUNT);//Array.from({length: POINT_COUNT}, generatePoint);

  getPoints() {
    return this.points;
  }

  getOffersForPoint(point) {
    const relevantOffers = offersMock.find((offer) => offer.type === point.type);
    return relevantOffers ? relevantOffers.offers : [];
  }

  getDestinationForPoint(point) {
    return destinationsMock.find((destination) => destination.name === point.destination);
  }
}
