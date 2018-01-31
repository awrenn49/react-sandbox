import { GET_NOTIFICATIONS } from '../contexts/notifications/actions/notification_action';

import _ from 'underscore';
export default function(state = {}, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return action.payload
  }
  return state;
}