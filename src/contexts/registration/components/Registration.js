import { connect } from 'react-redux';
import {Field, reduxForm, reducer as formReducer } from 'redux-form';
import {Image, Grid, Row, Col, FormControl, Button } from 'react-bootstrap';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {withRouter, Link, Route } from 'react-router-dom';
import moment from 'moment'; 
import BigCalendar from 'react-big-calendar'; 
import NotificationSystem  from 'react-notification-system';
import _ from 'underscore';
import RegistrationDropzone from './RegistrationDropzone';


import { createUserProfile , getDistricts  } from '../actions/registration_action';
import { getSchoolsByDistrictId } from '../../polling/actions/schools_action';
import { startLoading, stopLoading } from '../../loading/actions/loading_action';
import { clearReroute } from '../../reroute/actions/reroute_action';

import styles from '../../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'


class Registration extends Component {

  constructor(props) {
    super(props);

    this.state = {
      message : 'Please enter a unique Username and a secure Password.',
      districtChosen : false,
      districtId : '',
      schoolChosen : false,
      schoolId : '',
      errorMessage : 'aaaa',
      registrationTypeChosen : false,
      registrationType : '',
      profilePic : '',
      isFileDropped: false,
      fileDropText: '',
      loading : false,
      showNewPassword1 : false,
      showNewPassword2 : false
    }

    this.renderDistrictSelect = this.renderDistrictSelect.bind(this);
    this.selectDistrict = this.selectDistrict.bind(this);
    this.renderSchoolSelect = this.renderSchoolSelect.bind(this);
    this.selectSchool = this.selectSchool.bind(this);
    this.renderRegistrationInfo = this.renderRegistrationInfo.bind(this);
    this.renderRegistrationTypeSelect = this.renderRegistrationTypeSelect.bind(this);
    this.selectRegistrationType = this.selectRegistrationType.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.showPassword = this.showPassword.bind(this);
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label className="main-dark-blue">{field.label}</label>
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

  componentWillReceiveProps() {
    if(this.props.reroute && this.props.reroute.rerouteToLogin == true) {
      this.props.history.push('/login');
    }
    this.props.clearReroute();
  }

  componentWillMount() {
    this.props.getDistricts();
    this.props.stopLoading();
  }

  renderRegistrationTypeSelect() {

    let registrationTypes = [];
    registrationTypes.push(<option key="" value=""> -- Select Registration Type -- </option>);  
    registrationTypes.push(<option key="districtAdmin" value="districtAdmin"> District Administrator </option>);  
    registrationTypes.push(<option key="schoolAdmin" value="schoolAdmin"> School Administrator </option>);

    return (
      <Row>
        <Col  mdPush={2} md={8}>
          <label className="main-dark-blue">Choose Registration Type</label>
          <FormControl 
            onChange={this.selectRegistrationType} 
            componentClass="select"
            ref={select => { this.registrationTypeSelect = select }}
          >
          { registrationTypes }
          </FormControl>
        </Col>
      </Row> 
    )
  }

  selectRegistrationType() {
    var registrationTypeId = ReactDOM.findDOMNode(this.registrationTypeSelect).value;

    registrationTypeId ? this.setState({registrationTypeChosen : true}) : this.setState({registrationTypeChosen : false}) 
    !registrationTypeId ? this.setState({schoolChosen : false}) : null;
    !registrationTypeId ? this.setState({districtChosen : false}) : null;

    this.setState({registrationType : registrationTypeId});
  }

  renderDistrictSelect() {

    let districts = [];
    districts.push(<option key="" value=""> -- Select District -- </option>);  
    _.each(this.props.registration.districts, function(district, key){
      districts.push(<option key={key} value={key}>{district.name}</option>);   
    })

    return (
      <Row>
        <Col  mdPush={2} md={8}>
          <label className="main-dark-blue">Choose Your District</label>
          <FormControl 
            onChange={this.selectDistrict} 
            componentClass="select"
            ref={select => { this.districtSelect = select }}
          >
          { districts }
          </FormControl>
        </Col>
      </Row> 
    )
  }

  selectDistrict() {
    var districtId = ReactDOM.findDOMNode(this.districtSelect).value;
    districtId ? this.setState({districtChosen : true}) : this.setState({districtChosen : false}) 
    !districtId ? this.setState({schoolChosen : false}) : null;

    this.setState({districtId : districtId});
    this.props.getSchoolsByDistrictId(districtId)
  }

  renderSchoolSelect() {
    let schools = []
    schools.push(<option key="" value=""> -- Select School -- </option>);  
    _.each(this.props.schools, function(school, key){
      schools.push(<option key={key} value={key}>{school.name}</option>);   
    })

  
    return (
      <Row>
        <Col  mdPush={2} md={8}>
          <label className="main-dark-blue">School</label>
          <FormControl 
            onChange={this.selectSchool} 
            componentClass="select"
            ref={select => { this.schoolSelect = select }}
          >
          { schools }
          </FormControl>
        </Col>
      </Row> 
    )
  }

  selectSchool() {
    var schoolId = ReactDOM.findDOMNode(this.schoolSelect).value;
    schoolId ? this.setState({schoolChosen : true}) : this.setState({schoolChosen : false}) 
    this.setState({schoolChosen : true})
    this.setState({schoolId : schoolId});
  }

  showPassword(e, passwordNumber) {
    if(passwordNumber == 'one') {
      this.state.showNewPassword1 = !this.state.showNewPassword1;
      this.forceUpdate();
    } else if(passwordNumber == 'two') {
      this.state.showNewPassword2 = !this.state.showNewPassword2;
      this.forceUpdate();
    }
  }

  renderRegistrationInfo() {
    var self = this;

    //Show / Hide new password 1
    var newPassword1Show;
    this.state.showNewPassword1 == true ? newPassword1Show = this.renderField : newPassword1Show = this.renderPasswordField;
    var newPassword1EyeShow;
    this.state.showNewPassword1 == false ? newPassword1EyeShow = <i onClick={e => this.showPassword(e, 'one')} className="fa fa-eye-slash pword-hide"/> 
      : newPassword1EyeShow = <i onClick={e => this.showPassword(e, 'one')} className="fa fa-eye pword-show"/>;

    //Show / Hide new password 2
    var newPassword2Show;
    this.state.showNewPassword2 == true ? newPassword2Show = this.renderField : newPassword2Show = this.renderPasswordField;
    var newPassword2EyeShow;
    this.state.showNewPassword2 == false ? newPassword2EyeShow = <i onClick={e => this.showPassword(e, 'two')} className="fa fa-eye-slash pword-hide"/> 
      : newPassword2EyeShow = <i onClick={e => this.showPassword(e, 'two')} className="fa fa-eye pword-show"/>;


    return (
      <div>
        <Row>
          <Col mdPush={2} md={8}>
            <Field
              label="First Name"
              name="firstName"
              component={this.renderField}
            />
          </Col>
        </Row>        
        <Row>
          <Col mdPush={2} md={8}>
            <Field
              label="Last Name"
              name="lastName"
              component={this.renderField}
            />
          </Col>
        </Row>
        <Row>
          <Col mdPush={2} md={8}>
            <Field
              label="Email"
              name="username"
              component={this.renderField}
            />
          </Col>
        </Row>
        <Row>
          <Col mdPush={2} md={8}>
            <Field
              label="Password"
              name="password"
              component={newPassword1Show}
            />
            { newPassword1EyeShow }
          </Col>
        </Row>
        <Row>
          <Col mdPush={2} md={8}>
            <Field
              label="Confirm Password"
              name="confirmPassword"
              component={newPassword2Show}
            />
            { newPassword2EyeShow }
          </Col>
        </Row>
        <Row>
          <Col mdPush={2} md={8}>
            <Field
              label="Secret Key"
              name="secretKey"
              component={this.renderField}
            />
          </Col>
        </Row>
        <Row>
          <Col mdPush={2} md={8}>
            <RegistrationDropzone 
              onFileDrop={this.uploadProfilePic.bind(this)}
              fileDropText={this.state.fileDropText}
              isFileDropped={this.state.isFileDropped}
            />
          </Col>
        </Row>
        <Row>
          <Col mdPush={2} md={8}>
            <button type="submit" className="btn submit-btn">Submit</button>
            <Link to={`/login`}><Button className="btn cancel-btn">Cancel</Button></Link>
          </Col>
        </Row>
      </div>
    )
  }

  uploadProfilePic(file) {
    this.setState({
      fileDropText: file.name,
      isFileDropped: true,
      profilePic: file
    })
  }

  onSubmit(values){
    if(!this.state.isFileDropped){
      this.setState({fileDropText : 'Please upload a Profile Picture!'});
    } else {
      if(values.password == values.confirmPassword){
        this.props.startLoading();
        this.props.createUserProfile(values, this.state.districtId, this.state.schoolId, this.state.registrationType, this.state.profilePic)        
      } else {
        alert("Both passwords do not match! Please re-enter the passwords and try again.")
      }
    }
  }

  startLoading() {
    this.setState({loading: true});
  }

  stopLoading() {
    this.setState({loading: false});
  }

  render(){
    const { handleSubmit } = this.props;
    var loadingScreen = <div/>;
    this.props.isLoading.isLoadingNow == true ? loadingScreen = <div className="loader"></div> : null

    //Render select box to choose district
    var chooseDistrict = <div/>;
    this.state.registrationTypeChosen == true ? chooseDistrict = this.renderDistrictSelect() : chooseDistrict = <div/>;

    //Render select box to choose school if Adminstrator chooses to do so
    var chooseSchool = <div/>;
    this.state.districtChosen == true && this.state.registrationType == "districtAdmin" ? chooseSchool = this.renderRegistrationInfo()
      : this.state.districtChosen == true && this.state.registrationType == "schoolAdmin" ? chooseSchool = this.renderSchoolSelect() 
      : chooseSchool = <div/>;

    //Render registration inputs 
    var registrationInfo = <div/>;
    this.state.schoolChosen == true ? registrationInfo = this.renderRegistrationInfo() : registrationInfo = <div/>;

    var cancelButton = <div/>;

    this.state.schoolChosen == true || this.state.districtChosen  == true  ? cancelButton = <div/>
      : cancelButton =  <Col sm={8} md={8} smPush={2} mdPush={2}>
                          <Link to={`/login`}><Button className="btn cancel-btn margin-top-5">Cancel</Button></Link> 
                        </Col>
    return(
      <Col sm={8} md={8} smPush={2} mdPush={2}>
        <Row>
          <Col sm={8} smPush={2} md={4} mdPush={4}>
            <Image src="../../../img/ptLogoBlue.png" className="pt-logo-login margin-top-20" />
          </Col>
        </Row>
        <form onSubmit={ handleSubmit(this.onSubmit.bind(this))}>
          { loadingScreen }
          { this.renderRegistrationTypeSelect() }
          { chooseDistrict }
          { chooseSchool }
          { registrationInfo }
          { this.props.registration.errorMessage }
          { cancelButton }
        </form>
      </Col>
    )    
  }
}


function validate(values) {
  const errors = {};

  if(!values.firstName) {
    errors.firstName = "Please enter a first name.";
  }  

  if(!values.lastName) {
    errors.lastName = "Please enter a last name.";
  }

  if(!values.username) {
    errors.username = "Please enter an email.";
  }

  if(!values.password) {
    errors.password = "Please enter a password.";
  }

  if(!values.confirmPassword) {
    errors.confirmPassword = "Please enter a confirmation password that matches the original.";
  }

  if(!values.secretKey) {
    errors.secretKey = "Please enter a secret key.";
  }

  return errors;
}


function mapStateToProps(state){
  var self = this;
  return { 
    registration: state.registration,
    schools: state.schools,
    isLoading: state.loading,
    reroute: state.reroute
  }
}

export default reduxForm({
  form: 'RegistrationForm',
  validate
})(
    connect(mapStateToProps, { startLoading, stopLoading, createUserProfile , getDistricts , getSchoolsByDistrictId, clearReroute })(withRouter(Registration))
);

