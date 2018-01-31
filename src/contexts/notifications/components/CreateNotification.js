import { connect } from 'react-redux';
import {Field, reduxForm, reducer as formReducer } from 'redux-form';
import {Image, Grid, Row, Col, FormGroup, FormControl, Button, Modal} from 'react-bootstrap';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import moment from 'moment'; 
import _ from 'underscore';
import DateTime from 'react-datetime';

import { renderMultiSelect } from './FormMultiselect';

import 'input-moment/dist/input-moment.css';
import InputMoment from 'input-moment';

import styles from '../../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'

import { createTeacherNotification, createDistrictNotification } from '../actions/notification_action';
import { getSchoolsByDistrictId } from '../../polling/actions/schools_action';
import { getTeachersBySchoolId , getTeachersByDistrictId, getParentsBySchoolId } from '../../roster/actions/roster_action';
import { clearReroute } from '../../reroute/actions/reroute_action';

import 'react-widgets/dist/css/react-widgets.css';
import MultiSelect from 'react-widgets/lib/MultiSelect';

class CreateNotification extends Component {

  constructor(props) {
    super(props);

    this.state = {
      chosenDate : 'none',
      m : moment(),
      hasDateTimeChanged : false,
      showNoDateChangeModal : false,
      showConfirmNotificationModal : false,
      notificationDateTime : 'none',
      notificationBody : '',
      notificationTitle : '',
      pic : '',
      isGroupTypeSelected : false,
      values : '',
      selectionType : '',
      grade : '',
      districtOrSchool : '',
      isWhoShouldViewSelected : false,
      isNotificationFinished : false,
      showNotificationNotFinishedModal : false
    }

    this.closeNoDateChangeModal = this.closeNoDateChangeModal.bind(this);
    this.confirmNoDateChange = this.confirmNoDateChange.bind(this);
    this.closeConfirmNotificationModal = this.closeConfirmNotificationModal.bind(this);
    this.submitNewNotification = this.submitNewNotification.bind(this);
    this.fireSelect = this.fireSelect.bind(this);
    this.selectSchool = this.selectSchool.bind(this);
    this.renderGroupTypeSelect = this.renderGroupTypeSelect.bind(this);
    this.selectGroupType = this.selectGroupType.bind(this);
    this.renderRecipientSelect = this.renderRecipientSelect.bind(this);
    this.onMultiselect = this.onMultiselect.bind(this);
    this.renderSelectionTypeSelect = this.renderSelectionTypeSelect.bind(this);
    this.chooseSelectionType = this.chooseSelectionType.bind(this);
    this.chooseGrade = this.chooseGrade.bind(this);
    this.closeNotificationNotFinishedModal = this.closeNotificationNotFinishedModal.bind(this);
  }

  componentWillMount() {
    this.props.loginState.teacherInfo ? this.props.getParentsBySchoolId(this.props.loginState.teacherInfo.schoolId) : null;
    this.props.loginState.teacherInfo ? this.props.getTeachersBySchoolId(this.props.loginState.teacherInfo.schoolId) : null;
  }

  componentDidMount() {
    //Makes sure that the notification date time is defaulted to now
    this.setState({notificationDateTime : moment()});
    if(this.props.loginState.adminInfo) {
      this.props.getSchoolsByDistrictId(this.props.loginState.adminInfo.districtId)
    }
  }

