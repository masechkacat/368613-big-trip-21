import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import { generateFilter } from './mocks/filters-generator.js';
import HeaderMainPresenter from './presenter/header-main-presenter.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');
const siteFilterControls = siteHeaderContainer.querySelector('.trip-controls__filters');
const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');
const pointsModel = new PointsModel;
const tripEventsPresenter = new TripEventsPresenter({tripEventsContainer: siteEventsElement, pointsModel});

const filters = generateFilter(pointsModel.enrichedPoints);

const headerMainPresenter = new HeaderMainPresenter({tripInfoContainer: siteTripInfo, tripFilterContainer: siteFilterControls, filters: filters});

headerMainPresenter.init();

tripEventsPresenter.init();
