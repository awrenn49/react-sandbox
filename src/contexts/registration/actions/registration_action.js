import _ from 'underscore';
import async from 'async';
import firebase from '../../utils/firebase';

const storage = firebase.storage();
var webPortal = firebase.database();

export const CREATE_USER_PROFILE = 'create_user_profile';
export const GET_DISTRICTS = 'get_districts';
export const STOP_LOADING_REGISTRATION = 'stop_loading_registration';

//Create user profile
export function createUserProfile(values, districtId, schoolId, registrationType, profilePic) {

  //Set up SecretKey firebase node 
  var SecretKey;
  registrationType == 'districtAdmin' ? SecretKey = webPortal.ref('District').orderByChild('loginCode').equalTo(values.secretKey) 
    : SecretKey = webPortal.ref('School').orderByChild('loginCode').equalTo(values.secretKey);

  var loading = {isLoadingNow : false, rerouteToLogin : true};
  return dispatch => {
    SecretKey.on('value', secretKeySnapshot => {
      var secretKeyId;
      var errorMessage;
      var keyMatches = false;
      //Get secret key from snapshot
      secretKeySnapshot.val() ? secretKeyId = Object.keys(secretKeySnapshot.val())[0] : secretKeyId = null;
      //Get boolean value that secret key exists and matches the district or school id
      registrationType == 'districtAdmin' ? keyMatches = secretKeyId && secretKeyId == districtId 
        : keyMatches = secretKeyId && secretKeyId == schoolId;
      //If key does match then attempt to create user, show error message or, if successful, alert user that the registration was successful
      if(keyMatches){
        const profilePics = storage.ref().child('/profilePics/' + values.username + '.' + profilePic.name.split('.')[1]);
        firebase.auth().createUserWithEmailAndPassword(values.username, values.password).then(function(response){
            profilePics.put(profilePic).then(function(fileSnapshot){
              // this.stopLoading();
              if(registrationType == 'districtAdmin'){
                const DistrictAdmin = webPortal.ref('DistrictAdmin').push().set({
                  districtId: districtId,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  pic: fileSnapshot.metadata.downloadURLs[0],
                  userId: response.email
                })
                dispatch({
                  type: STOP_LOADING_REGISTRATION,
                  payload: loading   
                })
              } else {
                const SchoolAdmin = webPortal.ref('SchoolAdmin').push().set({
                  districtId: districtId,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  pic: fileSnapshot.metadata.downloadURLs[0],
                  schoolId: schoolId,
                  userId: response.email
                })
                dispatch({
                  type: STOP_LOADING_REGISTRATION,
                  payload: loading   
                })
              }
            })
            alert(`Success! The profile for ${values.firstName} ${values.lastName} (${response.email}) has been created!`);
          }).catch(function(error) {
            var errorCode = error.code;
            errorMessage = error.message;
            alert(errorMessage);
            dispatch({
              type: STOP_LOADING_REGISTRATION,
              payload: loading   
            })
          });
      } else {
        dispatch({
          type: STOP_LOADING_REGISTRATION,
          payload: loading   
        })
        alert("Invalid Key!");
      }
    })
  }
}

//Gets all polls that were created by the user
export function getDistricts() {
  const District = webPortal.ref('District');
  return dispatch => {
    District.on('value', snapshot => {
      dispatch({
        type: GET_DISTRICTS,
        payload: snapshot.val()
      })
    })
  }
}

