import { pointsMock } from '../data-mocks.js';

const POINT_COUNT = 3;

export default class PointsModel {
  points = pointsMock.slice(0, POINT_COUNT);//Array.from({length: POINT_COUNT}, generatePoint);

  getPoints() {
    return this.points;
  }
}
