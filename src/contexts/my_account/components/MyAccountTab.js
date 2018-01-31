import { connect } from 'react-redux';
import {Image, Grid, Row, Col, PanelGroup, Panel, Table} from 'react-bootstrap';
import React, { Component} from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import {reducer as formReducer, Field, reduxForm } from 'redux-form';


class Districts extends Component {


  constructor(props) {
    super(props);
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className = { className }>
        <label>{field.label}</label>
        <input
          className="form-control"
          type="text"
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  onSubmit(values){
  }

  render() {
    const { handleSubmit } = this.props;

    return(
      <Grid>
        <PanelGroup>
          <Row>
            <Col xs={10}>
              <Panel expanded={true} collapsible header="Personal Information" eventKey="1">
                  <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Jim</td>
                  <td>Mixon</td>
                  <td>@jmixon</td>
                </tr>
              </tbody>
            </Table>
              </Panel>
            </Col>
          </Row>
          <Panel collapsible  header="Password" eventKey="2">
            <div></div>
          </Panel>
        </PanelGroup>
      </Grid>
    )    
  }
}

function validate(values) {
  const errors = {};

  if(!values.districtName) {
    errors.districtName = "Enter an Event Name!";
  }
  if(!values.sponsorFirstName){
    errors.sponsorFirstName = "Enter a var2";
  }
  if(!values.sponsorLastName){
    errors.sponsorLastName = "Enter a var3";
  }
  if(!values.email){
    errors.email = "Enter a date";
  }
  return errors;
}


export default reduxForm({
  validate,
  form: 'districtsForm'
})(
    connect(null, {})(Districts)
);
