import {StoreAction} from 'src/redux/_types';

const SCHEDULE_NOTIFICATION = '@@notifications/SCHEDULE_NOTIFICATION';
const UNSCHEDULE_NOTIFICATION = '@@notifications/UNSCHEDULE_NOTIFICATION';

type Action =
  | {
      type: '@@notifications/SCHEDULE_NOTIFICATION';
      payload: {
        id: string;
      };
    }
  | {
      type: '@@notifications/UNSCHEDULE_NOTIFICATION';
      payload: {
        id: string;
      };
    };

const scheduleNotification = (contentId: string) => (
  dispatch,
  getState,
  services,
): StoreAction<Action> => {};

const unscheduleNotification = (contentId: string) => (
  dispatch,
  getState,
  services,
): StoreAction<Action> => {};
