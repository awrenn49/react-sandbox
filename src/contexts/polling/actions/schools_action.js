import _ from 'underscore';
import async from 'async';
import firebase from '../../utils/firebase';

const storage = firebase.storage();

var webPortal = firebase.database();

export const GET_SCHOOLS_BY_DISTRICT_ID = 'get_schools_by_district_id';

//Gets all schools that an Adminstrator oversees in his or her district
export function getSchoolsByDistrictId(districtId) {
  const Schools = webPortal.ref('School').orderByChild('districtId').equalTo(districtId);
  return dispatch => {
    Schools.on('value', snapshot => {
      dispatch({
        type: GET_SCHOOLS_BY_DISTRICT_ID,
        payload: snapshot.val()
      })
    })
  }
}