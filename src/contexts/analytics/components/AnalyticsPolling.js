import {Image, Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts'; 

import { getPollsBySchoolId, getPollsByDistrictId } from '../../polling/actions/polling_action';


class AnalyticsPolling extends Component {

  constructor(props) {
    super(props);
    
    this.renderBarCharts = this.renderBarCharts.bind(this);
  }


  componentWillMount() {
    this.props.loginState.teacherInfo ? this.props.getPollsBySchoolId(this.props.loginState.teacherInfo.schoolId)
      : this.props.getPollsByDistrictId(this.props.loginState.adminInfo.districtId);
  }

  renderBarCharts() {
    var polls = [];
    _.each(this.props.polls, function(poll){
      _.each(poll.questions, function(question){
        var data = [];
        _.each(question.questionOptions, function(questionOption, index){
          data.push({name: questionOption , count: question.answers[index].count})
        })
        var pollNow = {
          title : poll.title,
          question : question.question,
          data : data
        }
        polls.push(pollNow);
      })
    })

    var charts = [];
    _.each(polls, function(poll, index){
      charts.push(
        <Col sm={12} md={6} key={index}>
          <Row>
            <Col>
              <h5 className="main-dark-blue text-center bold text-16">{poll.question}</h5>
            </Col>
          </Row>
          <Row>
            <div>
              <ResponsiveContainer className="text-center" width="100%" height={300} >
                <BarChart
                  data={poll.data}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name">
                  </XAxis>
                  <YAxis label={{ value: 'Votes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#046ca4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Row>
          <Row>
            <Col>
              <h5 className="main-dark-blue text-center margin-top-0 margin-bottom-20">Poll: {poll.title}</h5>
            </Col>
          </Row>
        </Col>
      )
    });

    return (
      <div>
        { charts }
      </div>
    )

  }

  render(){

    return(
      <Grid>
        <Row>
            { this.renderBarCharts() }
        </Row>
      </Grid>
    )   
  }
}


function mapStateToProps(state){
  var self = this;
  return { 
    polls: state.pollingInfo,
    loginState: state.loginState 
  }
}

export default connect(mapStateToProps, { getPollsByDistrictId, getPollsBySchoolId })(AnalyticsPolling);

