import {Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component  {

  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {
    return(
      <Grid>
        <div>Home</div>
      </Grid> 
    )
  }
}

function mapStateToProps(state){
  var self = this;
  return { }
}

export default connect(mapStateToProps, { })(Home);

