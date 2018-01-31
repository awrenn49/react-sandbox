import { START_LOADING, STOP_LOADING } from '../contexts/loading/actions/loading_action';
import { STOP_LOADING_REGISTRATION } from '../contexts/registration/actions/registration_action';
import { STOP_LOADING_PROFILE_PIC_EDIT } from '../contexts/manage/actions/manage_action';
import _ from 'underscore';
export default function(state = {}, action) {
  switch (action.type) {
    case START_LOADING:
      return action.payload
    case STOP_LOADING:
      return action.payload
    case STOP_LOADING_REGISTRATION:
      return action.payload
    case STOP_LOADING_PROFILE_PIC_EDIT:
      return action.payload
  }
  return state;
}