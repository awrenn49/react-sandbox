import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {Image, Grid, Row, Col} from 'react-bootstrap';

import Authorization from './contexts/utils/Authorization';

import Sidebar from './contexts/sidebar/Sidebar';

import Home from './contexts/home/components/Home';

const Admin = Authorization();

class App extends Component {

  constructor(props) {
    super(props);
    
  }

  render(){

    var mainPage;
    var isLoggedIn = true;
    if(isLoggedIn == true) {
      mainPage =  
      <div>          
        <Col xs={3} sm={2} className="sidebar" >
          <Sidebar/>
        </Col>
        <Col xs={9} sm={10} >
          <Row>
            <Switch>
              <Route path="/" component={Home} />
            </Switch>
          </Row>          
        </Col>
        <p className="copyright">Reactive Design &#169; 2018</p>
      </div>
    } else {
      mainPage = 
        <div className="login-background">
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
          <p className="copyright">Reactive Design &#169; 2018</p>
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

function mapStateToProps(){

  return {};
}

export default connect(mapStateToProps, {})(App);

