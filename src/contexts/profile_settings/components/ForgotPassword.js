import {Image, Grid, Row, Col, Button} from 'react-bootstrap';
import {Field, reduxForm } from 'redux-form';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';
import firebase from '../../utils/firebase';

class ForgotPassword extends Component {

  constructor(props) {
    super(props);

  }

  renderInputField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label>{field.label}</label>
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


  onSubmit(values) {
    var actionCodeSettings = {
      url: 'http://localhost:8080/login',
    };
    firebase.auth().sendPasswordResetEmail(values.email, actionCodeSettings).then(function(data){
      alert('Password reset request sent! Please check your email for instructions on resetting your password.')
    }).catch(function(error){
      alert(error);
    })
  }

  render(){
    const { handleSubmit } = this.props;

    return(
      <Grid>
        <Col xs={8} xsPush={2}>
          <Row>
            <Col xs={4} xsPush={4}>
              <Image src="../../../img/ptLogoBlue.png" className="pt-logo-login margin-top-20" />
            </Col>
          </Row>
          <Row>
            <Col xs={8} xsPush={2}>
              <form onSubmit={ handleSubmit(this.onSubmit.bind(this))}>
                <Row>
                  <Col xs={8} xsPush={2}>
                    <Field
                      label="Email"
                      name="email"
                      component={this.renderInputField}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={8} xsPush={2}>
                    <Button type="submit" className="btn submit-btn">Submit</Button>
                    <Link to={`/login`}><Button className="btn cancel-btn">Cancel</Button></Link> 
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
        </Col>
      </Grid>
    )   
  }
}

function validate(values) {
  const errors = {};

  if(!values.email) {
    errors.email = "Please enter an email.";
  }

  return errors;
}

export default reduxForm({
  form: 'forgotPasswordForm',
  validate
})(
    connect(null, { })(ForgotPassword)
);


