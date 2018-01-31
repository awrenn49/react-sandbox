import {Image, Grid, Row, Col} from 'react-bootstrap';
import React, { Component} from 'react';
import Moment from 'moment'; 
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

import ReactTable from 'react-table';

import 'react-table/react-table.css'

import { getParentsBySchoolId, getTeachersBySchoolId , getTeachersByDistrictId , getParentsByDistrictId } from '../actions/roster_action';

class DistrictRoster extends Component {

  constructor(props){
    super(props);
  }

  componentWillMount(){
    this.props.loginState.teacherInfo ? this.props.getParentsBySchoolId(this.props.loginState.teacherInfo.schoolId) 
      : this.props.loginState.adminInfo ? this.props.getParentsByDistrictId(this.props.loginState.adminInfo.districtId) 
      : null;
    this.props.loginState.teacherInfo ? this.props.getTeachersBySchoolId(this.props.loginState.teacherInfo.schoolId) 
      : this.props.loginState.adminInfo ? this.props.getTeachersByDistrictId(this.props.loginState.adminInfo.districtId) 
      : null;
  }

  render(){

    const rosterData = [];

    if(this.props.rosterType == "parents"){
      _.each(this.props.rosters.parents, function(parent){
        rosterData.push(parent);
      })
    } else {
      _.each(this.props.rosters.teachers, function(teacher){
        rosterData.push(teacher);
      })
    }

    //Ensures that duplicate uploads are not shown
    const rosterDateUniq = _.uniq(rosterData, function(data){
      return data.email
    });

    const columns = [{
      Header: 'First Name',
      accessor: 'firstName',

    }, {
      Header: 'Last Name',
      accessor: 'lastName' 
    }, {
      Header: 'Email',
      accessor: 'email' 
    }, {
      Header: 'Grade',
      accessor: 'grade'
    }]

    return(
      <ReactTable
        data={rosterDateUniq}
        columns={columns}
      />
    )   
  }

}

function mapStateToProps(state){
  var self = this;
  return { 
    rosters: state.rosters,
    loginState: state.loginState
  }
}

export default connect(mapStateToProps, { getParentsBySchoolId, getTeachersBySchoolId , getParentsByDistrictId, getTeachersByDistrictId })(DistrictRoster);

 