  handleChange = m => {
    this.setState({ m });
    this.setState({hasDateTimeChanged : true});
    this.setState({notificationDateTime: this.state.m});
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`
    var self = this;
    return (
      <div className = { className }>
        <label className="main-dark-blue small-text margin-bottom-0">{field.label}</label>
        <input
          className="form-control"
          type="text"
          {...field.input}
        />
        <div className="text-help small-text">
          {touched ? error : ''}
        </div>
      </div>
    );
  }


  renderGroupTypeSelect() {
    return(
      <Row>
        <Col xs={12} smPush={2} sm={8}>
          <label className="main-dark-blue small-text">Send to Teachers or Parents?</label>
          <FormControl 
            onChange={this.selectGroupType} 
            componentClass="select"
            ref={select => { this.groupSelect = select }}
            className="small-text"
          >
            <option value=""> -- Make Selection -- </option>
            <option value="teachers">Teachers</option>
            <option value="parents">Parents</option>
          </FormControl>
        </Col>
      </Row>       
    )
  }

  selectGroupType() {
    var groupType = ReactDOM.findDOMNode(this.groupSelect).value;
    this.setState({groupType : groupType})
    !groupType ? this.setState({isNotificationFinished : false}) : null;
    ReactDOM.findDOMNode(this.groupSelect).value ? this.setState({isGroupTypeSelected : true}) : this.setState({isGroupTypeSelected : false})
  }

  renderSelectionTypeSelect() {
    return(
      <Row>
        <Col xs={12} smPush={2} sm={8}>
          <label className="main-dark-blue small-text">Choose by Grade or Individual?</label>
          <FormControl 
            onChange={this.chooseSelectionType} 
            componentClass="select"
            ref={select => { this.selectionType = select }}
            className="small-text"
          >
            <option value=""> -- Make Selection -- </option>
            <option value="grade">Select by Grade</option>
            <option value="indiv">Select Individually</option>
          </FormControl>
        </Col>
      </Row> 
    )
  }

  chooseSelectionType() {
    var selectionType = ReactDOM.findDOMNode(this.selectionType).value;
    this.setState({selectionType : selectionType})
    !selectionType ? this.setState({isNotificationFinished : false}) : null;
    !selectionType ? this.setState({values : []}) : null;
    selectionType == '' ? this.setState({isNotificationFinished : false}) : null;
    selectionType ? this.setState({isSelectionTypeSelected : true}) : this.setState({isSelectionTypeSelected : false})
  }

  onMultiselect(e, newValue) {
    this.setState({isNotificationFinished : true});
    this.setState({values: newValue});
  }

  renderRecipientSelect(recipientType) {
    var recipients = [];
    var roster;
    recipientType == 'parents' ? roster = this.props.rosters.parents : roster = this.props.rosters.teachers;
    _.each(roster, function(person, key){
      person.id = key;
      person.name = `${person.firstName} ${person.lastName} (${person.email})`
      recipients.push(person)
    })
    return (
      <Row>
        <Col xs={12} smPush={2} sm={8}>
          <label className="main-dark-blue small-text">Choose the recipients: </label>
          <Field
            component={renderMultiSelect}
            name="recipients"
            values={this.state.values} 
            data={recipients}
            valueField="teacherId"
            textField="name"
            onChange={this.onMultiselect}
            defaultValue={[]}
            className="small-text"
          />
        </Col>
      </Row>
    )
  }

  renderGradeSelect() {
    return(
      <Row>
        <Col xs={12} smPush={2} sm={8}>
          <label className="main-dark-blue small-text">Choose Grade:</label>
          <FormControl 
            onChange={this.chooseGrade} 
            componentClass="select"
            ref={select => { this.gradeSelect = select }}
            className="small-text"
          >
            <option value=""> -- Make Selection -- </option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
            <option value="5">5th</option>
            <option value="6">6th</option>
            <option value="7">7th</option>
            <option value="8">8th</option>
            <option value="9">9th</option>
            <option value="10">10th</option>
            <option value="11">11th</option>
            <option value="12">12th</option>
          </FormControl>
        </Col>
      </Row> 
    )
  }

  chooseGrade() {
    var grade = ReactDOM.findDOMNode(this.gradeSelect).value;
    grade ? this.setState({isNotificationFinished : true}) : this.setState({isNotificationFinished : false});
    ReactDOM.findDOMNode(this.gradeSelect).value ? this.setState({grade : grade}) : this.setState({grade : null});
  }

  renderWhoShouldViewSelect() {
    return (
      <Row>
        <Col xs={12} smPush={2} sm={8}>
          <label className="main-dark-blue small-text">Who should view this notification?</label>
          <FormControl 
            onChange={this.fireSelect} 
            componentClass="select"
            ref={select => { this.whoShouldViewSelect = select }}
            className="small-text"
          >
            <option value=""> -- Make Selection -- </option>
            <option value="district">All Parents in my District</option>
            <option value="school">All Parents in a Specific School</option>
          </FormControl>
        </Col>
      </Row> 
    )
  }

  fireSelect() {
    var districtOrSchool = ReactDOM.findDOMNode(this.whoShouldViewSelect).value;
    !districtOrSchool ? this.setState({isNotificationFinished : false}) : null;
    districtOrSchool == 'district' ? this.setState({isNotificationFinished : true}) : this.setState({isNotificationFinished : false});
    this.setState({districtOrSchool : districtOrSchool});
  }


  renderSchoolSelect() {
    let schools = []
    schools.push(<option key="" value=""> -- Select School -- </option>);  
    _.each(this.props.schools, function(school, key){
      schools.push(<option key={key} value={key}>{school.name}</option>);   
    })
  
    return (
      <Row>
        <Col xs={12} smPush={2} sm={8}>
          <label className="main-dark-blue small-text">School:</label>
          <FormControl 
            onChange={this.selectSchool} 
            componentClass="select"
            ref={select => { this.schoolSelect = select }}
            className="small-text"
          >
          { schools }
          </FormControl>
        </Col>
      </Row> 
    )
  }
  
  selectSchool(values) {
    var schoolId = ReactDOM.findDOMNode(this.schoolSelect).value;
    schoolId ? this.setState({isNotificationFinished : true}) : this.setState({isNotificationFinished : false});
    this.setState({schoolId : schoolId})
  }

  onSubmit(notificationInfo) {
    this.setState({notificationTitle : notificationInfo.title});
    this.setState({notificationBody : notificationInfo.body});
    if(this.state.isNotificationFinished == false || (this.state.selectionType == 'indiv' && this.state.values.length == 0)) {
      this.setState({showNotificationNotFinishedModal : true});
    } else {
      if(this.state.hasDateTimeChanged == false){
        this.setState({showNoDateChangeModal : true});
      } else {
        this.setState({showConfirmNotificationModal : true});
      }
    }
  }

  closeNotificationNotFinishedModal() {
    this.setState({showNotificationNotFinishedModal : false});
  }

  confirmNoDateChange() {
    this.setState({showNoDateChangeModal : false})
    this.setState({showConfirmNotificationModal : true})
  }

  closeNoDateChangeModal() {
    this.setState({showNoDateChangeModal : false})
  }

  closeConfirmNotificationModal() {
    this.setState({showConfirmNotificationModal : false})
  }

  submitNewNotification() {
    var epochTime = Math.floor(this.state.notificationDateTime.valueOf()/1000)
    var notification = {
      title : this.state.notificationTitle,
      message : this.state.notificationBody,
      firstName : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.firstName : this.props.loginState.teacherInfo.firstName,
      lastName : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.lastName : this.props.loginState.teacherInfo.lastName,
      pic : this.state.pic ? this.state.pic : "empty",
      sendDate : epochTime,
      isClickable : this.state.isClickable ? this.state.isClickable : false,
      userId : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.userId : this.props.loginState.teacherInfo.userId,
      grade : this.state.grade,
      schoolId : this.props.loginState.teacherInfo ? this.props.loginState.teacherInfo.schoolId : null,
      districtId : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.districtId : null,
      recipients : this.state.values,
      notificationType : 'message'
    }
    this.props.loginState.teacherInfo ? this.props.createTeacherNotification(notification) 
      : this.props.createDistrictNotification(notification, this.state.districtOrSchool, this.state.schoolId, this.props.loginState.adminInfo.districtId)
    this.setState({showNoDateChangeModal : false})
    this.setState({showConfirmNotificationModal : false})
  }

  render(){

    const { handleSubmit } = this.props;

    const dateTime =  this.state.m.format('MM/DD/YYYY hh:mm a');

    //Render Group Type select box if user creating notification is a School Admin
    var chooseGroupType = <div/>
    this.props.loginState.teacherInfo ? chooseGroupType = this.renderGroupTypeSelect() : <div/>;

    //Render select box to choose selection type (grade or individually) 
    var chooseSelectionType = <div/>
    this.state.isGroupTypeSelected == true  ? chooseSelectionType = this.renderSelectionTypeSelect() : chooseSelectionType = <div/>;

    //Choose the end recipients, either by grade or individually
    var chooseRecipient = <div/>
    this.state.isSelectionTypeSelected == true && this.state.selectionType == 'grade' ? chooseRecipient = this.renderGradeSelect()
      : this.state.isSelectionTypeSelected == true && this.state.selectionType == 'indiv' ? chooseRecipient = this.renderRecipientSelect(this.state.groupType)
      :  chooseRecipient = <div/>;

    //Render select box if user creating notification is a District Admin
    var whoShouldView = <div/>;
    this.props.loginState.adminInfo ? whoShouldView = this.renderWhoShouldViewSelect() : <div/>;

    //Render select box to choose school if District Admin chooses to do so
    var chooseSchool = <div/>
    this.state.districtOrSchool == 'school' ? chooseSchool = this.renderSchoolSelect() : chooseSchool = <div/>;

    return(
      <form onSubmit={ handleSubmit(this.onSubmit.bind(this))}>
        <Row>
          <Col xsPush={1} xs={10} smPush={2} sm={8} mdPush={4} md={8}>
              <h3 className="main-dark-blue medium-text">Create Notification</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} smPush={2} sm={8}>
            <Field
              label="Notification Title"
              name="title"
              component={this.renderField}
              onChange={this.kickFilter}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} smPush={2} sm={8}>
            <Field
              label="Notification Body"
              name="body"
              component={this.renderField}
            />
          </Col>
        </Row>
        { chooseGroupType }
        { chooseSelectionType }
        { chooseRecipient }
        { whoShouldView }
        { chooseSchool }
        <Row>
          <Col xs={12} smPush={2} sm={8}>
            <label className="main-dark-blue small-text">When should notification be sent?</label>
              <DateTime 
                defaultValue={this.state.m}
                onChange={this.handleChange}
              />
          </Col>
        </Row>
        <Row>
          <Col xs={12} smPush={2} sm={8}>
            <Button type="submit" className="submit-btn margin-top-10">Submit</Button>
          </Col>
        </Row>
        <Modal show={this.state.showNoDateChangeModal} onHide={this.closeNoDateChangeModal}>
          <Modal.Header>
            <Modal.Title className="main-dark-blue">Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Row>
                <p className="main-dark-blue">Warning: You have not selected a new date-time to send out this notification. It will be sent immediately, upon your review and confirmation. Would you still like to proceed?</p>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button className="submit-btn" onClick={this.confirmNoDateChange}>Yes</Button>
            <Button className="cancel-btn" onClick={this.closeNoDateChangeModal}>No</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showNotificationNotFinishedModal} onHide={this.closeNotificationNotFinishedModal}>
          <Modal.Header>
            <Modal.Title className="main-dark-blue">Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Row>
                <p className="main-dark-blue">You must choose at least one recipient!</p>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeNotificationNotFinishedModal}>Return to Poll</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showConfirmNotificationModal} onHide={this.closeConfirmNotificationModal}>
          <Modal.Header>
            <Modal.Title>Confirm Notification Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Row>
                <p>Title: {this.state.notificationTitle}</p>
              </Row>
              <Row>
                <p>Message: {this.state.notificationBody}</p>
              </Row>
              <Row>
                <p>Time to be sent: {dateTime}</p>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button className="submit-btn" onClick={this.submitNewNotification}>Submit</Button>
            <Button className="cancel-btn" onClick={this.closeConfirmNotificationModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </form>
    )    
  }
}

function filterLastName(person, value) {
  let lastname = person.lastName.toLowerCase()
  let search  = value.toLowerCase();

  return lastname.indexOf(search) === 0
}

function validate(values) {
  const errors = {};

  if(!values.title) {
    errors.title = "Notification must have a title!";
  }

  if(!values.body) {
    errors.body = "Notficiation must have a body!";
  }

  return errors;
}

function mapStateToProps(state) {
  return { 
    loginState : state.loginState,
    schools : state.schools,
    adminInfo : state.loginState.adminInfo,
    rosters : state.rosters
  }
}

export default reduxForm({
  form: 'PollingForm',
  validate
})(
    connect(mapStateToProps, { createTeacherNotification , createDistrictNotification , 
                                getSchoolsByDistrictId , getTeachersBySchoolId , getTeachersByDistrictId, getParentsBySchoolId})(CreateNotification)
);

