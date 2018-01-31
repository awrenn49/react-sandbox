import {Image, Grid, Row, Col, Button} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';
import firebase from '../../utils/firebase';

class ProfileSettings extends Component {

  constructor(props) {
    super(props);

  }


  render(){

    return(
      <Grid>
        <Row>
          <div>Profile Settings</div>
        </Row>
      </Grid>
    )   
  }
}

export default connect(null, {})(ProfileSettings);

