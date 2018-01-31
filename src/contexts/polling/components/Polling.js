import { connect } from 'react-redux';
import {Field, reduxForm, reducer as formReducer } from 'redux-form';
import {Image, Grid, Row, Col, FormGroup, FormControl, Button, Modal} from 'react-bootstrap';
import {withRouter, Link, Route } from 'react-router-dom';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment'; 
import _ from 'underscore';
import DateTime from 'react-datetime';

import { createDistrictAdminPoll, createSchoolAdminPoll  } from '../actions/polling_action';
import { createDistrictNotification, createTeacherNotification} from '../../notifications/actions/notification_action';
import { getSchoolsByDistrictId } from '../actions/schools_action';
import { getTeachersBySchoolId, getTeachersByDistrictId, getParentsBySchoolId } from '../../roster/actions/roster_action';

import { renderMultiSelect } from '../../notifications/components/FormMultiselect';


import 'input-moment/dist/input-moment.css';
import InputMoment from 'input-moment';

import 'react-widgets/dist/css/react-widgets.css';

class Polling extends Component {

  constructor(props) {
    super(props);

    this.state = {
      districtId : '',
      schoolId : '',
      pollDateTime : '',
      m : moment(),
      hasDateTimeChanged : false,
      showNoDateChangeModal : false,
      showConfirmPollModal : false,
      notificationDateTime : 'none',
      question1Type : '',
      question2Type : '',
      question3Type : '',
      isGroupTypeSelected : false,
      isWhoShouldViewSelected : false,
      isSelectionTypeSelected : false,
      selectionType : '',
      values : '',
      grade : '',
      districtOrSchool : '',
      pollTitle : '',
      question1 : '',
      question2 : '',
      question3 : '',
      pic : '',
      questions : [],
      isPollFinished : false,
      showPollNotFinishedModal : false,
      showNoTypeSelectedModal : false,
      isClickable : false
    }

    this.renderQuestionTypeSelect = this.renderQuestionTypeSelect.bind(this);
    this.selectQuestionType = this.selectQuestionType.bind(this);
    this.fireSelect = this.fireSelect.bind(this);
    this.selectSchool = this.selectSchool.bind(this);
    this.renderGroupTypeSelect = this.renderGroupTypeSelect.bind(this);
    this.selectGroupType = this.selectGroupType.bind(this);
    this.renderRecipientSelect = this.renderRecipientSelect.bind(this);
    this.onMultiselect = this.onMultiselect.bind(this);
    this.renderSelectionTypeSelect = this.renderSelectionTypeSelect.bind(this);
    this.chooseSelectionType = this.chooseSelectionType.bind(this);
    this.chooseGrade = this.chooseGrade.bind(this);
    this.confirmNoDateChange = this.confirmNoDateChange.bind(this);
    this.closeNoDateChangeModal = this.closeNoDateChangeModal.bind(this);
    this.closePollModal = this.closePollModal.bind(this);
    this.submitNewPoll = this.submitNewPoll.bind(this);
    this.buildQuestion = this.buildQuestion.bind(this);
    this.closePollNotFinishedModal = this.closePollNotFinishedModal.bind(this);
    this.closeNoTypeSelectedModal = this.closeNoTypeSelectedModal.bind(this);
    this.renderPollDetails = this.renderPollDetails.bind(this);
  }

  componentWillMount() {
    this.props.loginState.teacherInfo ? this.props.getParentsBySchoolId(this.props.loginState.teacherInfo.schoolId) : null;
    this.props.loginState.teacherInfo ? this.props.getTeachersBySchoolId(this.props.loginState.teacherInfo.schoolId) : null;
  }

  componentDidMount(){
    this.setState({pollDateTime : moment()});

    if(this.props.loginState.adminInfo) {
      this.props.getSchoolsByDistrictId(this.props.loginState.adminInfo.districtId)
    }
  }

