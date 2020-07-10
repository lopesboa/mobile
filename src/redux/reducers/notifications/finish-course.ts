import {Platform} from 'react-native';
import {NotificationType} from '../../../types';
import {TOGGLE} from '../../actions/notifications/finish-course';
import type {Action} from '../../actions/notifications/finish-course';
import translations from '../../../translations';

export type State = {
  type: NotificationType;
  label: string;
  isActive: boolean;
};

const initialState: State = {
  type: 'finish-course',
  label: translations.currentlyDoingReminder,
  isActive: console.log({Platform}) || Platform.OS === 'android',
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case TOGGLE: {
      return {...state, isActive: action.payload};
    }
    default:
      return state;
  }
};

export default reducer;
