import {Image, Grid, Row, Col, Button } from 'react-bootstrap';
import React, { Component } from 'react';
import {Field, reduxForm } from 'redux-form';

import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import ManageDropzone from './ManageDropzone';

import { editProfilePic, resetPassword} from '../actions/manage_action';
import { startLoading } from '../../loading/actions/loading_action';

class Manage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fileDropText : '',
      isFileDropped : '',
      profilePic : '',
      showCurrentPassword : false,
      showNewPassword1 : false, 
      showNewPassword2 : false,
      disabled : 'disabled'
    }

    this.submitNewProfilePic = this.submitNewProfilePic.bind(this);
  }

  renderInputField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label className="main-blue">{field.label}</label>
        <input
          className="form-control"
          type="text"
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  uploadProfilePic(file) {
    this.setState({
      fileDropText: file.name,
      isFileDropped: true,
      profilePic: file
    })
  }

  renderPasswordField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label className="main-dark-blue">{field.label}</label>
        <input
          className="form-control"
          type="password"
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  submitNewProfilePic(){
    this.props.startLoading();
    this.props.editProfilePic(this.props.loginState, this.state.profilePic)
  }

  showPassword(e, passwordNumber) {
    if(passwordNumber == 'current') {
      this.state.showCurrentPassword = !this.state.showCurrentPassword;
      this.forceUpdate();
    } else if(passwordNumber == 'one') {
      this.state.showNewPassword1 = !this.state.showNewPassword1;
      this.forceUpdate();
    } else if(passwordNumber == 'two') {
      this.state.showNewPassword2 = !this.state.showNewPassword2;
      this.forceUpdate();
    }
  }

  onSubmit(values) {
    if(values.newPassword === values.confirmNewPassword && values.currentPassword !== values.newPassword) {
      this.props.resetPassword(values.currentPassword, values.newPassword);
    } else if(values.currentPassword === values.newPassword){
      alert("The new password must be different than your current password! Please enter a different password and try again.")
    } else {
      alert("Both new passwords do not match! Please re-enter the passwords and try again.")
    }
  }

  render(){
    const { handleSubmit } = this.props;

    var loadingScreen = <div/>;
    this.props.isLoading.isLoadingNow == true ? loadingScreen = <div className="loader"></div> : null;

    //Make button disabled if a new profile picture has not been attached
    var profilePicSubmitBtn;
    this.state.isFileDropped == true && this.props.loginState.adminInfo ? profilePicSubmitBtn = <Button onClick={this.submitNewProfilePic} className="submit-btn" >Add District Logo</Button>
      : this.state.isFileDropped == true && this.props.loginState.teacherInfo ? profilePicSubmitBtn = <Button onClick={this.submitNewProfilePic} className="submit-btn" >Add School Logo</Button>
      : this.state.isFileDropped == false && this.props.loginState.adminInfo ? profilePicSubmitBtn = <Button onClick={this.submitNewProfilePic} className="submit-btn" disabled >Add District Logo</Button>
      : profilePicSubmitBtn = <Button onClick={this.submitNewProfilePic} className="submit-btn" disabled >Add School Logo</Button>
    //Show / Hide current password
    var currentPasswordShow;
    this.state.showCurrentPassword == true ? currentPasswordShow = this.renderInputField : currentPasswordShow = this.renderPasswordField;
    var currentPasswordEyeShow;
    this.state.showCurrentPassword == false ? currentPasswordEyeShow = <i onClick={e => this.showPassword(e, 'current')} className="fa fa-eye-slash pword-hide"/> 
      : currentPasswordEyeShow = <i onClick={e => this.showPassword(e, 'current')} className="fa fa-eye pword-show"/>;

    //Show / Hide new password 1
    var newPassword1Show;
    this.state.showNewPassword1 == true ? newPassword1Show = this.renderInputField : newPassword1Show = this.renderPasswordField;
    var newPassword1EyeShow;
    this.state.showNewPassword1 == false ? newPassword1EyeShow = <i onClick={e => this.showPassword(e, 'one')} className="fa fa-eye-slash pword-hide"/> 
      : newPassword1EyeShow = <i onClick={e => this.showPassword(e, 'one')} className="fa fa-eye pword-show"/>;

    //Show / Hide new password 2
    var newPassword2Show;
    this.state.showNewPassword2 == true ? newPassword2Show = this.renderInputField : newPassword2Show = this.renderPasswordField;
    var newPassword2EyeShow;
    this.state.showNewPassword2 == false ? newPassword2EyeShow = <i onClick={e => this.showPassword(e, 'two')} className="fa fa-eye-slash pword-hide"/> 
      : newPassword2EyeShow = <i onClick={e => this.showPassword(e, 'two')} className="fa fa-eye pword-show"/>;

    var editProfPicTitle;
    this.props.loginState.adminInfo ? editProfPicTitle = 'Change District Logo' : editProfPicTitle = 'Change School Logo';
    return(
      <Grid>
        {loadingScreen}
        <Row>
          <h3 className="title_left main-dark-blue">Manage</h3>
        </Row>
        <Row className="manage-header">
          <h4 className="title_left main-dark-blue">{editProfPicTitle}</h4>
        </Row>
        <Row>
          <Col xs={12} sm={12} mdPush={2} md={8}>
            <ManageDropzone 
              onFileDrop={this.uploadProfilePic.bind(this)}
              fileDropText={this.state.fileDropText}
              isFileDropped={this.state.isFileDropped}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} mdPush={2} md={8}>
            { profilePicSubmitBtn }
          </Col>
        </Row>
        <Row> 
          <h4 className="password-header">Change Password</h4>
        </Row>
        <Row>
          <Col xs={12} mdPush={2} md={8}>
            <form className="margin-top-0" onSubmit={ handleSubmit(this.onSubmit.bind(this))}>
              <Row>
                <Col>
                  <Field
                    label="Current Password"
                    name="currentPassword"
                    component={currentPasswordShow}
                  />
                  { currentPasswordEyeShow }
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    label="New Password"
                    name="newPassword"
                    component={newPassword1Show}
                  />
                  { newPassword1EyeShow }
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    component={newPassword2Show}
                  />
                  { newPassword2EyeShow }
                </Col>
              </Row>
              <Row>
                <Col>
                  <button type="submit" className="btn submit-btn margin-top-5">Change Password</button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Grid>
    )   
  }
}

function validate(values) {
  const errors = {};

  if(!values.currentPassword) {
    errors.currentPassword = "Please enter your current password.";
  }

  if(!values.newPassword) {
    errors.newPassword = "Please enter a new password.";
  }

  if(!values.confirmNewPassword) {
    errors.confirmNewPassword = "Please confirm your new password."
  }

  return errors;
}

function mapStateToProps(state){
  return {
    loginState : state.loginState,
    isLoading : state.loading
  }
}

export default reduxForm({
  form: 'changePasswordForm',
  validate
})(
    connect(mapStateToProps, { startLoading, editProfilePic, resetPassword })(Manage)
);

