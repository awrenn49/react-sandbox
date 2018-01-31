import { GET_LOGIN_INFO } from '../contexts/login/actions/login_action';
import _ from 'underscore';
export default function(state = {}, action) {
  switch (action.type) {
    case GET_LOGIN_INFO:
      return action.payload
  }
  return state;
}