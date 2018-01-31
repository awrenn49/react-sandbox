import { GET_POLLS } from '../contexts/polling/actions/polling_action';
import _ from 'underscore';
export default function(state = {}, action) {
  switch (action.type) {
    case GET_POLLS:
      return action.payload
  }
  return state;
}