import {Image, Grid, Row, Col, Modal, Button, FormControl} from 'react-bootstrap';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import moment from 'moment'; 
import BigCalendar from 'react-big-calendar'; 
import { connect } from 'react-redux';
import _ from 'underscore';

import styles from '../../../../style/react_calendar.css';

import { getCalendarEventsBySchoolId , deleteCalendarEvent, getCalendarEventsByDistrictId } from '../actions/events_action';
import { getSchoolsByDistrictId } from '../../polling/actions/schools_action';

import CalendarDayEventModal from './CalendarDayEventModal';
import CalendarEventModal from './CalendarEventModal';
import CalendarEventDetailsModal from './CalendarEventDetailsModal';

//Modal Style
const customStyles = {
  content : {
    width : '700px',
    height : '700px',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showCreateModal: false,
      showDayCreateModal: false,
      showDescriptionModal: false,
      eventInfo: '',
      eventDetails: '',
      schoolId:  Object.keys(this.props.schools)[0] ? Object.keys(this.props.schools)[0] : ''
    }
    
    this.openCalendarEventModal = this.openCalendarEventModal.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.selectSchool = this.selectSchool.bind(this);
    this.renderSchoolSelect = this.renderSchoolSelect.bind(this);
  }

  componentWillMount() {
    this.props.loginState.teacherInfo ? this.props.getCalendarEventsBySchoolId(this.props.loginState.teacherInfo.schoolId) 
      : null;
    this.props.loginState.adminInfo ? this.props.getSchoolsByDistrictId(this.props.loginState.adminInfo.districtId) : null;
    this.props.loginState.adminInfo ? this.props.getCalendarEventsByDistrictId(this.props.loginState.adminInfo.districtId) : null; 
  }

  open() {
    this.setState({ showCreateModal: true });
  }

  close() {
    this.setState({ showCreateModal: false });
    this.setState({ showDayCreateModal: false });
    this.setState({ showDescriptionModal: false });
    this.props.loginState.adminInfo ? this.props.getCalendarEventsBySchoolId(this.state.schoolId) 
      : this.props.getCalendarEventsBySchoolId(this.props.loginState.teacherInfo.schoolId);
  }

  //Opens modal for Event Creation
  openCalendarEventModal(eventInfo){
    if(eventInfo.start == eventInfo.end){
      this.setState({"eventInfo": eventInfo});
      this.setState({showCreateModal: true});
    } else {
      this.setState({"eventInfo": eventInfo});
      this.setState({showDayCreateModal: true});
    }
  }

  //Opens modal to view and delete an event
  openDetailsModal(eventDetails){
    this.setState({"eventDetails": eventDetails});
    this.setState({showDescriptionModal: true});
  }

  renderSchoolSelect(){
    
    let schools = [];
      schools.push(<option key={'myDistrict'} value={'myDistrict'}>My District</option>);  
    _.each(this.props.schools, function(school, key){
      schools.push(<option key={key} value={key}>{school.name}</option>);  
    })

    return(
      <Row>
        <Col  xsPush={2} xs={8} sm={6} md={4}>
          <label className="main-dark-blue bold">Choose School</label>
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

  selectSchool(){
    var schoolId = ReactDOM.findDOMNode(this.schoolSelect).value;
    this.setState({schoolId : schoolId})

    if(schoolId == 'myDistrict') {
      this.props.getCalendarEventsByDistrictId(this.props.loginState.districtId)
    } else  {
      this.props.getCalendarEventsBySchoolId(schoolId);
    }
  }

  render(){
    var chooseSchool;
    this.props.loginState.adminInfo ? chooseSchool = this.renderSchoolSelect() : chooseSchool = null;

    //Add events to array of calendar events
    var events = [];
    _.each(this.props.calendarEvents, function(event, key){
      var sDate = new Date(0); 
      var eDate = new Date(0); 
      sDate.setUTCSeconds(event.startDate);
      eDate.setUTCSeconds(event.endDate);
      events.push(
        {
          firebaseKey: key,
          title: event.name,
          description: event.description,
          startDate: sDate,
          endDate: eDate,
          isVideoConference: event.isVideoConference
        }
      )
    })

    return(
      <Grid >
        <Row>
          <h3 className="title_left main-dark-blue">Calendar</h3>
        </Row>  
        { chooseSchool }
        <Row>
          <div className="big-calendar">
            <BigCalendar
              events={events}
              startAccessor='startDate'
              endAccessor='endDate'
              selectable={true}
              onSelectSlot={(eventInfo) => this.openCalendarEventModal(eventInfo)}
              onSelectEvent ={(event) => this.openDetailsModal(event)}
              views={['month','week', 'day']}
            />
            <Modal show={this.state.showCreateModal} onHide={this.close}>
              <Modal.Header>
                <Modal.Title className="main-dark-blue" >Create New Calendar Event</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CalendarEventModal onHide={this.close} eventInfo={this.state.eventInfo} adminSchoolSelection={this.state.schoolId}/>
              </Modal.Body>
              <Modal.Footer>
                <Button className="cancel-btn" onClick={this.close}>Cancel</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.showDayCreateModal} onHide={this.close}>
              <Modal.Header>
                <Modal.Title className="main-dark-blue" >Create Day Event</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CalendarDayEventModal onHide={this.close} eventInfo={this.state.eventInfo} adminSchoolSelection={this.state.schoolId}/>
              </Modal.Body>
              <Modal.Footer>
                <Button className="cancel-btn" onClick={this.close}>Close</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.showDescriptionModal} onHide={this.close}>
              <Modal.Header>
                <Modal.Title className="main-dark-blue" >View Event Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CalendarEventDetailsModal onHide={this.close} eventDetails={this.state.eventDetails}/>
              </Modal.Body>
              <Modal.Footer>
                <Button className="cancel-btn" onClick={this.close}>Cancel</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Row>
    </Grid>
    )    
  }

}

function mapStateToProps(state){
  var self = this;
  return { 
    calendarEvents: state.calendarEvents, 
    loginState: state.loginState,
    schools: state.schools
  }
}

export default connect(mapStateToProps, { getCalendarEventsBySchoolId, deleteCalendarEvent, getSchoolsByDistrictId, getCalendarEventsByDistrictId })(Calendar);

