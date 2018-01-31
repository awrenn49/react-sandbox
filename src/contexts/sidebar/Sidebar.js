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
      'selected' : '',
      'homeClicked' : false,
      'manageClicked' : false,
      'calendarColor' : ''
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
    this.navigateToManage = this.navigateToManage.bind(this);
  }

  handleSelect(id, parent) {
    if(id == 'analytics') {
      this.setState({homeClicked : true});
      this.setState({manageClicked : false});
    } else if (id == 'manage'){
      this.setState({manageClicked : true})
      this.setState({homeClicked : false});
    } else {
      this.setState({homeClicked : false});
      this.setState({manageClicked : false});
    }
    this.props.history.push(`/${id}`);
    this.setState({selected : id})
  }

  navigateHome() {
    this.setState({selected : 'analytics'})
    this.setState({homeClicked : true});
    this.setState({manageClicked : false});
    this.props.history.push(`/analytics`);
  }

  navigateToManage() {
    this.setState({selected : 'manage'})
    this.setState({manageClicked : true});
    this.setState({homeClicked : false});
    this.props.history.push(`/manage`);
  }

  render() {
    var profilePicURL;
    this.props.loginState.adminInfo ? profilePicURL = this.props.loginState.adminInfo.pic 
      : this.props.loginState.teacherInfo ? profilePicURL = this.props.loginState.teacherInfo.pic
      : profilePicURL = "http://bellsvilla.com/img/generic-user.png";

    if(this.props.loginState.isLoggedIn == true){    

      var analyticsIcon;
      this.state.homeClicked == true ? analyticsIcon = 'fa fa-bar-chart-o black-text' : analyticsIcon = 'fa fa-bar-chart-o';

      var analyticsText;
      this.state.homeClicked == true ? analyticsText = 'sidebar-text black-text' : analyticsText = 'sidebar-text';

      var manageIcon;
      this.state.manageClicked == true ? manageIcon = 'fa fa-user black-text' : manageIcon = 'fa fa-user';

      var manageText;
      this.state.manageClicked == true ? manageText = 'sidebar-text black-text' : manageText = 'sidebar-text';

      return(
        <Grid>
          <div style={{background: 'rgb(16, 105, 139)', color: '#FFF'}}> 
            <Row>
              <Col xs={12} sm={6} smPush={3}>
                <Image onClick={this.navigateHome} src="../../../img/ptLogoWhite.png" className="pt-logo" responsive/>
              </Col>
            </Row>
            <Row>
              <Col xs={12}  sm={6} smPush={1} className="middle-text pic-holder" >
                <Image onClick={this.navigateToManage} src={profilePicURL} className="profile-image pic-thumb" responsive />
              </Col>
              <Col xs={6} className="middle-text">
                <p className="sidebar-text">Welcome, {this.props.loginState.adminInfo ? this.props.loginState.adminInfo.firstName : this.props.loginState.teacherInfo.firstName}</p>
              </Col>
            </Row>
            <Row>
              <SideNav 
                highlightColor='black' 
                highlightBgColor='none' 
                selected={this.state.selected}
                onItemSelection={ (id, parent) => this.handleSelect(id, parent)}     
              > 
                <Nav id='analytics' className="black-text">
                    <NavIcon><i className='fa fa-bar-chart-o'/></NavIcon>
                    <NavText className='sidebar-text'>Analytics</NavText>
                </Nav>
                <Nav id='calendar'>
                    <NavIcon><i className={`fa fa-calendar ${this.state.calendarColor}`}/></NavIcon>
                    <NavText className={`sidebar-text ${this.state.calendarColor}`}>Calendar</NavText>
                </Nav>
                <Nav id='notifications'>
                    <NavIcon><i className="fa fa-envelope-o bold-font"/></NavIcon>
                    <NavText className="sidebar-text">Notifications</NavText>
                </Nav>
                <Nav id='polling'>
                    <NavIcon><i className="fa fa-pencil-square-o"/></NavIcon>
                    <NavText className="sidebar-text">Polling</NavText>
                </Nav>
                <Nav id='roster'>
                    <NavIcon><i className="fa fa-users"/></NavIcon>
                    <NavText className="sidebar-text">Roster</NavText>
                </Nav>
                <Nav id='support_student_learning'>
                    <NavIcon><i className="fa fa-graduation-cap"/></NavIcon>
                    <NavText className="sidebar-text">Student Learning</NavText>
                </Nav>
                <Nav id='manage'>
                    <NavIcon><i className='fa fa-user'/></NavIcon>
                    <NavText className='sidebar-text'>Manage</NavText>
                </Nav>
                <Nav id='logout'>
                    <NavIcon><i className="fa fa-sign-out"/></NavIcon>
                    <NavText className="sidebar-text">Logout</NavText>
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

