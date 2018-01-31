import {Image, Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import {withRouter, Link, Route } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import { connect } from 'react-redux';

class Sidebar extends Component  {

  constructor(props) {
    super(props);

    this.state = {
      'selected' : ''
    }

    this.handleSelect = this.handleSelect.bind(this);

  }

  handleSelect(id, parent) {
    this.props.history.push(`/${id}`);
  }


  render() {

    var isLoggedIn = true;

    if(isLoggedIn == true){    

      return(
        <Grid>
          <div style={{background: 'rgb(16, 105, 139)', color: '#FFF'}}> 
            <Row>
              <SideNav 
                highlightColor='black' 
                highlightBgColor='none' 
                selected={this.state.selected}
                onItemSelection={ (id, parent) => this.handleSelect(id, parent)}     
              > 
                <Nav id='home' className="black-text">
                    <NavIcon><i className='fa fa-home'/></NavIcon>
                    <NavText className='sidebar-text'>Analytics</NavText>
                </Nav>
              </SideNav>
            </Row>
          </div>
        </Grid>
      )       
    }
    else {
      return(
        <Grid>
          <div style={{background: 'rgb(16, 105, 139)', color: '#FFF'}}> 
            <Row>
              <Col xs={6} xsPush={3} >
                <Image src="../../../img/ptLogoWhite.png" className="pt-logo" responsive/>
              </Col>
            </Row>
            <Row>
              <Col  xs={6} xsPush={3} sm={12} md={6} mdPush={3}>
                <Image src="http://bellsvilla.com/img/generic-user.png" className="profile-image" responsive circle/>
              </Col>
            </Row>
            <Row>
              <SideNav 
                highlightColor='#10698b' 
                highlightBgColor='#c0f3fc' 
                defaultSelected='dashboard'
                selected={this.state.selected}
                onItemSelection={ (id, parent) => this.handleSelect(id, parent)}     
              > 
                <Nav id='login'>
                    <NavIcon><i className="fa fa-user"/></NavIcon>
                    <NavText>Login</NavText>
                </Nav>
                <Nav id='registration'>
                  <NavIcon><i className="fa fa-user"/></NavIcon>
                  <NavText>Register</NavText>
                </Nav>
                <Nav id='forgot_password'>
                    <NavIcon><i className="fa fa-user"/></NavIcon>
                    <NavText>Forgot Password</NavText>
                </Nav>
              </SideNav>
            </Row>
          </div>
        </Grid> 
      )
    }
  }
}

function mapStateToProps(state){
  var self = this;
  return { loginState: state.loginState }
}

export default connect(mapStateToProps, {  })(withRouter(Sidebar));

