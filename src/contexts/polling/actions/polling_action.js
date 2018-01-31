import _ from 'underscore';
import async from 'async';
import firebase from '../../utils/firebase';

const storage = firebase.storage();
var webPortal = firebase.database();

export const CREATE_POLL = 'create_poll';
export const GET_POLLS = 'get_polls';

//Creates poll when user is a School Admin
export function createSchoolAdminPoll(values) {
  const Parents = webPortal.ref('Parent').orderByChild('grade').equalTo(values.grade);
  if(values.recipients){
    const Poll = webPortal.ref('Poll').push().set({
      firstName : values.firstName,
      isSent : false,
      lastName : values.lastName,
      pic : values.pic,
      questions : values.questions,
      recipients : values.recipients,
      schoolId : values.schoolId,
      sendDate : values.sendDate,
      title : values.title,
      userId : values.userId
    })
    return dispatch => {
      dispatch({
        type: CREATE_POLL,
        payload: 'success'
      })
    }
  } else{
    var recipients = [];
    return dispatch => {
      Parents.on('value', querySnapshot => {
        async.each(querySnapshot.val(), function(person, callback) {
          person.email ? recipients.push(person.email) : null;
          callback(null, person)
        }, function (err, results) {
          const Poll = webPortal.ref('Poll').push().set({
            firstName : values.firstName,
            isSent : false,
            lastName : values.lastName,
            pic : values.pic,
            questions : values.questions,
            recipients : recipients,
            schoolId : values.schoolId,
            sendDate : values.sendDate,
            title : values.title,
            userId : values.userId
          })
            dispatch({
              type: CREATE_POLL,
              payload: 'success'
            })
        });
      })
    }
  }
}

//Creates poll when user is a District Admin
export function createDistrictAdminPoll(values, districtOrSchool, schoolId, districtId) {
  var Parents; 
  schoolId ? Parents = webPortal.ref('Parent').orderByChild('schoolId').equalTo(schoolId) 
    : Parents = webPortal.ref('Parent').orderByChild('districtId').equalTo(districtId);
    
  var recipients = [];
  return dispatch => {
    Parents.on('value', querySnapshot => {
      async.each(querySnapshot.val(), function(person, callback) {
        person.email ? recipients.push(person.email) : null;
        callback(null, person)
      }, function (err, results) {
          const Poll = webPortal.ref('Poll').push().set({
            districtId : values.districtId,
            firstName : values.firstName ? values.firstName : null,
            isSent : false,
            lastName : values.lastName ? values.lastName : null,
            pic : values.pic ? values.pic : "empty",
            questions : values.questions,
            recipients : recipients.length ? recipients : null,
            sendDate : values.sendDate ? values.sendDate : null,
            title : values.title ? values.title : null,
            userId : values.userId ? values.userId : null
          })
          dispatch({
            type: CREATE_POLL,
            payload: 'success'
          })
      });
    })
  }
}

//Gets all polls that were created by the user
export function getPollsBySchoolId(user) {
  const Polls = webPortal.ref('Poll').orderByChild('schoolId').equalTo(user);
  return dispatch => {
    Polls.on('value', snapshot => {
      dispatch({
        type: GET_POLLS,
        payload: snapshot.val()
      })
    })
  }
}

//Gets all polls that were created by the user
export function getPollsByDistrictId(user) {
  const Polls = webPortal.ref('Poll').orderByChild('districtId').equalTo(user);
  return dispatch => {
    Polls.on('value', snapshot => {
      dispatch({
        type: GET_POLLS,
        payload: snapshot.val()
      })
    })
  }
}

export function deletePoll(key) {
  const Poll = webPortal.ref('Poll').child(key)
  return dispatch => {
    Poll.remove();
  }
}

