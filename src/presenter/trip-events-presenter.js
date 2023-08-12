import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import ListView from '../view/list-view.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  tripSortComponent = new SortView();
  tripEventsComponent = new ListView();

  constructor ({tripEventsContainer, pointsModel}) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.tripEventsPoints = this.pointsModel.getPoints().map((point) => ({
      ...point,
      offers: this.pointsModel.getOffersForPoint(point),
      destination: this.pointsModel.getDestinationForPoint(point)
    }));

    render(this.tripSortComponent, this.tripEventsContainer);
    render(this.tripEventsComponent, this.tripEventsContainer);
    render(new EditPointView(), this.tripEventsComponent.getElement());

    this.renderPoints(this.tripEventsPoints);
    render(new NewPointView(), this.tripEventsComponent.getElement());
  }

  renderPoints(points) {
    points.forEach((point) => {
      render(new PointView({ point }), this.tripEventsComponent.getElement());
    });
  }
}
