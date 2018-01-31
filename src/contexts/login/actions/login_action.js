import _ from 'underscore';
import async from 'async';
import firebase from '../../utils/firebase';

const storage = firebase.storage();

var webPortal = firebase.database();

export const GET_LOGIN_INFO = 'get_login_info';
export const CLEAR_EVENTS = 'clear_events';
export const LOGOUT = 'logout';

//Returns that the user is logged in
export function getLoginInfo(userId) {

  const DistrictAdmin = webPortal.ref('DistrictAdmin').orderByChild('userId').equalTo(userId);
  const SchoolAdmin = webPortal.ref('SchoolAdmin').orderByChild('userId').equalTo(userId);

  return dispatch => {
    DistrictAdmin.on('value', districtAdminSnapshot => {
      SchoolAdmin.on('value', schoolAdminSnapshot => {
        var districtAdminKey = districtAdminSnapshot.val() ? Object.keys(districtAdminSnapshot.val())[0] : null;
        var schoolAdminKey = schoolAdminSnapshot.val() ? Object.keys(schoolAdminSnapshot.val())[0] : null;
        var districtAdminInfo;
        var schoolAdminInfo;
        districtAdminSnapshot.val() ? districtAdminInfo = districtAdminSnapshot.val()[Object.keys(districtAdminSnapshot.val())[0]] : districtAdminInfo = null;
        schoolAdminSnapshot.val() ? schoolAdminInfo = schoolAdminSnapshot.val()[Object.keys(schoolAdminSnapshot.val())[0]] : schoolAdminInfo = null;
        
        var loginState = {
          adminInfo: districtAdminInfo, 
          districtId : districtAdminInfo ? districtAdminKey : null,
          isLoggedIn : true, 
          schoolId : schoolAdminInfo ? schoolAdminKey : null,
          teacherInfo : schoolAdminInfo,
          userId : userId,
          userKey : districtAdminKey ? districtAdminKey : schoolAdminKey
        }

        dispatch({
          type: GET_LOGIN_INFO,
          payload: loginState
        })

        dispatch({
          type: CLEAR_EVENTS,
          payload: null
        })
      })
    })
  }
}


//Returns that the user is logged in
export function logoutUser() {
  var loginState = {'isLoggedIn' : false}

  return dispatch => {
    dispatch({
      type: GET_LOGIN_INFO,
      payload: loginState   
    })
    dispatch({
      type: LOGOUT,
      payload: null
    })
  }
}