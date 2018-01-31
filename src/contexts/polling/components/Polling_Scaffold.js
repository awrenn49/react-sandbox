import {Image, Grid, Row, Col, Nav, NavItem} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import Polling from './Polling';
import CreatedPolls from './Created_Polls';

import { clearReroute } from '../../reroute/actions/reroute_action';

class PollingScaffold extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabSelected : 'myPolls'
    }

    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.reroute !== this.props.reroute){
      this.setState({tabSelected : "myPolls"})
    }
    this.props.clearReroute();
  }

  handleSelect(selection){
    this.setState({
      tabSelected: selection
    })
  }

  render(){

    var pollingComponent = <CreatedPolls/>;

    (this.state.tabSelected == 'myPolls') ? pollingComponent = <CreatedPolls/> : pollingComponent = <Polling/>

    return (
      <Grid>
        <Row>
          <h3 className="title_left main-dark-blue">Polling</h3>
        </Row>  
        <Row>
          <Nav bsStyle="tabs" activeKey={this.state.tabSelected}>
            <NavItem eventKey="myPolls" className="smaller-header" onSelect={this.handleSelect}>My Polls</NavItem>
            <NavItem eventKey="polling" className="smaller-header" onSelect={this.handleSelect}>Create New Poll</NavItem>
          </Nav>
        </Row>
        <Row>
          {pollingComponent}
        </Row>
      </Grid>
    )    
  }
}

function mapStateToProps(state){
  return {
    reroute : state.reroute
  }
}

export default connect(mapStateToProps, { clearReroute })(PollingScaffold);

