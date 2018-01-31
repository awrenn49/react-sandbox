import _ from 'underscore';
import async from 'async';
import firebaseDefault from 'firebase';
import firebase from '../../utils/firebase';

const storage = firebase.storage();
var webPortal = firebase.database();

export const STOP_LOADING_PROFILE_PIC_EDIT = 'stop_loading_profile_pic_edit';
export const RESET_PASSWORD = 'reset_password';

//Create user profile
export function editProfilePic(userInfo, profilePic) {
  var fileURL;
  userInfo.adminInfo ? fileURL = userInfo.adminInfo.pic 
    : userInfo.teacherInfo ? fileURL = userInfo.teacherInfo.pic
    : null;

  // Create a reference to the file to delete
  var deleteRef = firebase.storage().refFromURL(fileURL);
  const profilePics = storage.ref().child('/profilePics/' + userInfo.userId + '.' + profilePic.name.split('.')[1]);

  var loading = {isLoadingNow : false};
  // Delete the file
  return dispatch => {
    deleteRef.delete().then(function(message) {
      profilePics.put(profilePic).then(function(fileSnapshot){
        if(userInfo.adminInfo){
          webPortal.ref("DistrictAdmin/" + userInfo.userKey + "/pic").set(fileSnapshot.metadata.downloadURLs[0]);
          dispatch({
            type: STOP_LOADING_PROFILE_PIC_EDIT,
            payload: loading   
          })
        } else {
          webPortal.ref("SchoolAdmin/" + userInfo.userKey + "/pic").set(fileSnapshot.metadata.downloadURLs[0]);
          dispatch({
            type: STOP_LOADING_PROFILE_PIC_EDIT,
            payload: loading   
          })
        }
      }).catch(function(error) {
        alert(error);
      });
    }).catch(function(error){
      if(error.code == "storage/object-not-found"){
        profilePics.put(profilePic).then(function(fileSnapshot){
          if(userInfo.adminInfo){
            webPortal.ref("DistrictAdmin/" + userInfo.userKey + "/pic").set(fileSnapshot.metadata.downloadURLs[0]);
            dispatch({
              type: STOP_LOADING_PROFILE_PIC_EDIT,
              payload: loading   
            })
          } else {
            webPortal.ref("SchoolAdmin/" + userInfo.userKey + "/pic").set(fileSnapshot.metadata.downloadURLs[0]);
            dispatch({
              type: STOP_LOADING_PROFILE_PIC_EDIT,
              payload: loading   
            })
          }
        }).catch(function(error) {
          alert(error);
        });
      }
    });
  }
}

export function resetPassword(password, newPassword) {

  var user = firebase.auth().currentUser;
  var credentials = firebaseDefault.auth.EmailAuthProvider.credential(user.email, password);

  return dispatch => {
    user.reauthenticateWithCredential(credentials).then(function(){
      user.updatePassword(newPassword).then(function(test) {
        alert("Password updated successfully!");
        dispatch({
          type: RESET_PASSWORD,
          payload: null   
        })
      }).catch(function(error){
        alert(error.message)
        dispatch({
          type: RESET_PASSWORD,
          payload: null   
        })
      })
    }).catch(function(error){
        if(error.code == "auth/wrong-password") {
          alert("The password you entered does not match the current password of your account. Please reenter your password and try again.")
        }
        dispatch({
         type: RESET_PASSWORD,
         payload: null   
        })
    })
  }
}
