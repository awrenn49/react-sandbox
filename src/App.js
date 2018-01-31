import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {Image, Grid, Row, Col} from 'react-bootstrap';

import Authorization from './contexts/utils/Authorization';

import Sidebar from './contexts/sidebar/Sidebar';

import AnalyticsScaffold from './contexts/analytics/components/AnalyticsScaffold';
import Calendar from './contexts/calendar/components/Calendar';
import ForgotPassword from './contexts/profile_settings/components/ForgotPassword';
import Login from './contexts/login/components/Login';
import Logout from './contexts/login/components/Logout';
import Manage from './contexts/manage/components/Manage';
import NotificationScaffold from './contexts/notifications/components/NotificationScaffold';
import PollingScaffold from './contexts/polling/components/Polling_Scaffold';
import Registration from './contexts/registration/components/Registration';
import Roster from './contexts/roster/components/Roster';
import StudentLearning from './contexts/student_learning/components/StudentLearning';

const Admin = Authorization();

class App extends Component {

  constructor(props) {
    super(props);
    
  }

  render(){

    var mainPage;
    if(this.props.loginState && this.props.loginState.isLoggedIn == true) {
      mainPage =  
      <div>          
        <Col xs={3} sm={2}  className="sidebar" >
          <Sidebar/>
        </Col>
        <Col xs={9} sm={10} >
          <Row>
            <Switch>
              <Route path="/analytics" component={Admin(AnalyticsScaffold)} />
              <Route path="/calendar" component={Admin(Calendar)} />
              <Route path="/forgot_password" component={ForgotPassword} />
              <Route path="/logout" component={Admin(Logout)} />
              <Route path="/manage" component={Admin(Manage)} />
              <Route path="/notifications" component={Admin(NotificationScaffold)} />
              <Route path="/polling" component={Admin(PollingScaffold)} />
              <Route path="/registration" component={Registration} />
              <Route path="/roster" component={Admin(Roster)} />
              <Route path="/support_student_learning" component={Admin(StudentLearning)} />
              <Route path="/" component={Admin(AnalyticsScaffold)} />
            </Switch>
          </Row>          
        </Col>
        <p className="copyright">PT Chat LLC &#169; 2018</p>
      </div>
    } else {
      mainPage = 
        <div className="login-background">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <Route path="/forgot_password" component={ForgotPassword} />
          </Switch>
          <p className="copyright">PT Chat LLC &#169; 2018</p>
        </div>
    }

    return(
      <BrowserRouter>
        <Grid>
          <Row>
            { mainPage }
          </Row>
        </Grid>
      </BrowserRouter>
    )   
  }
}


function mapStateToProps(state){
  var self = this;
  return { 
    loginState : state.loginState
  }
}

export default connect(mapStateToProps, {})(App);

