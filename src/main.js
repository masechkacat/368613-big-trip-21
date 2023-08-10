import HeaderMainPresenter from './presenter/header-main-presenter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');
const siteFilterControls = siteHeaderContainer.querySelector('.trip-controls__filters');
const headerMainPresenter = new HeaderMainPresenter({tripInfoContainer: siteTripInfo, tripFilterContainer: siteFilterControls});
const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');
const tripEventsPresenter = new TripEventsPresenter({tripEventsContainer: siteEventsElement});


headerMainPresenter.init();
tripEventsPresenter.init();
