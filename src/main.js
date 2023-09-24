import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filters-model.js';
import FormStateModel from './model/form-state-model.js.js';
import HeaderMainPresenter from './presenter/header-main-presenter.js';
import TripApiService from './trip-api-service.js';
import { ApiServiceConnector } from './utils/utiles.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');
const siteFilterControls = siteHeaderContainer.querySelector('.trip-controls__filters');
const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');

const pointsModel = new PointsModel({
  tripApiService: new TripApiService(ApiServiceConnector.END_POINT, ApiServiceConnector.AUTHORIZATION)
});
const filterModel = new FilterModel;
const formStateModel = new FormStateModel;

const tripEventsPresenter = new TripEventsPresenter({
  tripEventsContainer: siteEventsElement,
  pointsModel,
  filterModel,
  formStateModel
});


const headerMainPresenter = new HeaderMainPresenter({
  tripInfoContainer: siteTripInfo,
  tripFilterContainer: siteFilterControls,
  filterModel,
  pointsModel,
  formStateModel
});


pointsModel.init();

tripEventsPresenter.init();

headerMainPresenter.init();

/*const siteHeaderContainer = document.querySelector('.page-header');
const siteTripInfo = siteHeaderContainer.querySelector('.trip-main');
const siteFilterControls = siteHeaderContainer.querySelector('.trip-controls__filters');
const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');

// Создаем асинхронную функцию для инициализации
async function initializeApp() {
  try {
    // Создаем объект TripApiService
    const tripApiService = new TripApiService(ApiServiceConnector.END_POINT, ApiServiceConnector.AUTHORIZATION);

    // Создаем объект PointsModel и инициализируем его данными
    const pointsModel = new PointsModel({
      tripApiService
    });
    await pointsModel.init(); // Дождемся инициализации

    // Создаем остальные необходимые объекты
    const filterModel = new FilterModel();
    const formStateModel = new FormStateModel();

    // Создаем презентеры после успешной инициализации PointsModel
    const tripEventsPresenter = new TripEventsPresenter({
      tripEventsContainer: siteEventsElement,
      pointsModel,
      filterModel,
      formStateModel
    });

    const headerMainPresenter = new HeaderMainPresenter({
      tripInfoContainer: siteTripInfo,
      tripFilterContainer: siteFilterControls,
      filterModel,
      pointsModel,
      formStateModel
    });

    // Инициализируем презентеры
    tripEventsPresenter.init();
    headerMainPresenter.init();
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
  }
}

// Вызываем асинхронную функцию для инициализации приложения
initializeApp();
*/
