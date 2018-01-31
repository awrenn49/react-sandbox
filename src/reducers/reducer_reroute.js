import { CREATE_POLL } from '../contexts/polling/actions/polling_action';
import { CREATE_NOTIFICATION } from '../contexts/notifications/actions/notification_action';
import { STOP_LOADING_REGISTRATION } from '../contexts/registration/actions/registration_action';
import { CLEAR_REROUTE } from '../contexts/reroute/actions/reroute_action';
import _ from 'underscore';
export default function(state = {}, action) {
  switch (action.type) {
    case CREATE_POLL:
      return action.payload;
    case CREATE_NOTIFICATION:
      return action.payload;
    case STOP_LOADING_REGISTRATION:
      return action.payload;
    case CLEAR_REROUTE:
      return null;
  }
  return state;
}