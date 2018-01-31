import { connect } from 'react-redux';
import {Image, Grid, Row, Col, PanelGroup, Panel, Table} from 'react-bootstrap';
import React, { Component} from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import {reducer as formReducer, Field, reduxForm } from 'redux-form';


class Districts extends Component {


  constructor(props) {
    super(props);

    this.state = {
      'firstExpanded' : true
    }

    this.firstSelected = this.firstSelected.bind(this);
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

  firstSelected () {
    this.state.firstExpanded == true ? this.setState({firstExpanded : false}) : this.setState({firstExpanded : true})
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
              <Panel expanded={this.state.firstExpanded} onSelect={this.firstSelected} collapsible header="Add New District" eventKey="1">
                <form onSubmit={ handleSubmit(this.onSubmit.bind(this))}>
                  <Row>
                    <Col xs={8} xsPush={2}>
                      <Field
                        label="District Name"
                        name="districtName"
                        component={this.renderField}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} xsPush={2}>
                      <Field
                        label="Sponsor First Name"
                        name="sponsorFirstName"
                        component={this.renderField}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} xsPush={2}>
                      <Field
                        label="Sponsor Last Name"
                        name="sponsorLastName"
                        component={this.renderField}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} xsPush={2}>
                      <Field
                        label="Email"
                        name="email"
                        component={this.renderField}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} xsPush={2}>
                      <button type="submit" className="btn btn-primary">Submit</button>
                      <button  className="btn btn-primary">Reset</button>
                      <button to="/" className="btn btn-danger">Cancel</button>
                    </Col>
                  </Row>
                </form>
              </Panel>
            </Col>
          </Row>
          <Panel collapsible header="View Districts" eventKey="2">
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Age</th>
                  <th>Start Date</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tiger Nixon</td>
                  <td>System Architect</td>
                  <td>Edinburgh</td>
                  <td>61</td>
                  <td>2011/04/25</td>
                  <td>$320,800</td>
                </tr>
                <tr>
                  <td>Garrett Winters</td>
                  <td>Accountant</td>
                  <td>Tokyo</td>
                  <td>63</td>
                  <td>2011/07/25</td>
                  <td>$170,750</td>
                </tr>
                <tr>
                  <td>Ashton Cox</td>
                  <td>Junior Technical Author</td>
                  <td>San Francisco</td>
                  <td>66</td>
                  <td>2009/01/12</td>
                  <td>$86,000</td>
                </tr>
                <tr>
                  <td>Cedric Kelly</td>
                  <td>Senior Javascript Developer</td>
                  <td>Edinburgh</td>
                  <td>22</td>
                  <td>2012/03/29</td>
                  <td>$433,060</td>
                </tr>
                <tr>
                  <td>Airi Satou</td>
                  <td>Accountant</td>
                  <td>Tokyo</td>
                  <td>33</td>
                  <td>2008/11/28</td>
                  <td>$162,700</td>
                </tr>
                <tr>
                  <td>Brielle Williamson</td>
                  <td>Integration Specialist</td>
                  <td>New York</td>
                  <td>61</td>
                  <td>2012/12/02</td>
                  <td>$372,000</td>
                </tr>
                <tr>
                  <td>Herrod Chandler</td>
                  <td>Sales Assistant</td>
                  <td>San Francisco</td>
                  <td>59</td>
                  <td>2012/08/06</td>
                  <td>$137,500</td>
                </tr>
                <tr>
                  <td>Rhona Davidson</td>
                  <td>Integration Specialist</td>
                  <td>Tokyo</td>
                  <td>55</td>
                  <td>2010/10/14</td>
                  <td>$327,900</td>
                </tr>
                <tr>
                  <td>Colleen Hurst</td>
                  <td>Javascript Developer</td>
                  <td>San Francisco</td>
                  <td>39</td>
                  <td>2009/09/15</td>
                  <td>$205,500</td>
                </tr>
                <tr>
                  <td>Sonya Frost</td>
                  <td>Software Engineer</td>
                  <td>Edinburgh</td>
                  <td>23</td>
                  <td>2008/12/13</td>
                  <td>$103,600</td>
                </tr>
                <tr>
                  <td>Jena Gaines</td>
                  <td>Office Manager</td>
                  <td>London</td>
                  <td>30</td>
                  <td>2008/12/19</td>
                  <td>$90,560</td>
                </tr>
                <tr>
                  <td>Quinn Flynn</td>
                  <td>Support Lead</td>
                  <td>Edinburgh</td>
                  <td>22</td>
                  <td>2013/03/03</td>
                  <td>$342,000</td>
                </tr>
                <tr>
                  <td>Charde Marshall</td>
                  <td>Regional Director</td>
                  <td>San Francisco</td>
                  <td>36</td>
                  <td>2008/10/16</td>
                  <td>$470,600</td>
                </tr>
                <tr>
                  <td>Haley Kennedy</td>
                  <td>Senior Marketing Designer</td>
                  <td>London</td>
                  <td>43</td>
                  <td>2012/12/18</td>
                  <td>$313,500</td>
                </tr>
                <tr>
                  <td>Tatyana Fitzpatrick</td>
                  <td>Regional Director</td>
                  <td>London</td>
                  <td>19</td>
                  <td>2010/03/17</td>
                  <td>$385,750</td>
                </tr>
              </tbody>
            </Table>
          </Panel>
        </PanelGroup>
      </Grid>
    )    
  }
}

function validate(values) {
  const errors = {};

  if(!values.districtName) {
    errors.districtName = "Enter an district name!";
  }
  if(!values.sponsorFirstName){
    errors.sponsorFirstName = "Please enter a first name!";
  }
  if(!values.sponsorLastName){
    errors.sponsorLastName = "Please enter a last name!";
  }
  if(!values.email){
    errors.email = "Please enter an email!";
  }
  return errors;
}


export default reduxForm({
  form: 'districtsForm',
  validate
})(
    connect(null, {})(Districts)
);
