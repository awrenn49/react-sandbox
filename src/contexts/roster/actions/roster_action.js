import _ from 'underscore';
import async from 'async';
import firebase from '../../utils/firebase';

const storage = firebase.storage();

var webPortal = firebase.database();

export const ADD_ROSTER = 'add_roster';
export const GET_TEACHERS_BY_DISTRICT_ID = 'get_teachers_by_district_id';
export const GET_TEACHERS_BY_SCHOOL_ID = 'get_teachers_by_school_id';
export const GET_PARENTS_BY_SCHOOL_ID = 'get_parents_by_school_id';


//Gives user the ability to create an event with a corresponding image, date, and details
export function addRoster(teachers, schoolId, districtId, uploadType) {
  var UploadRef;
  uploadType == "parents" ? UploadRef = webPortal.ref('Parent') : UploadRef = webPortal.ref('Teacher');

  return dispatch => {
    async.each(teachers, function(teacher, callback) {
      UploadRef.push().set({
        district: teacher.district ? teacher.district : null,
        districtId : districtId ? districtId : null,
        email: teacher.email ? teacher.email : null,
        firstName: teacher.first_name ? teacher.first_name : null,
        grade: teacher.grade ? teacher.grade : null,
        lastName: teacher.last_name ? teacher.last_name : null,
        profilePhoto: teacher.profile_photo ? teacher.profile_photo : null,
        school: teacher.school ? teacher.school : null,
        schoolId : schoolId ? schoolId : null
      })
      callback(null, teacher)
    }, function (err, results) {
        dispatch({
          type: ADD_ROSTER,
          payload: null
        })
    });
  }
}

export function getParentsBySchoolId(schoolId) {
  const Parents = webPortal.ref('Parent').orderByChild('schoolId').equalTo(schoolId);
  return dispatch => {
    Parents.on('value', snapshot => {
      dispatch({
        type: GET_PARENTS_BY_SCHOOL_ID,
        payload: snapshot.val()
      })
    })
  }
}

export function getParentsByDistrictId(districtId) {
  const Parents = webPortal.ref('Parent').orderByChild('districtId').equalTo(districtId);
  return dispatch => {
    Parents.on('value', snapshot => {
      dispatch({
        type: GET_PARENTS_BY_SCHOOL_ID,
        payload: snapshot.val()
      })
    })
  }
}



export function getTeachersBySchoolId(schoolId) {
  const Teachers = webPortal.ref('Teacher').orderByChild('schoolId').equalTo(schoolId);
  return dispatch => {
    Teachers.on('value', snapshot => {
      dispatch({
        type: GET_TEACHERS_BY_SCHOOL_ID,
        payload: snapshot.val()
      })
    })
  }
}

export function getTeachersByDistrictId(districtId) {
  const Teachers = webPortal.ref('Teacher').orderByChild('districtId').equalTo(districtId);
  return dispatch => {
    Teachers.on('value', snapshot => {
      dispatch({
        type: GET_TEACHERS_BY_SCHOOL_ID,
        payload: snapshot.val()
      })
    })
  }
}

