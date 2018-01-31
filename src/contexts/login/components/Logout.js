import { connect } from 'react-redux';
import {Image, Grid, Row, Col, Button} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';

import { logoutUser } from '../actions/login_action';


class Logout extends Component {

  constructor(props){
    super(props);

    this.state = {};
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.logoutUser();
  }

  render(){
    return(
      <Grid>
        <Link to={`/login`}><Button onClick={this.logout} className="submit-btn margin-top-5">Logout</Button></Link> 
      </Grid>
    )   
  }
}

export default connect(null, { logoutUser })(Logout);

