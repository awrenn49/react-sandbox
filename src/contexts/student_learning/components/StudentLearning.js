import {Image, Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';


class StudentLearning extends Component {

  constructor(props) {
    super(props);
  }


  render(){

    return(
      <Grid>
        <Row>
          <h3 className="title_left main-dark-blue">Support Student Learning</h3>
        </Row>
      </Grid>
    )   
  }
}

export default StudentLearning;

