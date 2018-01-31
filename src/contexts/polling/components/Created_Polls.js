import {Image, Grid, Row, Col, Modal, Button} from 'react-bootstrap';
import React, { Component } from 'react';
import moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import Poll from './Poll'

import { deletePoll, getPollsBySchoolId, getPollsByDistrictId } from '../actions/polling_action';

class CreatedPolls extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      showConfirmPollDeletionModal : false
    }
    this.renderPolls = this.renderPolls.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
    this.confirmDeletion = this.confirmDeletion.bind(this);
    this.closeConfirmNotificationModal = this.closeConfirmNotificationModal.bind(this);
  }

  componentWillMount() {
    this.props.loginState.teacherInfo ? this.props.getPollsBySchoolId(this.props.loginState.teacherInfo.schoolId)
      : this.props.getPollsByDistrictId(this.props.loginState.adminInfo.districtId);
  }

  deletePoll(info, values) {
    this.setState({firebaseKey : values.firebaseKey});
    this.setState({showConfirmPollDeletionModal : true});
  }

  confirmDeletion() {
    this.props.deletePoll(this.state.firebaseKey);
    this.setState({showConfirmPollDeletionModal : false});
  }

  closeConfirmNotificationModal() {
    this.setState({showConfirmPollDeletionModal : false});
  }


  renderPolls(){
    return _.map(this.props.polls, (item, key) => {
      var sendDate = new Date(0); 
      sendDate.setUTCSeconds(item.sendDate);
      return (
        <Col xs={12} mdPush={0} smPush={0} md={4} key={key}>
          <Poll
            handleClick={(e, props)=>{this.deletePoll(e, props)}} 
            title={item.title}
            firebaseKey={key}
            questions={item.questions}
            sendDate={moment(sendDate).format(('MM/DD/YYYY hh:mm a'))}
           />
        </Col>
      )
    })
  }

  render(){

    return(
      <Grid>
        <Row>
          {this.renderPolls()}
           <Modal show={this.state.showConfirmPollDeletionModal} onHide={this.closeConfirmNotificationModal}>
            <Modal.Header>
              <Modal.Title className="main-dark-blue">Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Grid>
                <Row>
                  <p className="main-dark-blue">Do you want to delete this poll permanently? This action cannot be undone.</p>
                </Row>
              </Grid>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.closeConfirmNotificationModal}>Cancel</Button>
              <Button className="submit-btn" onClick={this.confirmDeletion}>Submit</Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Grid>
    )   
  }
}

function mapStateToProps(state){
  var self = this;
  return { 
    polls: state.pollingInfo,
    loginState: state.loginState 
  }
}

export default connect(mapStateToProps, { deletePoll, getPollsBySchoolId, getPollsByDistrictId })(CreatedPolls);

