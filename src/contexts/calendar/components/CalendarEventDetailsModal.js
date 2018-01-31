import { connect } from 'react-redux';
import {Field, reduxForm } from 'redux-form';
import {Image, Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'; 
import BigCalendar from 'react-big-calendar'; 

import TimePickerCustom from '../../utils/TimePickerCustom';

import { deleteCalendarEvent } from '../actions/events_action';

import styles from '../../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'

const  { DOM: { input, select, textarea } } = React;

class CalendarEventDetailsModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'firstExpanded' : true
    }

    this.deleteEvent = this.deleteEvent.bind(this);
  }

  firstSelected () {
    this.state.firstExpanded == true ? this.setState({firstExpanded : false}) : this.setState({firstExpanded : true})
  }

  deleteEvent(){
    this.props.deleteCalendarEvent(this.props.eventDetails.firebaseKey)
    this.props.onHide();  
  }

  render() {

    var startTimeFormatted = moment(this.props.eventDetails.startDate).format('MM/DD/YYYY hh:mm a');
    var endTimeFormatted = moment(this.props.eventDetails.endDate).format('MM/DD/YYYY hh:mm a');
    var isVideoConference;

    if(this.props.eventDetails.isVideoConference){
      isVideoConference = "Yes"
    }else {
      isVideoConference = "No";
    } 
    
    return(
      <Grid>

        <Row>
          <Col xs={8} xsPush={2}>
            <p className="main-dark-blue">Event: {this.props.eventDetails.title}</p> 
          </Col>
        </Row>
        <Row>
          <Col xs={8} xsPush={2}>
            <p className="main-dark-blue">Description: {this.props.eventDetails.description}</p> 
          </Col>
        </Row>
        <Row>
          <Col xs={8} xsPush={2}>
            <p className="main-dark-blue">Is Video Conference: {isVideoConference}</p> 
          </Col>
        </Row>
        <Row>
          <Col xs={8} xsPush={2}>
            <p className="main-dark-blue">Start Time: {startTimeFormatted}</p> 
          </Col>
        </Row>
        <Row>
          <Col xs={8} xsPush={2}>
            <p className="main-dark-blue">End Time: {endTimeFormatted}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={8} xsPush={2}>
            <button onClick={this.deleteEvent} className="btn submit-btn">Delete Event</button>
          </Col>
        </Row>
      </Grid>
    )    
  }
}

export default connect(null, { deleteCalendarEvent })(CalendarEventDetailsModal);