  handleChange = m => {
    this.setState({ m });
    this.setState({hasDateTimeChanged : true});
    this.setState({pollDateTime: this.state.m});
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label className="main-dark-blue small-text">{field.label}</label>
        <input
          className="form-control rounded"
          type="text"
          {...field.input}
        />
        <div className="text-help small-text">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  renderQuestionTypeSelect(questionNumber) {
    return (
      <Col xs={4} smPush={1} sm={3} mdPush={2} md={2}>
        <label className="small-text padding-top-24"></label>
        <FormControl 
          onChange={e => this.selectQuestionType(e, questionNumber)}
          componentClass="select"
          ref={select => { this.questionTypeSelect = select }}
          className="small-text"
        >
          <option value=""> -- Make Selection -- </option>
          <option value="range">Range</option>
          <option value="trueFalse">True / False</option>
          <option value="yesNo">Yes / No</option>
        </FormControl>
      </Col>
    )
  }

  selectQuestionType(e, questionNumber) {
    var questionType = e.target.value;
    if(questionNumber == "first"){
      questionType ? this.setState({question1Type : questionType}) : this.setState({question1Type : questionType})
    } else if(questionNumber == "second"){
      questionType ? this.setState({question2Type : questionType}) : this.setState({question2Type : questionType})
    } else {
      questionType ? this.setState({question3Type : questionType}) : this.setState({question3Type : questionType})
    }
  }

  renderGroupTypeSelect() {
    return(
      <Row>
        <Col xs={12} smPush={1} sm={7} mdPush={2} md={6}>
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
    !groupType ? this.setState({isPollFinished : false}) : null;
    this.setState({groupType : groupType});
    ReactDOM.findDOMNode(this.groupSelect).value ? this.setState({isGroupTypeSelected : true}) : this.setState({isGroupTypeSelected : false});
  }

  renderSelectionTypeSelect() {
    return(
      <Row>
        <Col xs={12} smPush={1} sm={7} mdPush={2} md={6}>
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
    this.setState({selectionType : selectionType});
    !selectionType ? this.setState({isPollFinished : false}) : null;
    !selectionType ? this.setState({values : []}) : null;
    selectionType ? this.setState({isSelectionTypeSelected : true}) : this.setState({isSelectionTypeSelected : false}) && this.setState({ isPollFinished : true});
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
        <Col xs={12} smPush={1} sm={7} mdPush={2} md={6}>
          <label className="main-dark-blue small-text">Choose the recipients:</label>
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

  onMultiselect(e, newValue) {
    this.setState({ isPollFinished : true});
    this.setState({ values: newValue});
  }

  renderGradeSelect() {
    return(
      <Row>
        <Col xs={12} smPush={1} sm={7}  mdPush={2} md={6}>
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
    grade ? this.setState({isPollFinished : true}) : this.setState({isPollFinished : false});
    grade ? this.setState({grade : grade}) && this.setState({ isPollFinished : true}) : this.setState({grade : null});
  }

  renderWhoShouldViewSelect() {
    return (
      <Row>
        <Col xs={12} smPush={1} sm={7} mdPush={2} md={6}>
          <label className="main-dark-blue small-text">Who should receive this poll?</label>
          <FormControl 
            onChange={this.fireSelect} 
            componentClass="select"
            ref={select => { this.select = select }}
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
    var districtOrSchool = ReactDOM.findDOMNode(this.select).value;
    districtOrSchool == 'district' ? this.setState({isPollFinished : true}) : this.setState({isPollFinished : false});
    this.setState({districtOrSchool : districtOrSchool});
  }

  renderSchoolSelect() {
    let schools = [];
    schools.push(<option key="" value=""> -- Select School -- </option>);  
    _.each(this.props.schools, function(school, key){
      schools.push(<option key={key} value={school.schoolId}>{school.name}</option>);   
    });
  
    return (
      <Row>
        <Col xs={12} smPush={1} sm={7} mdPush={2} md={6}>
          <label className="main-dark-blue small-text">School</label>
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
    schoolId ? this.setState({isPollFinished : true}) : this.setState({isPollFinished : false});
    this.setState({schoolId : schoolId});
  }

  closeNoTypeSelectedModal() {
    this.setState({showNoTypeSelectedModal : false});
  }

  closePollNotFinishedModal() {
    this.setState({showPollNotFinishedModal : false});
  }

  confirmNoDateChange() {
    this.setState({showNoDateChangeModal : false});
    this.setState({showConfirmPollModal : true});
  }

  closeNoDateChangeModal() {
    this.setState({showNoDateChangeModal : false});
  }

  closePollModal() {
    this.setState({showConfirmPollModal : false});
  }

  buildQuestion(questionNumber, question, questionType){
    var questionOptions = [];
    var answers = [];
    if(questionType == 'range'){
      questionOptions.push("Strongly Agree");
      questionOptions.push("Disagree");
      questionOptions.push("Neutral");
      questionOptions.push("Agree");
      questionOptions.push("Strongly Agree");
      answers.push({count: 0});
      answers.push({count: 0});
      answers.push({count: 0});
      answers.push({count: 0});
      answers.push({count: 0});
    } else if (questionType == 'trueFalse'){
      questionOptions.push("True");
      questionOptions.push("False");
      answers.push({count: 0});
      answers.push({count: 0});
    } else {
      questionOptions.push("Yes");
      questionOptions.push("No");
      answers.push({count: 0});
      answers.push({count: 0});
    }

    var questionFull = {
      question: question,
      questionOptions: questionOptions,
      answers: answers,
      questionType: questionType
    }

    this.state.questions.push(questionFull);
    
    return questionFull; 
  }

  onSubmit(pollInfo){
    this.setState({pollTitle : pollInfo.title});
    this.setState({question1 : pollInfo.question1});
    this.setState({question2 : pollInfo.question2});
    this.setState({question3 : pollInfo.question3});
    if(this.state.question1Type == '' || (pollInfo.question2 && this.state.question2Type == '') || (pollInfo.question3 && this.state.question3Type == '')) {
      this.setState({showNoTypeSelectedModal : true})        
    } else  {
      if(this.state.isPollFinished == false || (this.state.selectionType == 'indiv' && this.state.values.length == 0)) {
          this.setState({showPollNotFinishedModal : true});
      } else {
        if(this.state.hasDateTimeChanged == false){
          this.setState({showNoDateChangeModal : true});
        } else {
          this.setState({showConfirmPollModal : true});
        }
      }
    }
  }


  submitNewPoll() {
    this.buildQuestion("first", this.state.question1, this.state.question1Type);
    this.state.question2 ? this.buildQuestion("second", this.state.question2, this.state.question2Type) : null;
    this.state.question3 ? this.buildQuestion("third", this.state.question3, this.state.question3Type) : null;
    var epochTime = Math.floor(this.state.pollDateTime.valueOf()/1000);

    var poll = {
      title : this.state.pollTitle,
      questions : this.state.questions,
      firstName : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.firstName : this.props.loginState.teacherInfo.firstName,
      lastName : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.lastName : this.props.loginState.teacherInfo.lastName,
      pic : this.state.pic ? this.state.pic : "empty",
      sendDate : epochTime,
      userId : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.userId : this.props.loginState.teacherInfo.userId,
      recipients : this.state.values,
      grade : this.state.grade,
      schoolId : this.props.loginState.teacherInfo ? this.props.loginState.teacherInfo.schoolId : null,
      districtId : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.districtId : null,
    }
    this.props.loginState.teacherInfo ? this.props.createSchoolAdminPoll(poll) 
      : this.props.createDistrictAdminPoll(poll, this.state.districtOrSchool, this.state.schoolId, this.props.loginState.adminInfo.districtId);

    var title = `New Poll! ${this.state.pollTitle}`;
    var message = `A new Poll has been created: ${this.state.pollTitle}. Please respond at your earliest convenience.`;

    var notification = {
      title : title,
      message : message,
      firstName : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.firstName : this.props.loginState.teacherInfo.firstName,
      lastName : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.lastName : this.props.loginState.teacherInfo.lastName,
      pic : this.state.pic ? this.state.pic : "empty",
      sendDate : epochTime,
      isClickable : this.state.isClickable ? this.state.isClickable : false,
      userId : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.userId : this.props.loginState.teacherInfo.userId,
      schoolId : this.props.loginState.teacherInfo ? this.props.loginState.teacherInfo.schoolId : null,
      districtId : this.props.loginState.adminInfo ? this.props.loginState.adminInfo.districtId : null,
      grade : this.state.grade,
      recipients : this.state.values,
      notificationType : 'poll'
    }
    this.props.loginState.teacherInfo ? this.props.createTeacherNotification(notification) 
      : this.props.createDistrictNotification(notification, this.state.districtOrSchool, this.state.schoolId, this.props.loginState.adminInfo.districtId)
    this.setState({showNoDateChangeModal : false});
    this.setState({showConfirmPollModal : false}); 
  }

  renderPollDetails(){
    const dateTime =  this.state.m.format('MM/DD/YYYY hh:mm a');
    var questions = [];

    var question1 = `Question #1: ${this.state.question1}`;
    var question2 = `Question #2: ${this.state.question2}`;
    var question3 = `Question #3: ${this.state.question3}`;

    questions.push(
      <Row key="question1">
        <p>{question1}</p>
      </Row>
    );

    this.state.question2 ? 
      questions.push(
        <Row key="question2">
          <p>{question2}</p>
        </Row>
      )
    : null;

    this.state.question3 ? 
      questions.push(
        <Row key="question3">
          <p>{question3}</p>
        </Row>
      )
    : null;

    return (
      <div>
        <Row>
          <p>Title: {this.state.pollTitle}</p>
        </Row>
        { questions }
        <Row>
          <p>Time to be sent: {dateTime}</p>
        </Row>
      </div>
    )
  }

  render(){

    const { handleSubmit } = this.props;

    const dateTime =  this.state.m.format('MM/DD/YYYY hh:mm a');

    //Render Group Type select box if user creating poll is a School Admin
    var chooseGroupType = <div/>;
    this.props.loginState.teacherInfo ? chooseGroupType = this.renderGroupTypeSelect() : <div/>;

    //Render select box to choose selection type (grade or individually) 
    var chooseSelectionType = <div/>;
    this.state.isGroupTypeSelected == true  ? chooseSelectionType = this.renderSelectionTypeSelect() : chooseSelectionType = <div/>;

    //Choose the end recipients, either by grade or individually
    var chooseRecipient = <div/>;
    this.state.isSelectionTypeSelected == true && this.state.selectionType == 'grade' ? chooseRecipient = this.renderGradeSelect()
      : this.state.isSelectionTypeSelected == true && this.state.selectionType == 'indiv' ? chooseRecipient = this.renderRecipientSelect(this.state.groupType)
      : chooseRecipient = <div/>;
    
    //Render select box if user creating poll is an Administrator
    var whoShouldView = <div/>;
    this.props.loginState.adminInfo ? whoShouldView = this.renderWhoShouldViewSelect() : <div/>;

    //Render select box to choose school if Adminstrator chooses to do so
    var chooseSchool = <div/>
    this.state.districtOrSchool == 'school' ? chooseSchool = this.renderSchoolSelect() : chooseSchool = <div/>;

    return(
      <form onSubmit={ handleSubmit(this.onSubmit.bind(this))}>
        <Row>
          <Col xsPush={1} xs={8} smPush={3} sm={5} mdPush={4} md={6}>
              <h3 className="main-dark-blue medium-text">Create Poll</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={8} smPush={1} sm={7} mdPush={2} md={6}>
            <Field
              label="Poll Title"
              name="title"
              component={this.renderField}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8} smPush={1} sm={7}  mdPush={2} md={6}>
            <Field
              label="Question #1"
              name="question1"
              component={this.renderField}
            />
          </Col>
          {this.renderQuestionTypeSelect("first")}
        </Row>
        <Row>
          <Col xs={8} smPush={1} sm={7}  mdPush={2} md={6}>
            <Field
              label="Question #2"
              name="question2"
              component={this.renderField}
            />
          </Col>
          {this.renderQuestionTypeSelect("second")}
        </Row>
        <Row>
          <Col xs={8} smPush={1} sm={7} mdPush={2} md={6}>
            <Field
              label="Question #3"
              name="question3"
              component={this.renderField}
            />
          </Col>
          {this.renderQuestionTypeSelect("third")}
        </Row>
        { chooseGroupType }
        { chooseSelectionType }
        { chooseRecipient }
        { whoShouldView }
        { chooseSchool }
        <Row>
          <Col xs={12} smPush={1} sm={7} mdPush={2} md={6}>
            <label className="main-dark-blue small-text">When should poll be sent?</label>
            <DateTime 
              defaultValue={this.state.m}
              onChange={this.handleChange}
              className="small-text rounded"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8} smPush={1} sm={7} mdPush={2} md={6}>
            <Button type="submit" className="submit-btn margin-top-10">Submit</Button>
          </Col>
        </Row>
        <Modal show={this.state.showPollNotFinishedModal} onHide={this.closePollNotFinishedModal}>
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
            <Button className="cancel-button" onClick={this.closePollNotFinishedModal}>Return to Poll</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showNoTypeSelectedModal} onHide={this.closeNoTypeSelectedModal}>
          <Modal.Header>
            <Modal.Title className="main-dark-blue">Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Row>
                <p className="main-dark-blue">One or more questions does not have a question type selected!</p>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-button" onClick={this.closeNoTypeSelectedModal}>Return to Poll</Button>
          </Modal.Footer>
        </Modal>
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
            <Button onClick={this.confirmNoDateChange}>Yes</Button>
            <Button onClick={this.closeNoDateChangeModal}>No</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showConfirmPollModal} onHide={this.closePollModal}>
          <Modal.Header>
            <Modal.Title className="main-dark-blue">Confirm Poll Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              { this.renderPollDetails() }
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button className="submit-button" onClick={this.submitNewPoll}>Submit</Button>
            <Button className="cancel-button" onClick={this.closePollModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </form>
    )    
  }
}


function validate(values) {
  const errors = {};

  if(!values.title) {
    errors.title = "Survey must have a title!";
  }

  if(!values.question1) {
    errors.question1 = "Survey must have at least one question!";
  }

  return errors;
}

function mapStateToProps(state) {
  return { 
    loginState : state.loginState,
    pollingInfo : state.pollingInfo,
    schools : state.schools,
    rosters : state.rosters,
    reroute : state.reroute
  }
}

export default reduxForm({
  form: 'PollingForm',
  validate
})(
    connect(mapStateToProps, { createDistrictAdminPoll, createSchoolAdminPoll, getSchoolsByDistrictId, 
                                  getParentsBySchoolId, getTeachersBySchoolId, createTeacherNotification, createDistrictNotification })(withRouter(Polling))
);

