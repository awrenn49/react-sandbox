import {Image, Grid, Row, Col} from 'react-bootstrap';
import React from 'react';
import Moment from 'moment'; 

import _ from 'underscore';

const Poll = (props) => {
  
  var questions = [];
  _.each(props.questions, function(question, index){
    var questionType;
    question.questionType == 'range' ? questionType = 'Range' 
    : question.questionType == 'trueFalse' ? questionType = 'True / False'
    : questionType = ' Yes / No';

    var questionText = `${question.question} (${questionType})`;

    questions.push(<li key={index} className="main-dark-blue question-li small-text">{questionText}</li>);
  })

  return(
    <Grid>
      <div className="card">
        <div className="card-container">
          <Grid>
           <Row>
              <div><i onClick={e => props.handleClick(e, props)} className="fa fa-times-circle fa-lg close icon-close"/></div>
           </Row>
            <Row>
              <h4  className="main-dark-blue center-text medium-text">{props.title}</h4>
            </Row>
            <Row>
              <ul>
                { questions }
                <li key="sendDate" className="main-dark-blue question-li small-text">Send Date: {props.sendDate}</li>
              </ul>
            </Row>
          </Grid>
        </div>
      </div>
    </Grid>
  )
}

export default Poll;
