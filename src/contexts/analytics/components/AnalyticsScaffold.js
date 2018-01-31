import {Image, Grid, Row, Col, Nav, NavItem} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import { clearReroute } from '../../reroute/actions/reroute_action';

import AnalyticsPolling from './AnalyticsPolling';

class AnalyticsScaffold extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabSelected : 'polling'
    }

    this.handleSelect = this.handleSelect.bind(this);
  }
  
  handleSelect(selection){
    this.setState({
      tabSelected: selection
    })
  }

  render(){

    var analyticsComponent = <AnalyticsPolling/>;

    (this.state.tabSelected == 'polling') ? analyticsComponent = <AnalyticsPolling/>  : analyticsComponent = <div/>

    return (
      <Grid>
        <Row>
          <h3 className="title_left main-dark-blue">Analytics</h3>
        </Row>  
        <Row>
          <Nav bsStyle="tabs" activeKey={this.state.tabSelected}>
            <NavItem eventKey="polling" onSelect={this.handleSelect}>Polling</NavItem>
          </Nav>
        </Row>
        <Row>
          {analyticsComponent}
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

export default connect(mapStateToProps, { clearReroute })(AnalyticsScaffold);

