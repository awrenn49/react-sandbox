import {Image, Grid, Row, Col, Nav, NavItem, NavDropdown, MenuItem, PanelGroup, Panel} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';

import Districts from './Districts';
import MyAccountTab  from './MyAccountTab';

class MyAccount extends Component {

  constructor(props) {
    super(props);

    this.state = {'tabSelected' : '1'}
    this.handleSelect = this.handleSelect.bind(this);

  }

  handleSelect(selection){
    this.setState({
      tabSelected: selection
    })
  }

  render(){
    var areaComponent = <Districts/>;

     (this.state.tabSelected == 'districts') ? areaComponent = <Districts/> : areaComponent = <MyAccountTab/>

    return (
      <Grid>
        <Row>
          <h3 className="title_left">Manage</h3>
        </Row>  
        <Row>
          <Nav bsStyle="tabs" activeKey={this.state.tabSelected}>
            <NavItem eventKey="districts" onSelect={this.handleSelect}>Districts</NavItem>
            <NavItem eventKey="myAccount" onSelect={this.handleSelect}>My Account</NavItem>
          </Nav>
        </Row>
        <Row>
          {areaComponent}
        </Row>
      </Grid>
    )    
  }

}

export default MyAccount;
