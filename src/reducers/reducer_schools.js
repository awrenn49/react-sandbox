import { GET_SCHOOLS_BY_DISTRICT_ID } from '../contexts/polling/actions/schools_action';
import _ from 'underscore';
export default function(state = {}, action) {
  switch (action.type) {
    case GET_SCHOOLS_BY_DISTRICT_ID:
      return action.payload
  }
  return state;
}