import {Image, Grid, Row, Col} from 'react-bootstrap';
import React from 'react';
import Moment from 'moment'; 

const Notification = (props) => {

  return(
    <Grid>
        <Col>
          <div className="card">
            <div className="card-container">
              <Grid>
                <Row> 
                  <div><i onClick={e => props.handleClick(e, props)} className="fa fa-times-circle fa-lg close icon-close"/></div>
                </Row>
                <Row>
                  <h4  className="center-text main-dark-blue medium-text">Notification</h4>
                </Row>
                <Row>
                  <ul>
                    <li className="question-li main-dark-blue small-text">Title: {props.title}</li>
                    <li className="question-li main-dark-blue small-text">Message: {props.message}</li>
                    <li className="question-li main-dark-blue small-text">Send Date: {props.sendDate}</li>
                  </ul>
                </Row>
              </Grid>
            </div>
          </div>
        </Col>
    </Grid>
  )
}

export default Notification;
