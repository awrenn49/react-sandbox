import {Image, Grid, Row, Col, Nav, NavItem, NavDropdown, MenuItem, PanelGroup, Panel} from 'react-bootstrap';
import React, { Component} from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import Papa from 'papaparse';
import MyDropzone from '../../utils/MyDropzone.js';

import { addRoster } from '../actions/roster_action';

import DistrictRoster from './DistrictRoster';
import RosterUpload from './RosterUpload';

import firebase from '../../utils/firebase';

var webPortal = firebase.database();

class Roster extends Component {

  constructor(props){
    super(props);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      tabSelected : 'roster'
    }
  }

  handleSelect(selection){
    this.setState({
      tabSelected: selection
    })
  }

  render(){

    var rosterComponent = <DistrictRoster/>;

    this.state.tabSelected == 'teacherRoster' ? rosterComponent = <DistrictRoster rosterType="teachers" /> 
    : this.state.tabSelected == 'parentRoster' ? rosterComponent = <DistrictRoster rosterType="parents" />
    : this.state.tabSelected == 'teacherRosterUpload' ? rosterComponent = <RosterUpload uploadType="teachers" />
    : this.state.tabSelected == 'parentRosterUpload' ? rosterComponent = <RosterUpload uploadType="parents" />
    : null;
    var navItemArr = [];

    navItemArr.push(<NavItem key="tR" eventKey="teacherRoster" onSelect={this.handleSelect}>View Teachers</NavItem>);
    navItemArr.push(<NavItem key="pR" eventKey="parentRoster" onSelect={this.handleSelect}>View Parents</NavItem>);
    this.props.loginState.teacherInfo ? navItemArr.push(<NavItem key="tRU"eventKey="teacherRosterUpload" onSelect={this.handleSelect}>Upload New Teacher Roster</NavItem>) : null;
    this.props.loginState.teacherInfo ? navItemArr.push(<NavItem key="pRU" eventKey="parentRosterUpload" onSelect={this.handleSelect}>Upload New Parent Roster</NavItem>) : null;

    return (
      <Grid>
        <Row>
          <h3 className="title_left main-dark-blue">Roster</h3>
        </Row>  
        <Row>
          <Nav bsStyle="tabs" activeKey={this.state.tabSelected}>
            { navItemArr }
          </Nav>
        </Row>
        <Row>
          {rosterComponent}
        </Row>
      </Grid>
    ) 
  }

}

function mapStateToProps(state){
  var self = this;
  return { loginState: state.loginState }
}

export default connect(mapStateToProps, { addRoster })(Roster);

