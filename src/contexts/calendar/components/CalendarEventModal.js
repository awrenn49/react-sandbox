import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Image, Grid, Row, Col, FormControl} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'; 
import BigCalendar from 'react-big-calendar'; 

import TimePicker from 'rc-time-picker';
import TimePickerCustom from '../../utils/TimePickerCustom';

import { createEvent } from '../actions/events_action';

import styles from '../../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'

const  { DOM: { input, select, textarea } } = React;



class CalendarEventModal extends Component {


  constructor(props) {
    super(props);

    this.state = {
      'firstExpanded' : true,
      'isVideoConference' : false,
      'hasVideoConferenceChanged' : false,
      'startDate' : props.eventInfo.start
    }

    this.selectVideoConference = this.selectVideoConference.bind(this);
    this.fireStartChange = this.fireStartChange.bind(this);
    this.fireEndChange = this.fireEndChange.bind(this);
  }

  renderInputField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label className="main-dark-blue" >{field.label}</label>
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

  renderTimePickerCustom(field) {
    return (
      <div className = { className }>
        <label className="main-dark-blue" >{field.label}</label>
        <TimePickerCustom />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  renderTextAreaField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label className="main-dark-blue" >{field.label}</label>
        <textarea
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

  selectVideoConference() {
    var isVideoConference = ReactDOM.findDOMNode(this.select).value;
    this.setState({isVideoConference : isVideoConference})
    ReactDOM.findDOMNode(this.select).value == 'empty' ? this.setState({hasVideoConferenceChanged : false}) : this.setState({hasVideoConferenceChanged : true})
    ReactDOM.findDOMNode(this.select).value == 'true' ? this.setState({isVideoConference : true}) : this.setState({isVideoConference : false})
  }

  fireStartChange (value) {
    this.setState({startDate : value})
  }

  fireEndChange (value) {
    this.setState({endDate : value})
  }

  onSubmit(values){
    const format = 'h:mm a';
    var districtId;
    this.props.loginState.districtId ? districtId = this.props.loginState.districtId : this.props.loginState.teacherInfo ? districtId = this.props.loginState.teacherInfo.districtId : districtId = null;
    var schoolId;
    this.props.loginState.teacherInfo ? schoolId = this.props.loginState.teacherInfo.schoolId 
      : this.props.loginState.adminInfo ? schoolId = this.props.adminSchoolSelection
      : schoolId = null;
    values.startDate = moment(this.state.startDate).format();
    values.endDate = moment(this.state.endDate).format();
    values.isVideoConference = this.state.isVideoConference;
    this.props.createEvent(values, this.props.loginState.userId, districtId, schoolId);
    this.props.onHide();
  }

  render() {
    const { handleSubmit } = this.props;
    const { createEvent } = this.props;
    const format = 'h:mm a';
    return(
      <Grid>
        <Row>
          <Col xs={10}>
            <form onSubmit={ handleSubmit(this.onSubmit.bind(this))}>
              <Row>
                <Col xs={8} xsPush={2}>
                  <Field
                    label="Event Name"
                    name="eventName"
                    component={this.renderInputField}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8} xsPush={2}>
                  <Field
                    label="Description"
                    name="description"
                    component={this.renderTextAreaField}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8} xsPush={2}>
                  <div className="form-group">
                    <label>Start Time</label>
                    <TimePicker
                      showSecond={false}
                      defaultValue={moment(this.state.startDate)}
                      className="xxx"
                      onChange={this.fireStartChange}
                      format={format}
                      use12Hours
                      />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={8} xsPush={2}>
                  <div className="form-group">
                    <label>Start Time</label>
                    <TimePicker
                      showSecond={false}
                      defaultValue={moment(this.state.startDate)}
                      className="xxx"
                      onChange={this.fireEndChange}
                      format={format}
                      use12Hours
                      />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col  xsPush={2} xs={8}>
                  <label>Is this event a video conference?</label>
                  <FormControl 
                    onChange={this.selectVideoConference} 
                    componentClass="select"
                    ref={select => { this.select = select }}
                  >
                    <option value="empty"> -- Make Selection -- </option>
                    <option value="false">Yes</option>
                    <option value="true">No</option>
                  </FormControl>
                </Col>
              </Row> 
              <Row>
                <Col xs={8} xsPush={2}>
                  <button type="submit" className="btn submit-btn">Submit</button>
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

  if(!values.eventName) {
    errors.eventName = "Please enter an event name!";
  }

  return errors;
}

function mapStateToProps(state){
  var self = this;
  return {  loginState: state.loginState }
}

export default reduxForm({
  form: 'calendarEventForm',
  validate
})(
    connect(mapStateToProps, { createEvent })(CalendarEventModal)
);
