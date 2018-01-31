import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Image, Grid, Row, Col, Button } from 'react-bootstrap';
import React, { Component } from 'react';
import { withRouter , Link } from 'react-router-dom';
import moment from 'moment'; 
import BigCalendar from 'react-big-calendar'; 
import firebase from '../../utils/firebase';

import { getLoginInfo } from '../actions/login_action';

import styles from '../../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPassword : false
    }

    this.showPassword = this.showPassword.bind(this);
  }

  renderInputField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label>{field.label}</label>
        <input
          className="form-control black rounded"
          type="text"
          placeholder={"Email"}
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
        <label>{field.label}</label>
        <input
          className="form-control steel-grey black rounded"
          type="password"
          placeholder={"Password"}
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }


  onSubmit(values){
    var self = this;
    var errorMessage;
    firebase.auth().signInWithEmailAndPassword(values.email, values.password).then(function(user){
      self.props.getLoginInfo(user.email);
      self.props.history.push(`/analytics`);
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    }); 
  }

  showPassword() {
    this.state.showPassword = !this.state.showPassword;
    this.forceUpdate();
  }

  render() {
    const { handleSubmit } = this.props;


    //Show / Hide new password 1
    var passwordShow;
    this.state.showPassword == true ? passwordShow = this.renderInputField : passwordShow = this.renderPasswordField;
    var passwordEyeShow;
    this.state.showPassword == false ? passwordEyeShow = <i onClick={e => this.showPassword()} className="fa fa-eye-slash pword-hide"/> 
      : passwordEyeShow = <i onClick={e => this.showPassword()} className="fa fa-eye pword-show"/>;

    return(
      <Grid>
        <Row>
          <Col sm={8} smPush={2} xs={8} xsPush={2}>
            <Row>
              <Col xs={12} sm={8} smPush={2} md={4} mdPush={4}>
                <Image src="../../../img/ptLogoBlue.png" className="pt-logo-login margin-top-20" />
              </Col>
            </Row>
            <form onSubmit={ handleSubmit(this.onSubmit.bind(this))}>
              <Row>
                <Col xs={12} sm={8} smPush={2}>
                  <Field
                    label="Email"
                    name="email"
                    component={this.renderInputField}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={8} smPush={2}>
                  <Field
                    label="Password"
                    name="password"
                    component={ passwordShow }
                  />
                  { passwordEyeShow }
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={8} smPush={2}>
                  <Button type="submit" className="btn submit-btn margin-top-5">Login</Button>
                  <Link to={`/registration`}><Button className="btn submit-btn margin-top-5">Register</Button></Link>
                  <Link to={`/forgot_password`}><p>Forgot Password</p></Link>
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

  if(!values.email) {
    errors.email = "Please enter an email";
  }

  if(!values.password) {
    errors.password = "Please enter a password";
  }

  return errors;
}

export default reduxForm({
  form: 'loginForm',
  validate
})(
    connect(null, { getLoginInfo })(withRouter(Login))
);
