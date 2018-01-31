import {Image, Grid, Row, Col, Nav, NavItem} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import { clearReroute } from '../../reroute/actions/reroute_action';

import MyNotifications from './MyNotifications';
import CreateNotification from './CreateNotification';

class NotificationScaffold extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabSelected : 'myNotifications'
    }

    this.handleSelect = this.handleSelect.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps.reroute !== this.props.reroute){
      this.setState({tabSelected : "myNotifications"})
    }
    this.props.clearReroute();
  }

  handleSelect(selection){
    this.setState({
      tabSelected: selection
    })
  }

  render(){

    var notificiationComponent = <MyNotifications/>;

    (this.state.tabSelected == 'myNotifications') ? notificiationComponent = <MyNotifications/> 
      : notificiationComponent = <CreateNotification/>

    return (
      <Grid>
        <Row>
          <h3 className="title_left main-dark-blue">Notifications</h3>
        </Row>  
        <Row>
          <Nav bsStyle="tabs" activeKey={this.state.tabSelected}>
            <NavItem className="main-dark-blue smaller-header" eventKey="myNotifications" onSelect={this.handleSelect}>My Notifications</NavItem>
            <NavItem className="main-dark-blue smaller-header" eventKey="createNotifications" onSelect={this.handleSelect}>Create Notification</NavItem>
          </Nav>
        </Row>
        <Row>
          {notificiationComponent}
        </Row>
      </Grid>
    )    
  }
}

function mapStateToProps(state) {
  return {
    reroute : state.reroute
  }
}

export default connect(mapStateToProps, { clearReroute })(NotificationScaffold);

