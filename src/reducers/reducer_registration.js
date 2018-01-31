import { CREATE_USER_PROFILE , GET_DISTRICTS } from '../contexts/registration/actions/registration_action';

import _ from 'underscore';
export default function(state = {}, action) {
  switch (action.type) {
    case CREATE_USER_PROFILE:
      return _.extend(state, {errorMessage : action.payload});
  }
  switch (action.type) {
    case GET_DISTRICTS:
      return _.extend(state, {districts : action.payload}) ;
  }
  return state;
}