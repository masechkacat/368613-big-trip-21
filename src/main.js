import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filters-model.js';
import ClickModel from './model/click-mode-model.js';
import HeaderMainPresenter from './presenter/header-main-presenter.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');
const siteFilterControls = siteHeaderContainer.querySelector('.trip-controls__filters');
const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');
const pointsModel = new PointsModel;
const filterModel = new FilterModel;
const clickModel = new ClickModel;
const tripEventsPresenter = new TripEventsPresenter({tripEventsContainer: siteEventsElement, pointsModel, filterModel, clickModel});


const headerMainPresenter = new HeaderMainPresenter({tripInfoContainer: siteTripInfo,
  tripFilterContainer: siteFilterControls, filterModel, pointsModel, clickModel});

headerMainPresenter.init();

tripEventsPresenter.init();
