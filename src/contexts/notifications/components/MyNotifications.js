import {Image, Grid, Row, Col, Modal, Button} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';
import moment from 'moment';

import Notification from './Notification';

import { getNotificationsBySchoolId, getNotificationsByDistrictId, deleteNotification } from '../actions/notification_action';

class MyNotifications extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      showConfirmNotificationModal : false,
      firebaseKey : ''
    }
    this.renderNotifications = this.renderNotifications.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);
    this.closeConfirmNotificationModal = this.closeConfirmNotificationModal.bind(this);
    this.confirmDeletion = this.confirmDeletion.bind(this);
  }

  componentWillMount(){
    this.props.loginState.teacherInfo ? this.props.getNotificationsBySchoolId(this.props.loginState.teacherInfo.schoolId)
      : this.props.getNotificationsByDistrictId(this.props.loginState.adminInfo.districtId);
  }

  deleteNotification(info, values) {
    this.setState({firebaseKey : values.firebaseKey})
    this.setState({showConfirmNotificationModal : true})
  }

  confirmDeletion() {
    this.props.deleteNotification(this.state.firebaseKey)
    this.setState({showConfirmNotificationModal : false})
  }


  closeConfirmNotificationModal() {
    this.setState({showConfirmNotificationModal : false})
  }


  renderNotifications(){
    return _.map(this.props.notifications, (item, key) => {
      var sendDate = new Date(0); 
      sendDate.setUTCSeconds(item.sendDate);
      return (
        <Col xs={12} mdPush={0} smPush={0} md={4} key={key}>
          <Notification
            handleClick={(e, props)=>{this.deleteNotification(e, props)}} 
            firebaseKey={key}
            title={item.title}
            message={item.message}
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
          {this.renderNotifications()}
          <Modal show={this.state.showConfirmNotificationModal} onHide={this.closeConfirmNotificationModal}>
            <Modal.Header>
              <Modal.Title className="main-dark-blue">Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Grid>
                <Row>
                  <p className="main-dark-blue">Do you want to delete this notification permanently? This action cannot be undone.</p>
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
    notifications: state.notifications,
    loginState: state.loginState
  }
}

export default connect(mapStateToProps, { getNotificationsBySchoolId, getNotificationsByDistrictId, deleteNotification })(MyNotifications);

