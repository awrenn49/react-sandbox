import { GET_TEACHERS_BY_SCHOOL_ID, GET_PARENTS_BY_SCHOOL_ID } from '../contexts/roster/actions/roster_action';

import _ from 'underscore';

export default function(state = {}, action) {
  switch (action.type) {
    case GET_TEACHERS_BY_SCHOOL_ID:
      return _.extend(state, {teachers: action.payload})
    case GET_PARENTS_BY_SCHOOL_ID:
      return _.extend(state, {parents: action.payload})
  }
  return state;
}