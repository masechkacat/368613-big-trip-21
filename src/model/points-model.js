import { pointsMock, destinationsMock, offersMock } from '../data-mocks.js';

const POINT_COUNT = 3;

export default class PointsModel {
  constructor() {
    this.points = pointsMock.slice(0, POINT_COUNT);//Array.from({length: POINT_COUNT}, generatePoint);
    this.offers = offersMock;
    this.destinations = destinationsMock;
  }

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersForPoint(point) {
    const pointTypeOffers = this.offers.find((offer) => offer.type === point.type);
    return pointTypeOffers ? pointTypeOffers.offers : [];
  }

  getDestinationForPoint(point) {
    return this.destinations.find((destination) => destination.name === point.destination);
  }

}
