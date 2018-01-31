import { GET_EVENTS_BY_SCHOOL_ID } from '../contexts/calendar/actions/events_action';
import { CLEAR_EVENTS } from '../contexts/login/actions/login_action';

import _ from 'underscore';
export default function(state = {}, action) {
  switch (action.type) {
    case GET_EVENTS_BY_SCHOOL_ID:
      return action.payload
    case CLEAR_EVENTS:
      return action.payload;  
  }
  return state;
}