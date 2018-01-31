import _ from 'underscore';
import async from 'async';
import firebase from '../../utils/firebase';
import moment from 'moment';

const storage = firebase.storage();

var webPortal = firebase.database();

export const CREATE_NOTIFICATION = 'create_notification';
export const GET_NOTIFICATIONS = 'get_notifications';
 
//Creates notification when user is a School Admin
export function createTeacherNotification(values) {

  const Parents = webPortal.ref('Parent').orderByChild('grade').equalTo(values.grade);
  if(values.recipients){
    const Notification = webPortal.ref('Notification').push().set({
      firstName : values.firstName,
      isClickable : values.isClickable,
      isSent : false,
      lastName : values.lastName,
      message : values.message,
      pic : values.pic,
      recipients : values.recipients,
      schoolId : values.schoolId,
      sendDate : values.sendDate,
      title : values.title,
      userId : values.userId,
      notificationType : values.notificationType == 'message' ? 'messageNotification' : values.notificationType == 'poll' ? 'pollNotification' : null
    })
    return dispatch => {
      dispatch({
        type: CREATE_NOTIFICATION,
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
          const Notification = webPortal.ref('Notification').push().set({
            firstName : values.firstName,
            isClickable : values.isClickable,
            isSent : false,
            lastName : values.lastName,
            message : values.message,
            pic : values.pic,
            recipients : recipients,
            schoolId : values.schoolId,
            sendDate : values.sendDate,
            title : values.title,
            userId : values.userId,
            notificationType: values.notificationType == 'message' ? 'messageNotification' : values.notificationType == 'poll' ? 'pollNotification' : null
          })
            dispatch({
              type: CREATE_NOTIFICATION,
              payload: 'success'
            })
        });
      })
    }
  }
}

//Creates notification when user is a District Admin
export function createDistrictNotification(values, districtOrSchool, schoolId, districtId) {
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
          const Notification = webPortal.ref('Notification').push().set({
            districtId : values.districtId,
            firstName : values.firstName ? values.firstName : null,
            isClickable : values.isClickable ? values.isClickable : null,
            isSent : false,
            lastName : values.lastName ? values.lastName : null,
            message : values.message ? values.message : null,
            pic : values.pic ? values.pic : "empty",
            recipients : recipients.length ? recipients : null,
            sendDate : values.sendDate ? values.sendDate : null,
            title : values.title ? values.title : null,
            userId : values.userId ? values.userId : null,
            notificationType: values.notificationType == 'message' ? 'messageNotification' : values.notificationType == 'poll' ? 'pollNotification' : null
          })
          dispatch({
            type: CREATE_NOTIFICATION,
            payload: 'success'
          })
      });
    })
  }
}

//Gets all polls that were created by the user
export function getNotificationsBySchoolId(user) {
  const Notifications = webPortal.ref('Notification').orderByChild('schoolId').equalTo(user);
  return dispatch => {
    Notifications.on('value', snapshot => {
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: snapshot.val()
      })
    })
  }
}

//Gets all polls that were created by the user
export function getNotificationsByDistrictId(user) {
  const Notifications = webPortal.ref('Notification').orderByChild('districtId').equalTo(user);
  return dispatch => {
    Notifications.on('value', snapshot => {
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: snapshot.val()
      })
    })
  }
}


//Gets all polls that were created by the user
export function getNotificationsByUserId(user) {
  const Notifications = webPortal.ref('Notification').orderByChild('userId').equalTo(user);
  return dispatch => {
    Notifications.on('value', snapshot => {
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: snapshot.val()
      })
    })
  }
}

export function deleteNotification(key) {
  const Notification = webPortal.ref('Notification').child(key)
  return dispatch => {
    Notification.remove();
  }
}

