import _ from 'underscore';
import async from 'async';
import firebase from '../../utils/firebase';
import moment from 'moment';

const storage = firebase.storage();

var webPortal = firebase.database();

export const CREATE_EVENT = 'create_event';
export const GET_EVENTS_BY_SCHOOL_ID = 'get_events_by_school_id';
export const DELETE_EVENT = 'delete_event';

//Gives user the ability to create an event with a corresponding date, and details
export function createEvent(values, userId, districtId, schoolId) {

    var epochTimeStart = Math.floor(moment(values.startDate).valueOf()/1000)
    var epochTimeEnd = Math.floor(moment(values.endDate).valueOf()/1000)

    const Event = webPortal.ref('Event').push().set({
      description: values.description ? values.description : null,
      districtId: districtId,
      endDate: epochTimeEnd ? epochTimeEnd : null,
      isVideoConference: values.isVideoConference,
      name: values.eventName,
      schoolId: schoolId,
      startDate: epochTimeStart ? epochTimeStart : null,
      userId: userId
    })

  return dispatch => {
    dispatch({
      type: CREATE_EVENT,
      payload: Event      
    })
  }
}

export function getCalendarEventsBySchoolId(schoolId) {
  const Events = webPortal.ref('Event').orderByChild('schoolId').equalTo(schoolId);
  return dispatch => {
    Events.on('value', snapshot => {
      dispatch({
        type: GET_EVENTS_BY_SCHOOL_ID,
        payload: snapshot.val()
      })
    })
  }
}

export function getCalendarEventsByDistrictId(districtId) {
  const Events = webPortal.ref('Event').orderByChild('districtId').equalTo(districtId);
  return dispatch => {
    Events.on('value', snapshot => {
      dispatch({
        type: GET_EVENTS_BY_SCHOOL_ID,
        payload: snapshot.val()
      })
    })
  }
}


export function deleteCalendarEvent(key) {
  const Event = webPortal.ref('Event').child(key)
  return dispatch => {
    Event.remove();
  }
}

